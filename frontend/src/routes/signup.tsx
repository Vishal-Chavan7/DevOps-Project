import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2, "Name is too short").max(60),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  number: z.string().length(10, "Enter a 10-digit phone number"),
});
type FormValues = z.infer<typeof schema>;

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — Chronicle" },
      { name: "description", content: "Join Chronicle and start publishing." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", number: "" },
  });

  const onSubmit = async (v: FormValues) => {
    try {
      await signup(v.name, v.email, v.password, v.number);
      toast.success("Welcome to Chronicle");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create account");
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-md place-items-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-3xl border border-border bg-surface p-10 shadow-card"
      >
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl">Begin your Chronicle.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create a free account to publish.</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Display name" error={form.formState.errors.name?.message}>
            <input
              {...form.register("name")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </Field>
          <Field label="Email" error={form.formState.errors.email?.message}>
            <input
              type="email"
              autoComplete="email"
              {...form.register("email")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </Field>
          <Field label="Phone number" error={form.formState.errors.number?.message}>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="numeric"
              {...form.register("number")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </Field>
          <Field label="Password" error={form.formState.errors.password?.message}>
            <input
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-hidden focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </Field>
          <button
            disabled={form.formState.isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground shadow-glow disabled:opacity-60"
          >
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            Create account
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/login" className="text-foreground hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
