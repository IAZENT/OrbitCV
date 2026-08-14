import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const navigate = useNavigate();
  const { session } = useSession();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={session ? "/dashboard" : "/login"} className="text-lg">
          OrbitCV
        </Link>
        {session && (
          <nav className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Your CVs</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/jobs">Find jobs</Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign out
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
