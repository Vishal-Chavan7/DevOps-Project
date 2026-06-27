/**
 * REST API client for the Express backend.
 *
 * Set VITE_API_URL in frontend/.env (e.g. http://localhost:5000/api/v1).
 */

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "/api";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  number?: string;
  role: string;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("chronicle.auth.v1");
    if (!raw) return null;
    return JSON.parse(raw).token ?? null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    let message = text || `Request failed (${res.status})`;
    try {
      const body = JSON.parse(text) as { message?: string };
      if (body.message) message = body.message;
    } catch {
      // use raw text
    }
    throw new Error(message);
  }

  return text ? (JSON.parse(text) as T) : ({} as T);
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, number: string) =>
    request<{ message: string; user: ApiUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, number }),
    }),

  me: () => request<ApiUser>("/auth/me"),

  listBlogs: (params?: { search?: string; category?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return request<unknown[]>(`/blogs${q ? `?${q}` : ""}`);
  },
  getBlog: (slug: string) => request<unknown>(`/blogs/${slug}`),
  createBlog: (body: unknown) =>
    request<unknown>("/blogs", { method: "POST", body: JSON.stringify(body) }),
  updateBlog: (id: string, body: unknown) =>
    request<unknown>(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteBlog: (id: string) => request<void>(`/blogs/${id}`, { method: "DELETE" }),

  addComment: (blogId: string, content: string) =>
    request<unknown>(`/blogs/${blogId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};
