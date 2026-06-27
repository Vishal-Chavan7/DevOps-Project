import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import type { Blog } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/mock-data";

export const blogSchema = z.object({
  title: z.string().min(4, "Title is too short").max(120),
  excerpt: z.string().min(20, "Excerpt should be at least 20 chars").max(280),
  coverImage: z.string().url("Cover image must be a valid URL"),
  category: z.string().min(1),
  tags: z.string().min(1, "Add at least one tag"),
  content: z.string().min(50, "Story should be at least 50 chars"),
});
export type BlogFormValues = z.infer<typeof blogSchema>;

export function BlogEditorForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Partial<Blog>;
  submitLabel: string;
  onSubmit: (values: BlogFormValues) => Promise<void> | void;
}) {
  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initial?.title ?? "",
      excerpt: initial?.excerpt ?? "",
      coverImage: initial?.coverImage ?? "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
      category: initial?.category ?? CATEGORIES[0],
      tags: initial?.tags?.join(", ") ?? "",
      content: initial?.content ?? "",
    },
  });

  const cover = form.watch("coverImage");

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-5">
        <div>
          <input
            placeholder="Story title"
            {...form.register("title")}
            className="w-full bg-transparent font-serif text-4xl placeholder:text-muted-foreground/40 focus:outline-none md:text-5xl"
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-xs text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Short excerpt — what's this story about?"
            rows={2}
            {...form.register("excerpt")}
            className="w-full resize-none bg-transparent text-lg text-muted-foreground placeholder:text-muted-foreground/40 focus:outline-none"
          />
          {form.formState.errors.excerpt && (
            <p className="text-xs text-destructive">{form.formState.errors.excerpt.message}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="Tell your story. Use blank lines to separate paragraphs, and `> ` to start a blockquote."
            rows={16}
            {...form.register("content")}
            className="w-full resize-none rounded-xl border border-border bg-surface/40 p-5 font-serif text-lg leading-relaxed focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          {form.formState.errors.content && (
            <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
          )}
        </div>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-surface/40 p-5 space-y-4">
          <div>
            <Label>Cover image URL</Label>
            <input
              {...form.register("coverImage")}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {cover && (
              <div className="mt-3 aspect-[16/10] overflow-hidden rounded-lg ring-1 ring-border">
                <img src={cover} alt="" className="size-full object-cover" />
              </div>
            )}
            {form.formState.errors.coverImage && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.coverImage.message}</p>
            )}
          </div>

          <div>
            <Label>Category</Label>
            <select
              {...form.register("category")}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <Label>Tags (comma separated)</Label>
            <input
              placeholder="design, typography, focus"
              {...form.register("tags")}
              className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {form.formState.errors.tags && (
              <p className="mt-1 text-xs text-destructive">{form.formState.errors.tags.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm font-semibold text-accent-foreground shadow-glow disabled:opacity-60"
        >
          {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {submitLabel}
        </button>
      </aside>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">{children}</span>;
}
