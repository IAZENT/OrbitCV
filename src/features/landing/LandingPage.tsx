import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { Button } from "@/components/ui/button";

const features = [
  { icon: "✦", title: "Master CV Builder",    body: "Build once with real-time preview and regional standards baked in." },
  { icon: "◎", title: "ATS Scoring Engine",   body: "Instant feedback on formatting, keyword density, and quantified impact." },
  { icon: "✧", title: "AI Job Tailoring",     body: "Tailor bullets to any job description, without fabricating experience." },
  { icon: "⊹", title: "Integrated Job Search",body: "Listings from RemoteOK, Adzuna, Jooble, and Nepal job portals." },
  { icon: "◈", title: "Writing Guide",        body: "Bullet formulas, recruiter rules, and ATS best practices built-in." },
  { icon: "❋", title: "ATS-Safe PDF Export",  body: "Single-column PDFs with selectable text. Zero rasterization, ever." },
];

/** Inline product mockup — matches the illustration in docs/element.png */
function ProductMockup() {
  return (
    <div className="relative h-[420px] w-full select-none" aria-hidden="true">

      {/* Ambient blob */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* ── Main CV card ── */}
      <div className="absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-white px-5 py-4 shadow-xl">
        <p className="mb-3 font-display text-base text-foreground">Your CV</p>
        {/* avatar + name lines */}
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
            <span className="text-xs text-muted-foreground">👤</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="h-2 w-20 rounded-full bg-foreground/20" />
            <div className="h-1.5 w-14 rounded-full bg-muted" />
          </div>
        </div>
        {/* sections */}
        {["Experience", "Skills", "Education"].map((s) => (
          <div key={s} className="mb-2">
            <p className="mb-1 text-[10px] font-semibold text-foreground">{s}</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                <div className="h-1.5 w-full rounded-full bg-muted" />
              </div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                <div className="h-1.5 w-3/4 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── AI Tailor panel (left) ── */}
      <div className="absolute left-0 top-[30%] w-40 rounded-xl border border-border bg-white px-4 py-3 shadow-lg">
        <p className="mb-2 text-[11px] font-medium text-foreground">Tailor for Job</p>
        <div className="mb-2 h-14 rounded-lg bg-muted/60 px-2 py-1.5">
          <p className="text-[9px] text-muted-foreground">Paste job description...</p>
        </div>
        <div className="mb-2 flex items-center justify-center gap-1 rounded-lg bg-primary py-1.5">
          <span className="text-[9px] font-semibold text-primary-foreground">+ Tailor with AI</span>
        </div>
        <div className="flex flex-col gap-1">
          {["Match key skills", "Use relevant keywords", "Highlight achievements"].map((t) => (
            <div key={t} className="flex items-center gap-1">
              <span className="text-[8px] text-primary">✓</span>
              <span className="text-[9px] text-muted-foreground">{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── ATS badge (top right) ── */}
      <div className="absolute right-4 top-6 flex flex-col items-center gap-1 rounded-xl border border-border bg-white px-4 py-3 shadow-lg">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
          <span className="text-base">🤖</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-semibold text-foreground">ATS Optimized</span>
        </div>
      </div>

      {/* ── Job match card (right) ── */}
      <div className="absolute right-0 top-[28%] w-44 rounded-xl border border-border bg-white px-4 py-3 shadow-lg">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-sm">💼</div>
          <div>
            <p className="text-[10px] font-semibold text-foreground">Software Engineer</p>
            <p className="text-[9px] text-muted-foreground">Remote + Global</p>
          </div>
        </div>
        <div className="mb-2 flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-full bg-muted" />
          <div className="h-1.5 w-4/5 rounded-full bg-muted" />
        </div>
        <div className="flex gap-1">
          {["Python", "APIs", "System Design"].map((t) => (
            <span key={t} className="rounded-full bg-muted px-1.5 py-0.5 text-[8px] text-muted-foreground">{t}</span>
          ))}
        </div>
      </div>

      {/* ── PDF badge (bottom right) ── */}
      <div className="absolute bottom-8 right-8 flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 shadow-lg">
        <div className="relative">
          <div className="flex h-9 w-8 items-center justify-center rounded-lg bg-red-50 text-sm">📄</div>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
            <span className="text-[8px] text-white">✓</span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-foreground">ATS-Safe PDF</p>
          <p className="text-[9px] text-muted-foreground">Ready to Apply</p>
        </div>
      </div>

      {/* Decorative orbit dots */}
      <div className="absolute left-[42%] top-4 h-2 w-2 rounded-full bg-primary/40" />
      <div className="absolute bottom-16 left-6 h-1.5 w-1.5 rounded-full bg-primary/30" />
      <div className="absolute right-[38%] bottom-4 h-2 w-2 rounded-full bg-primary/50" />
    </div>
  );
}

export function LandingPage() {
  const { session } = useSession();

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden" aria-hidden="true">
        <div className="h-96 w-[56rem] bg-gradient-to-b from-primary/12 via-primary/4 to-transparent blur-3xl" />
      </div>

      {/* ── Desktop layout ── */}
      <div className="hidden lg:flex lg:h-[calc(100vh-126px)] lg:flex-col lg:justify-evenly lg:py-4">

        {/* Two-column hero */}
        <section className="grid grid-cols-2 items-center gap-8 xl:gap-16">

          {/* Left: copy + CTA */}
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" />
              ATS-Optimized · Free Forever · BYOK AI
            </span>

            <h1 className="mt-5 font-display text-5xl tracking-tight text-foreground xl:text-6xl">
              One Master CV.{" "}
              <span className="text-primary">Tailored for Every Role.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm text-muted-foreground xl:text-base">
              Build your master CV, score ATS compliance, tailor with AI, and find global &amp; local jobs, all in one place, completely free.
            </p>

            <div className="mt-7 flex items-center gap-3">
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
          </div>

          {/* Right: product mockup */}
          <ProductMockup />
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
                  <h2 className="font-display text-sm text-foreground group-hover:text-primary">{f.title}</h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tagline */}
        <p className="text-center text-xs text-muted-foreground">
          Supports International · Nepal · UK · Germany formats
          <span className="mx-2 opacity-30">•</span>
          Your Gemini or OpenRouter key goes directly to the provider, never through our servers
        </p>
      </div>

      {/* ── Mobile / tablet layout ── */}
      <div className="flex flex-col gap-10 py-10 lg:hidden">

        {/* Hero: stacked */}
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

        {/* Mockup on mobile — scaled down */}
        <div className="mx-auto w-full max-w-sm overflow-hidden">
          <ProductMockup />
        </div>

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
                  <h2 className="font-display text-sm text-foreground group-hover:text-primary">{f.title}</h2>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tagline */}
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
