import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-12 px-6 md:flex-row">
        <div className="max-w-xs">
          <span className="font-serif text-2xl italic">Chronicle</span>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            A premium space for high-fidelity writing and thought leadership.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16 md:grid-cols-3">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/blogs" className="hover:text-accent">Stories</Link></li>
              <li><Link to="/editor/new" className="hover:text-accent">Editor</Link></li>
              <li><Link to="/profile" className="hover:text-accent">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Resources</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-accent">Support</a></li>
              <li><a href="#" className="hover:text-accent">Privacy</a></li>
              <li><a href="#" className="hover:text-accent">Terms</a></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground">Connect</h4>
            <div className="mt-4 flex gap-3 text-muted-foreground">
              {["X", "In", "Ig"].map((s) => (
                <span
                  key={s}
                  className="grid size-8 cursor-pointer place-items-center rounded-full border border-border text-xs transition-colors hover:bg-surface"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-16 max-w-7xl border-t border-border px-6 pt-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        © {new Date().getFullYear()} Chronicle Media Group. All rights reserved.
      </div>
    </footer>
  );
}
