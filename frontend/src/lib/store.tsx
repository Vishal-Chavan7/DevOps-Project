import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, type ApiUser } from "./api";
import { BLOGS, type Author, type Blog } from "./mock-data";

const AUTH_KEY = "chronicle.auth.v1";

interface AuthState {
  user: Author | null;
  token: string | null;
}

interface AppContextValue {
  blogs: Blog[];
  user: Author | null;
  token: string | null;
  blogsLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, number: string) => Promise<void>;
  logout: () => void;
  createBlog: (
    input: Omit<
      Blog,
      "id" | "slug" | "author" | "authorId" | "createdAt" | "comments" | "readTime"
    >,
  ) => Promise<Blog>;
  updateBlog: (id: string, patch: Partial<Blog>) => Promise<Blog>;
  deleteBlog: (id: string) => Promise<void>;
  getBlogBySlug: (slug: string) => Blog | undefined;
  loadBlogBySlug: (slug: string) => Promise<Blog | undefined>;
  addComment: (blogId: string, content: string) => Promise<Blog>;
}

const AppContext = createContext<AppContextValue | null>(null);

function toAuthor(user: ApiUser): Author {
  const username = user.email.split("@")[0];
  return {
    id: user.id,
    name: user.name,
    username,
    avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${username}`,
    bio: "Member of Chronicle.",
    role: user.role,
  };
}

function readAuth(): AuthState {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null, token: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { user: null, token: null };
  }
}

function upsertBlog(list: Blog[], blog: Blog): Blog[] {
  const index = list.findIndex((b) => b.id === blog.id);
  if (index === -1) return [blog, ...list];
  return list.map((b) => (b.id === blog.id ? blog : b));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>(BLOGS);
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const [hydrated, setHydrated] = useState(false);
  const [blogsLoading, setBlogsLoading] = useState(true);

  useEffect(() => {
    setAuth(readAuth());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    setBlogsLoading(true);
    api
      .listBlogs()
      .then((data) => setBlogs(data as Blog[]))
      .catch(() => setBlogs(BLOGS))
      .finally(() => setBlogsLoading(false));
  }, [hydrated]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await api.login(email, password);
    setAuth({ user: toAuthor(user), token });
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string, number: string) => {
      await api.register(name, email, password, number);
      const { token, user } = await api.login(email, password);
      setAuth({ user: toAuthor(user), token });
    },
    [],
  );

  const logout = useCallback(() => setAuth({ user: null, token: null }), []);

  const createBlog = useCallback(
    async (input: Omit<Blog, "id" | "slug" | "author" | "authorId" | "createdAt" | "comments" | "readTime">) => {
      if (!auth.user) throw new Error("Not authenticated");

      const blog = (await api.createBlog({
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        coverImage: input.coverImage,
        category: input.category,
        tags: input.tags,
      })) as Blog;

      setBlogs((prev) => upsertBlog(prev, blog));
      return blog;
    },
    [auth.user],
  );

  const updateBlog = useCallback(async (id: string, patch: Partial<Blog>) => {
    const updated = (await api.updateBlog(id, {
      title: patch.title,
      excerpt: patch.excerpt,
      content: patch.content,
      coverImage: patch.coverImage,
      category: patch.category,
      tags: patch.tags,
    })) as Blog;

    setBlogs((prev) => upsertBlog(prev, updated));
    return updated;
  }, []);

  const deleteBlog = useCallback(async (id: string) => {
    await api.deleteBlog(id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBlogBySlug = useCallback((slug: string) => blogs.find((b) => b.slug === slug), [blogs]);

  const loadBlogBySlug = useCallback(
    async (slug: string) => {
      const cached = blogs.find((b) => b.slug === slug);
      if (cached) return cached;

      try {
        const blog = (await api.getBlog(slug)) as Blog;
        setBlogs((prev) => upsertBlog(prev, blog));
        return blog;
      } catch {
        return undefined;
      }
    },
    [blogs],
  );

  const addComment = useCallback(async (blogId: string, content: string) => {
    if (!auth.user) throw new Error("Not authenticated");

    const blog = (await api.addComment(blogId, content)) as Blog;
    setBlogs((prev) => upsertBlog(prev, blog));
    return blog;
  }, [auth.user]);

  const value = useMemo<AppContextValue>(
    () => ({
      blogs,
      user: auth.user,
      token: auth.token,
      blogsLoading,
      login,
      signup,
      logout,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogBySlug,
      loadBlogBySlug,
      addComment,
    }),
    [
      blogs,
      auth,
      blogsLoading,
      login,
      signup,
      logout,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogBySlug,
      loadBlogBySlug,
      addComment,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
