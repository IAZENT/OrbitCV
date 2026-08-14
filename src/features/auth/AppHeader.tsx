import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading } = useSession();

  async function handleSignOut() {
    await supabase.auth.signOut();
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to={session ? "/dashboard" : "/"} className="flex items-center">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Orbit<span className="text-primary">CV</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
              <div className="h-8 w-16 animate-pulse rounded-md bg-muted" />
            </div>
          ) : session ? (
            <>
              <Button variant={isNavActive("dashboard") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/dashboard">Your CVs</Link>
              </Button>
              <Button variant={isNavActive("jobs") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/jobs">Find jobs</Link>
              </Button>
              <Button variant={isNavActive("guide") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/guide">Writing guide</Link>
              </Button>
              <Button variant={isNavActive("profile") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
              <Button variant={isNavActive("settings") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/settings">Settings</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="ml-1 text-xs">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant={isNavActive("jobs") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/jobs">Find jobs</Link>
              </Button>
              <Button variant={isNavActive("guide") ? "secondary" : "ghost"} size="sm" asChild>
                <Link to="/guide">Writing guide</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild className="ml-1">
                <Link to="/login">Get Started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
