import { Link } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

const features: Array<{ title: string; body: string }> = [
  {
    title: "Master CV",
    body: "Build your CV once with a structured form. Edit it, add experience, keep it current.",
  },
  {
    title: "ATS score",
    body: "A real scoring model checks formatting, keywords, and quantified impact, and shows exactly what to fix.",
  },
  {
    title: "Tailor per job",
    body: "Duplicate your CV for a specific role. Match keywords against the job description, optionally use AI to rewrite.",
  },
  {
    title: "Find jobs",
    body: "Search RemoteOK, Arbeitnow, Adzuna, and Jooble, plus a Nepal-specific source, ranked toward home if that's where you're looking.",
  },
  {
    title: "Writing guide",
    body: "Real good-vs-bad CV examples, bullet-point formulas, and what to leave off, not generic tips.",
  },
  {
    title: "Export safely",
    body: "Download as a real-text PDF that applicant tracking systems can read. No images, no formatting tricks.",
  },
];

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
            Build a single master CV, score it against real ATS criteria, tailor it for each job,
            and find roles to apply to. No cost, no catch.
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

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex flex-col gap-2">
              <h2 className="font-display text-lg text-foreground">{feature.title}</h2>
              <p className="text-sm text-muted-foreground">{feature.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-xs text-muted-foreground">
          International, Nepal, UK, and Germany CV formats. Built for Nepal and international job
          markets. Always free.
        </p>
      </main>
    </AppShell>
  );
}
