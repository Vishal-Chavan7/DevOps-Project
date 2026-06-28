import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { EmptyState } from "@/components/empty-state";
import { Pencil, Trash2, Eye, PenLine } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Chronicle" },
      { name: "description", content: "Manage your stories on Chronicle." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, blogs, deleteBlog } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">Sign in to access your dashboard</h1>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Sign in
        </Link>
      </div>
    );
  }

  const mine = blogs.filter((b) => b.authorId === user.id);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this story?")) return;
    try {
      await deleteBlog(id);
      toast.success("Story deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete story");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Your Studio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mine.length} {mine.length === 1 ? "story" : "stories"} in your library.
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/editor/new" })}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-glow"
        >
          <PenLine className="size-4" /> New story
        </button>
      </header>

      {mine.length === 0 ? (
        <EmptyState
          title="No stories yet"
          description="Your draft and published stories will live here."
          action={
            <Link to="/editor/new" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
              Start writing
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/40">
          {mine.map((b, i) => (
            <div
              key={b.id}
              className={`flex flex-col gap-4 p-5 md:flex-row md:items-center ${
                i !== 0 ? "border-t border-border" : ""
              }`}
            >
              <img src={b.coverImage} alt={b.title} className="aspect-[16/10] w-full rounded-lg object-cover md:w-40" />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-widest text-accent">{b.category}</p>
                <h3 className="mt-1 truncate font-serif text-xl">{b.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{b.excerpt}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Published {format(new Date(b.createdAt), "MMM d, yyyy")} · {b.readTime} min · {b.comments.length} comments
                </p>
              </div>
              <div className="flex gap-2">
                <Link to="/blogs/$slug" params={{ slug: b.slug }} className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="View">
                  <Eye className="size-4" />
                </Link>
                <Link to="/editor/$id" params={{ id: b.id }} className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Edit">
                  <Pencil className="size-4" />
                </Link>
                <button onClick={() => handleDelete(b.id)} className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-destructive" aria-label="Delete">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
