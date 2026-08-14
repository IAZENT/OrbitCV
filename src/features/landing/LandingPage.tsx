import { Link } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  const { session } = useSession();

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            One CV, tailored per application
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted-foreground">
            Build a single master CV, then tailor it for each job you apply to. Export as an
            ATS-safe PDF. No cost, no catch.
          </p>

          <div className="mt-8 flex gap-3">
            {session ? (
              <Button asChild>
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link to="/login">Get started</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-lg text-foreground">Master CV</h2>
            <p className="text-sm text-muted-foreground">
              Build your CV once with a structured form. Edit it, add experience, keep it current.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-lg text-foreground">Tailor per job</h2>
            <p className="text-sm text-muted-foreground">
              Duplicate your CV for a specific role. Adjust bullets, match keywords, optionally use
              AI to rewrite.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-lg text-foreground">Export safely</h2>
            <p className="text-sm text-muted-foreground">
              Download as a real-text PDF that applicant tracking systems can read. No images, no
              formatting tricks.
            </p>
          </div>
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground">
          Built for Nepal and international job markets. Always free.
        </p>
      </main>
    </AppShell>
  );
}
