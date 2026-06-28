import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { CATEGORIES } from "@/lib/mock-data";
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/blogs/")({
  head: () => ({
    meta: [
      { title: "All Stories — Chronicle" },
      { name: "description", content: "Browse every story published on Chronicle. Search and filter by category." },
      { property: "og:title", content: "All Stories — Chronicle" },
      { property: "og:description", content: "Browse every story published on Chronicle." },
    ],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const { blogs, blogsLoading } = useApp();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const matchesCat = cat === "All" || b.category === cat;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [blogs, query, cat]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-5xl md:text-6xl">The Archive</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Every story, essay, and dispatch published on Chronicle.
        </p>
      </header>

      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, tags..."
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-11 pr-4 text-sm outline-hidden transition-all focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                cat === c
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface/40 text-muted-foreground hover:bg-surface"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {blogsLoading ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={blogs.length === 0 ? "No stories yet" : "No stories match your search"}
          description={
            blogs.length === 0
              ? "Be the first to publish on Chronicle."
              : "Try a different keyword or clear the filter."
          }
          action={
            blogs.length === 0 ? (
              <Link
                to="/editor/new"
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground"
              >
                Publish a story
              </Link>
            ) : (
              <button
                onClick={() => {
                  setQuery("");
                  setCat("All");
                }}
                className="rounded-full border border-border px-4 py-2 text-sm"
              >
                Reset filters
              </button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b, i) => (
            <BlogCard key={b.id} blog={b} index={i} />
          ))}
        </div>
      )}

      <p className="mt-12 text-center text-xs text-muted-foreground">
        Showing {filtered.length} of {blogs.length} stories.{" "}
        <Link to="/editor/new" className="text-accent hover:underline">
          Publish your own →
        </Link>
      </p>
    </div>
  );
}
