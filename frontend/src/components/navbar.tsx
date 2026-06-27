import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, PenLine, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/lib/store";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { to: "/blogs", label: "Stories" },
  { to: "/blogs", label: "Explore", search: { category: "Design" } },
];

export function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-serif text-2xl italic tracking-tight">
            Chronicle
          </Link>
          <div className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex">
            <Link
              to="/blogs"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              Stories
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                Dashboard
              </Link>
            )}
            <Link
              to="/profile"
              className="transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              Profile
            </Link>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {user ? (
            <>
              <Link
                to="/editor/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground shadow-glow transition-transform hover:scale-[1.02] active:scale-100"
              >
                <PenLine className="size-3.5" /> Write
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100"
              >
                Start Writing
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden grid size-9 place-items-center rounded-full border border-border"
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3">
          <Link to="/blogs" onClick={() => setOpen(false)} className="block text-sm">Stories</Link>
          {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="block text-sm">Dashboard</Link>}
          <Link to="/profile" onClick={() => setOpen(false)} className="block text-sm">Profile</Link>
          <div className="flex items-center gap-3 pt-2">
            <ThemeToggle />
            {user ? (
              <Link to="/editor/new" onClick={() => setOpen(false)} className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">Write</Link>
            ) : (
              <Link to="/signup" onClick={() => setOpen(false)} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Start Writing</Link>
            )}
          </div>
        </div>
      )}
      {/* suppress unused warning */}
      <span hidden>{pathname}{links.length}</span>
    </nav>
  );
}
