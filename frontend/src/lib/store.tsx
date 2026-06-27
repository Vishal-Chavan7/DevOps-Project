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
import { BLOGS, type Author, type Blog, type Comment } from "./mock-data";

const BLOGS_KEY = "chronicle.blogs.v1";
const AUTH_KEY = "chronicle.auth.v1";

interface AuthState {
  user: Author | null;
  token: string | null;
}

interface AppContextValue {
  blogs: Blog[];
  user: Author | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, number: string) => Promise<void>;
  logout: () => void;
  createBlog: (
    input: Omit<
      Blog,
      "id" | "slug" | "author" | "authorId" | "createdAt" | "comments" | "readTime"
    >,
  ) => Promise<Blog>;
  updateBlog: (id: string, patch: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlogBySlug: (slug: string) => Blog | undefined;
  addComment: (blogId: string, content: string) => void;
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

function readBlogs(): Blog[] {
  if (typeof window === "undefined") return BLOGS;
  try {
    const raw = localStorage.getItem(BLOGS_KEY);
    if (!raw) return BLOGS;
    return JSON.parse(raw) as Blog[];
  } catch {
    return BLOGS;
  }
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [blogs, setBlogs] = useState<Blog[]>(BLOGS);
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setBlogs(readBlogs());
    setAuth(readAuth());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
  }, [blogs, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  }, [auth, hydrated]);

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

  const createBlog = useCallback(async (input: Omit<Blog, "id" | "slug" | "author" | "authorId" | "createdAt" | "comments" | "readTime">) => {
    if (!auth.user) throw new Error("Not authenticated");

    const blog = (await api.createBlog({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage,
      category: input.category,
      tags: input.tags,
    })) as Blog;

    setBlogs((prev) => [blog, ...prev]);
    return blog;
  }, [auth.user]);

  const updateBlog = useCallback((id: string, patch: Partial<Blog>) => {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const deleteBlog = useCallback((id: string) => {
    setBlogs((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const getBlogBySlug = useCallback((slug: string) => blogs.find((b) => b.slug === slug), [blogs]);

  const addComment = useCallback(
    (blogId: string, content: string) => {
      if (!auth.user) return;
      const comment: Comment = {
        id: `c_${Date.now()}`,
        author: auth.user,
        content,
        createdAt: new Date().toISOString(),
      };
      setBlogs((prev) =>
        prev.map((b) => (b.id === blogId ? { ...b, comments: [...b.comments, comment] } : b)),
      );
    },
    [auth.user],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      blogs,
      user: auth.user,
      token: auth.token,
      login,
      signup,
      logout,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogBySlug,
      addComment,
    }),
    [
      blogs,
      auth,
      login,
      signup,
      logout,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlogBySlug,
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
