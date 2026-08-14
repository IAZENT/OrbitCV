import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "Master CV Builder",
    body: "Build once in a single form with real-time preview and regional standards.",
  },
  {
    title: "ATS Scoring Engine",
    body: "Instant feedback on formatting, keyword density, and quantified impact.",
  },
  {
    title: "AI Job Tailoring",
    body: "Tailor bullets to job descriptions without fabricating experience.",
  },
  {
    title: "Integrated Job Search",
    body: "Aggregated listings from RemoteOK, Adzuna, Jooble, and Nepal job portals.",
  },
  {
    title: "Writing Guide",
    body: "Bullet formulas, recruiter rules, and ATS best practices built-in.",
  },
  {
    title: "ATS-Safe PDF Export",
    body: "Standard single-column PDFs with selectable text. Zero rasterization.",
  },
];

export function LandingPage() {
  const { session } = useSession();

  return (
    <main className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-between px-4 py-6 sm:px-6 lg:px-8">
      {/* Subtle Ambient Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl" aria-hidden="true">
        <div className="h-64 w-[36rem] bg-gradient-to-tr from-primary/20 to-accent/20 opacity-40" />
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center pt-4 text-center sm:pt-8">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          ATS-Optimized Master CV Platform
        </div>

        <h1 className="mt-4 max-w-3xl font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          One Master CV. <br className="hidden sm:inline" />
          <span className="text-primary">Tailored for Every Role.</span>
        </h1>

        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Build your master CV, score ATS compliance, tailor applications with AI, and find global & local jobs. 100% free.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {session ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/login">Get started free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/jobs">Find jobs</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Compact Features Grid (No Icons) */}
      <section className="my-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col justify-center rounded-xl border border-border bg-card/80 p-5 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
            >
              <h2 className="font-display text-base font-semibold text-foreground group-hover:text-primary">
                {feature.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{feature.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="pb-2 text-center text-xs text-muted-foreground">
        Supports International, Nepal, UK & Germany formats • 100% free BYOK AI model
      </footer>
    </main>
  );
}
