import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { format } from "date-fns";
import type { Blog } from "@/lib/mock-data";

export function BlogCard({ blog, index = 0 }: { blog: Blog; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Link
        to="/blogs/$slug"
        params={{ slug: blog.slug }}
        className="block"
      >
        <div className="mb-6 aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface ring-1 ring-border transition-all group-hover:ring-foreground/20">
          <img
            src={blog.coverImage}
            alt={blog.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </div>
        <span className="text-xs font-medium uppercase tracking-widest text-accent">
          {blog.category}
        </span>
        <h3 className="mb-3 mt-3 text-xl font-medium leading-snug transition-colors group-hover:text-accent">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {blog.excerpt}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <img
            src={blog.author.avatar}
            alt={blog.author.name}
            className="size-6 rounded-full object-cover ring-1 ring-border"
          />
          <span className="text-xs text-muted-foreground">
            {blog.author.name} · {format(new Date(blog.createdAt), "MMM d")} · {blog.readTime} min
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-6 aspect-[16/10] rounded-xl bg-surface" />
      <div className="h-3 w-20 rounded bg-surface" />
      <div className="mt-3 h-5 w-3/4 rounded bg-surface" />
      <div className="mt-2 h-4 w-full rounded bg-surface" />
    </div>
  );
}
