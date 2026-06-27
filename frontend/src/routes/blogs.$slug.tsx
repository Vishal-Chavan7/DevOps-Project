import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { BlogCard } from "@/components/blog-card";

export const Route = createFileRoute("/blogs/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Chronicle` },
      { name: "description", content: "Read this story on Chronicle." },
    ],
  }),
  component: BlogDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-4xl">Story not found</h1>
      <Link to="/blogs" className="mt-6 inline-block text-accent hover:underline">
        ← Back to archive
      </Link>
    </div>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const { getBlogBySlug, blogs, user, addComment, deleteBlog } = useApp();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");

  const blog = getBlogBySlug(slug);
  if (!blog) throw notFound();

  const related = blogs.filter((b) => b.id !== blog.id && b.category === blog.category).slice(0, 3);

  const isOwner = user?.id === blog.authorId;

  const handleDelete = () => {
    if (!confirm("Delete this story permanently?")) return;
    deleteBlog(blog.id);
    toast.success("Story deleted");
    navigate({ to: "/blogs" });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to comment");
      navigate({ to: "/login" });
      return;
    }
    if (!comment.trim()) return;
    addComment(blog.id, comment.trim());
    setComment("");
    toast.success("Comment posted");
  };

  return (
    <article>
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl px-6 pt-20 pb-12 text-center"
      >
        <span className="text-xs font-medium uppercase tracking-widest text-accent">
          {blog.category}
        </span>
        <h1 className="mt-4 font-serif text-4xl leading-[1.1] md:text-6xl">{blog.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="size-10 rounded-full object-cover ring-1 ring-border"
          />
          <div className="text-left text-sm">
            <p className="font-semibold">{blog.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(blog.createdAt), "MMMM d, yyyy")} · {blog.readTime} min read
            </p>
          </div>
          {isOwner && (
            <div className="ml-4 flex gap-2">
              <Link
                to="/editor/$id"
                params={{ id: blog.id }}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground"
                aria-label="Edit"
              >
                <Pencil className="size-4" />
              </Link>
              <button
                onClick={handleDelete}
                className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          )}
        </div>
      </motion.header>

      <div className="mx-auto max-w-4xl px-6">
        <div className="overflow-hidden rounded-2xl ring-1 ring-border">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="font-serif text-lg leading-relaxed text-foreground/90 space-y-6">
          {blog.content.split("\n\n").map((p, i) =>
            p.startsWith("> ") ? (
              <blockquote
                key={i}
                className="border-l-2 border-accent pl-6 italic text-foreground/80"
              >
                {p.slice(2)}
              </blockquote>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Author card */}
        <Link
          to="/profile"
          className="mt-16 flex items-start gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
        >
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="size-14 rounded-full object-cover ring-1 ring-border"
          />
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Written by</p>
            <p className="mt-1 font-serif text-xl">{blog.author.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{blog.author.bio}</p>
          </div>
        </Link>

        {/* Comments */}
        <section className="mt-16">
          <h3 className="mb-6 flex items-center gap-2 font-serif text-2xl">
            <MessageCircle className="size-5 text-accent" />
            Comments ({blog.comments.length})
          </h3>

          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={user ? "Share your thoughts..." : "Sign in to leave a comment"}
              rows={3}
              className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-hidden transition-all focus:border-accent focus:ring-1 focus:ring-accent"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={!comment.trim()}
                className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-foreground disabled:opacity-40"
              >
                Post comment
              </button>
            </div>
          </form>

          <ul className="space-y-6">
            {blog.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet. Be the first.</p>
            ) : (
              blog.comments.map((c) => (
                <li
                  key={c.id}
                  className="flex gap-3 rounded-xl border border-border bg-surface/40 p-4"
                >
                  <img
                    src={c.author.avatar}
                    alt={c.author.name}
                    className="size-9 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{c.author.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(c.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground/90">{c.content}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20 border-t border-border">
          <h3 className="mb-12 font-serif text-3xl">Related stories</h3>
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-3">
            {related.map((b, i) => (
              <BlogCard key={b.id} blog={b} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
