import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "✦",
    title: "Master CV Builder",
    body: "Build once with real-time preview and regional standards baked in.",
  },
  {
    icon: "◎",
    title: "ATS Scoring Engine",
    body: "Instant feedback on formatting, keyword density, and quantified impact.",
  },
  {
    icon: "✧",
    title: "AI Job Tailoring",
    body: "Tailor bullets to any job description, without fabricating experience.",
  },
  {
    icon: "⊹",
    title: "Integrated Job Search",
    body: "Listings from RemoteOK, Adzuna, Jooble, and Nepal job portals.",
  },
  {
    icon: "◈",
    title: "Writing Guide",
    body: "Bullet formulas, recruiter rules, and ATS best practices built-in.",
  },
  {
    icon: "❋",
    title: "ATS-Safe PDF Export",
    body: "Single-column PDFs with selectable text. Zero rasterization, ever.",
  },
];

export function LandingPage() {
  const { session } = useSession();

  return (
    /*
     * Desktop: fills the space between header and footer exactly, no scroll.
     * Mobile: natural document flow, scrolls freely.
     * Header ~57px + footer ~69px = 126px total chrome.
     */
    <main className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

      {/* Ambient glow, decorative */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <div className="h-72 w-[48rem] bg-gradient-to-b from-primary/15 via-primary/5 to-transparent blur-3xl" />
      </div>

      {/* Desktop layout: fixed height, flex column, no overflow */}
      <div className="hidden lg:flex lg:h-[calc(100vh-126px)] lg:flex-col lg:justify-evenly lg:py-6">

        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            ATS-Optimized · Free Forever · BYOK AI
          </span>

          <h1 className="mt-5 font-display text-5xl tracking-tight text-foreground xl:text-6xl">
            One Master CV.{" "}
            <span className="text-primary">Tailored for Every Role.</span>
          </h1>

          <p className="mt-3 max-w-lg text-sm text-muted-foreground xl:text-base">
            Build your master CV, score ATS compliance, tailor with AI, and find global &amp; local jobs, all in one place, completely free.
          </p>

          <div className="mt-6 flex items-center gap-3">
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
                  <Link to="/jobs">Browse jobs</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Feature grid */}
        <section aria-label="Features">
          <div className="grid grid-cols-3 gap-3 xl:gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card/80 px-5 py-4 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-card hover:shadow-sm"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-base text-primary opacity-70">{f.icon}</span>
                  <h2 className="font-display text-sm text-foreground group-hover:text-primary">
                    {f.title}
                  </h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom tagline */}
        <p className="text-center text-xs text-muted-foreground">
          Supports International · Nepal · UK · Germany formats
          <span className="mx-2 opacity-30">•</span>
          Your Gemini or OpenRouter key goes directly to the provider, never through our servers
        </p>
      </div>

      {/* Mobile / tablet layout: natural scroll */}
      <div className="flex flex-col gap-10 py-10 lg:hidden">

        {/* Hero */}
        <section className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary" />
            ATS-Optimized · Free Forever · BYOK AI
          </span>

          <h1 className="mt-5 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
            One Master CV.{" "}
            <span className="text-primary">Tailored for Every Role.</span>
          </h1>

          <p className="mt-3 max-w-sm text-sm text-muted-foreground sm:max-w-md sm:text-base">
            Build your master CV, score ATS compliance, tailor with AI, and find global &amp; local jobs, completely free.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            {session ? (
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/dashboard">Go to dashboard</Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/login">Get started free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                  <Link to="/jobs">Browse jobs</Link>
                </Button>
              </>
            )}
          </div>
        </section>

        {/* Feature grid: 1 col on mobile, 2 col on sm */}
        <section aria-label="Features">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border border-border bg-card/80 px-5 py-4 transition-all duration-200 hover:border-primary/30 hover:bg-card"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-base text-primary opacity-70">{f.icon}</span>
                  <h2 className="font-display text-sm text-foreground group-hover:text-primary">
                    {f.title}
                  </h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom tagline */}
        <p className="pb-2 text-center text-xs text-muted-foreground">
          Supports International · Nepal · UK · Germany formats
          <br className="sm:hidden" />
          <span className="mx-2 hidden opacity-30 sm:inline">•</span>
          Your Gemini or OpenRouter key goes directly to the provider, never our servers
        </p>
      </div>

    </main>
  );
}
