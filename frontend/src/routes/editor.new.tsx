import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { BlogEditorForm, type BlogFormValues } from "@/components/blog-editor-form";

export const Route = createFileRoute("/editor/new")({
  head: () => ({
    meta: [
      { title: "New story — Chronicle" },
      { name: "description", content: "Write and publish a new story on Chronicle." },
    ],
  }),
  component: NewEditor,
});

function NewEditor() {
  const { user, createBlog } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">Sign in to publish</h1>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const onSubmit = async (v: BlogFormValues) => {
    try {
      const blog = await createBlog({
        title: v.title,
        excerpt: v.excerpt,
        coverImage: v.coverImage,
        category: v.category,
        tags: v.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        content: v.content,
      });
      toast.success("Story published");
      navigate({ to: "/blogs/$slug", params: { slug: blog.slug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to publish story");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-2 text-xs uppercase tracking-widest text-accent">New story</p>
      <BlogEditorForm submitLabel="Publish story" onSubmit={onSubmit} />
    </div>
  );
}
