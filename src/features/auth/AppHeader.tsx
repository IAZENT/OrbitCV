import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setMobileOpen(false);
    navigate("/login");
  }

  const isNavActive = (key: string) => {
    const path = location.pathname;
    if (key === "dashboard") return path === "/dashboard" || path.startsWith("/cv/");
    if (key === "jobs") return path.startsWith("/jobs");
    if (key === "guide") return path.startsWith("/guide");
    if (key === "profile") return path.startsWith("/profile") || path.startsWith("/onboarding");
    if (key === "settings") return path.startsWith("/settings");
    return false;
  };

  const navLinks = session
    ? [
        { key: "dashboard", to: "/dashboard", label: "Your CVs" },
        { key: "jobs",      to: "/jobs",       label: "Find jobs" },
        { key: "guide",     to: "/guide",      label: "Writing guide" },
        { key: "profile",   to: "/profile",    label: "Profile" },
        { key: "settings",  to: "/settings",   label: "Settings" },
      ]
    : [
        { key: "jobs",  to: "/jobs",   label: "Find jobs" },
        { key: "guide", to: "/guide",  label: "Writing guide" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to={session ? "/dashboard" : "/"}
          className="flex items-center"
          onClick={() => setMobileOpen(false)}
        >
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Orbit<span className="text-primary">CV</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex sm:gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : (
            <>
              {navLinks.map((l) => (
                <Button
                  key={l.key}
                  variant={isNavActive(l.key) ? "secondary" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link to={l.to}>{l.label}</Link>
                </Button>
              ))}
              {session ? (
                <Button variant="outline" size="sm" onClick={handleSignOut} className="ml-1 text-xs">
                  Sign out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild className="ml-1">
                    <Link to="/login">Get started</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </nav>

        {/* Mobile: right side */}
        <div className="flex items-center gap-2 sm:hidden">
          {!session && !loading && (
            <Button size="sm" asChild>
              <Link to="/login">Get started</Link>
            </Button>
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 sm:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  isNavActive(l.key)
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-1 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
