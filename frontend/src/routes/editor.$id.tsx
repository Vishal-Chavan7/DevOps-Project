import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/store";
import { BlogEditorForm, type BlogFormValues } from "@/components/blog-editor-form";

export const Route = createFileRoute("/editor/$id")({
  head: () => ({
    meta: [
      { title: "Edit story — Chronicle" },
      { name: "description", content: "Edit your story on Chronicle." },
    ],
  }),
  component: EditEditor,
});

function EditEditor() {
  const { id } = Route.useParams();
  const { user, blogs, updateBlog } = useApp();
  const navigate = useNavigate();

  const blog = blogs.find((b) => b.id === id);
  if (!blog) throw notFound();

  if (!user || user.id !== blog.authorId) {
    return (
      <div className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-serif text-3xl">You don't have access to edit this story</h1>
        <Link to="/blogs" className="mt-6 inline-block text-accent hover:underline">
          ← Back to archive
        </Link>
      </div>
    );
  }

  const onSubmit = async (v: BlogFormValues) => {
    updateBlog(blog.id, {
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
    toast.success("Story updated");
    navigate({ to: "/blogs/$slug", params: { slug: blog.slug } });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="mb-2 text-xs uppercase tracking-widest text-accent">Editing</p>
      <BlogEditorForm initial={blog} submitLabel="Save changes" onSubmit={onSubmit} />
    </div>
  );
}
