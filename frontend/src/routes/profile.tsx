import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { BlogCard } from "@/components/blog-card";
import { EmptyState } from "@/components/empty-state";
import { PenLine } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Chronicle" },
      { name: "description", content: "Your Chronicle profile and published stories." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, blogs } = useApp();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">Sign in to view your profile</h1>
        <Link to="/login" className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Sign in
        </Link>
      </div>
    );
  }

  const mine = blogs.filter((b) => b.authorId === user.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12 flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:text-left">
        <img src={user.avatar} alt={user.name} className="size-24 rounded-full object-cover ring-1 ring-border" />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-accent">{user.role}</p>
          <h1 className="mt-2 font-serif text-4xl">{user.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
          <p className="mt-4 max-w-xl text-foreground/80">{user.bio}</p>
        </div>
      </header>

      <div className="mb-8 flex items-end justify-between border-b border-border pb-4">
        <h2 className="font-serif text-2xl">Published stories ({mine.length})</h2>
        <Link to="/editor/new" className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          <PenLine className="size-3.5" /> Write new
        </Link>
      </div>

      {mine.length === 0 ? (
        <EmptyState
          title="You haven't published yet"
          description="Your published stories will appear here."
          action={
            <Link to="/editor/new" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
              Write your first story
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {mine.map((b, i) => <BlogCard key={b.id} blog={b} index={i} />)}
        </div>
      )}
    </div>
  );
}
