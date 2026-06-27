import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/lib/store";
import { BlogCard } from "@/components/blog-card";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chronicle — Writing for the thoughtful reader" },
      { name: "description", content: "A premium blog platform for thoughtful writing. Discover stories on design, culture, technology, and the future." },
      { property: "og:title", content: "Chronicle — Writing for the thoughtful reader" },
      { property: "og:description", content: "A premium blog platform for thoughtful writing." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { blogs } = useApp();
  const featured = blogs[0];
  const rest = blogs.slice(1, 4);

  if (!featured) return null;

  return (
    <>
      {/* HERO */}
      <header className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute right-0 top-0 -z-10 size-[500px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-7"
            >
              <span className="mb-4 inline-flex w-fit items-center gap-2 text-sm font-medium uppercase tracking-widest text-accent">
                <Sparkles className="size-3.5" /> Featured Story
              </span>
              <h1 className="mb-6 font-serif text-5xl leading-[1.05] md:text-7xl">
                {featured.title.split(" ").slice(0, -2).join(" ")}{" "}
                <span className="italic text-accent">
                  {featured.title.split(" ").slice(-2).join(" ")}.
                </span>
              </h1>
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {featured.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/blogs/$slug"
                  params={{ slug: featured.slug }}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  Read the story <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/blogs"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Browse the archive →
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <img
                  src={featured.author.avatar}
                  alt={featured.author.name}
                  className="size-12 rounded-full object-cover ring-1 ring-border"
                />
                <div>
                  <p className="text-sm font-semibold">{featured.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {featured.author.role} · {featured.readTime} min read
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="lg:col-span-5"
            >
              <Link
                to="/blogs/$slug"
                params={{ slug: featured.slug }}
                className="block overflow-hidden rounded-2xl ring-1 ring-border"
              >
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
                />
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* FEED */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <h2 className="font-serif text-3xl">Latest Journals</h2>
            <p className="mt-2 text-sm text-muted-foreground">Curated writing from the Chronicle community.</p>
          </div>
          <Link
            to="/blogs"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((b, i) => (
            <BlogCard key={b.id} blog={b} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-border bg-surface p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
          <div className="relative z-10 w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl">Join the circle.</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Receive the finest thinking, delivered weekly.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-4"
            >
              <input
                type="email"
                required
                placeholder="email@address.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden transition-all focus:border-accent focus:ring-1 focus:ring-accent"
              />
              <button className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-glow transition-colors">
                Subscribe to Chronicle
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Already a member?{" "}
              <Link to="/login" className="text-foreground hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Last issue published {format(new Date(featured.createdAt), "MMMM d, yyyy")}
        </p>
      </section>
    </>
  );
}
