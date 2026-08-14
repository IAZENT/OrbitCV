import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { getUserProfile } from "@/features/profile/api";
import type { UserProfile } from "@/features/profile/types";
import { fetchRemoteOkJobs } from "@/features/job-search/sources/remoteok";
import { fetchArbeitnowJobs } from "@/features/job-search/sources/arbeitnow";
import { fetchAdzunaJobs } from "@/features/job-search/sources/adzuna";
import { fetchJoobleJobs } from "@/features/job-search/sources/jooble";
import { fetchKumarijobJobs } from "@/features/job-search/sources/kumarijob";
import { buildNepalSearchLinks } from "@/features/job-search/nepalPortals";
import { isNepalRelevant, isNepaliUser, rankJobs } from "@/features/job-search/ranking";
import type { JobListing } from "@/features/job-search/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

interface SourceState {
  loading: boolean;
  error: string | null;
  results: JobListing[];
}

const emptySourceState: SourceState = { loading: false, error: null, results: [] };

const SOURCE_LABELS: Record<JobListing["source"], string> = {
  remoteok: "RemoteOK",
  arbeitnow: "Arbeitnow",
  adzuna: "Adzuna",
  jooble: "Jooble",
  kumarijob: "Kumarijob",
};

const SOURCE_DESC: Record<JobListing["source"], string> = {
  remoteok: "Remote-only roles worldwide",
  arbeitnow: "EU and remote tech roles",
  adzuna: "Cached: India/UK/US/DE (refreshed daily)",
  jooble: "Cached: UK/US/DE (refreshed daily)",
  kumarijob: "Cached: Nepal domestic (refreshed daily)",
};

type SourceKey = keyof typeof SOURCE_LABELS;

function SourceBadge({ label, state }: { label: string; state: SourceState }) {
  if (state.loading) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
        <Spinner className="size-3" /> {label}
      </span>
    );
  }
  if (state.error) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive"
        title={state.error}
      >
        ✕ {label}
      </span>
    );
  }
  if (state.results.length > 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
        ✓ {label} ({state.results.length})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
      · {label}
    </span>
  );
}

export function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const { session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [searched, setSearched] = useState(false);
  const [remoteOk, setRemoteOk] = useState<SourceState>(emptySourceState);
  const [arbeitnow, setArbeitnow] = useState<SourceState>(emptySourceState);
  const [adzuna, setAdzuna] = useState<SourceState>(emptySourceState);
  const [jooble, setJooble] = useState<SourceState>(emptySourceState);
  const [kumarijob, setKumarijob] = useState<SourceState>(emptySourceState);

  useEffect(() => {
    if (!session?.user) return;
    getUserProfile(session.user.id)
      .then(setProfile)
      .catch(() => setProfile(null));
  }, [session?.user]);

  async function runSearch(q: string) {
    setSearched(true);
    setRemoteOk({ loading: true, error: null, results: [] });
    setArbeitnow({ loading: true, error: null, results: [] });
    setAdzuna({ loading: true, error: null, results: [] });
    setJooble({ loading: true, error: null, results: [] });
    setKumarijob({ loading: true, error: null, results: [] });

    fetchRemoteOkJobs(q)
      .then((results) => setRemoteOk({ loading: false, error: null, results }))
      .catch((err) => setRemoteOk({ loading: false, error: err instanceof Error ? err.message : "Failed", results: [] }));

    fetchArbeitnowJobs(q)
      .then((results) => setArbeitnow({ loading: false, error: null, results }))
      .catch((err) => setArbeitnow({ loading: false, error: err instanceof Error ? err.message : "Failed", results: [] }));

    fetchAdzunaJobs(q)
      .then((results) => setAdzuna({ loading: false, error: null, results }))
      .catch((err) => setAdzuna({ loading: false, error: err instanceof Error ? err.message : "Failed", results: [] }));

    fetchJoobleJobs(q)
      .then((results) => setJooble({ loading: false, error: null, results }))
      .catch((err) => setJooble({ loading: false, error: err instanceof Error ? err.message : "Failed", results: [] }));

    fetchKumarijobJobs(q)
      .then((results) => setKumarijob({ loading: false, error: null, results }))
      .catch((err) => setKumarijob({ loading: false, error: err instanceof Error ? err.message : "Failed", results: [] }));
  }

  useEffect(() => {
    const initial = searchParams.get("q");
    if (initial) runSearch(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  const sourceStates: [SourceKey, SourceState][] = [
    ["remoteok", remoteOk],
    ["arbeitnow", arbeitnow],
    ["adzuna", adzuna],
    ["jooble", jooble],
    ["kumarijob", kumarijob],
  ];

  const nepalLinks = buildNepalSearchLinks(query);
  const allResults = sourceStates.flatMap(([, s]) => s.results);
  const ranked = rankJobs(allResults, profile);
  const boosting = isNepaliUser(profile);
  const anyLoading = sourceStates.some(([, s]) => s.loading);
  const allDone = searched && !anyLoading;

  // True when all three cached sources returned nothing and no errors -
  // most likely the cache hasn't been seeded yet.
  const cacheEmpty =
    allDone &&
    adzuna.results.length === 0 && !adzuna.error &&
    jooble.results.length === 0 && !jooble.error &&
    kumarijob.results.length === 0 && !kumarijob.error;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="mb-6 font-display text-3xl tracking-tight text-foreground">Find jobs</h1>

      <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2 sm:flex-row">
        <Label htmlFor="job-search" className="sr-only">Search jobs</Label>
        <Input
          id="job-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. cyber security, frontend developer, accountant"
          className="max-w-md"
        />
        <Button type="submit" disabled={anyLoading}>
          {anyLoading ? "Searching…" : "Search"}
        </Button>
      </form>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="min-w-0">

          {/* Per-source status badges */}
          {searched && (
            <div className="mb-4 flex flex-wrap gap-2">
              {sourceStates.map(([key, state]) => (
                <SourceBadge key={key} label={SOURCE_LABELS[key]} state={state} />
              ))}
            </div>
          )}

          {/* Cache empty warning */}
          {cacheEmpty && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <strong>Adzuna, Jooble, and Kumarijob returned nothing.</strong> These sources rely on
              a daily cache that may not have been seeded yet. On Vercel it runs automatically on
              schedule. To seed it manually, call{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5 text-xs">/api/cron/fetch-jobs</code>.
            </div>
          )}

          {/* Pre-search explainer */}
          {!searched && (
            <div className="text-sm text-muted-foreground">
              <p className="mb-3">Search above to pull live and cached roles from:</p>
              <ul className="space-y-1.5">
                {(Object.keys(SOURCE_LABELS) as SourceKey[]).map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="font-medium text-foreground">{SOURCE_LABELS[k]}</span>
                    <span>{SOURCE_DESC[k]}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {allDone && ranked.length === 0 && !cacheEmpty && (
            <p className="text-muted-foreground">No results found. Try a broader search term.</p>
          )}

          {boosting && ranked.length > 0 && (
            <p className="mb-3 text-sm text-muted-foreground">
              Showing Nepal-relevant roles first based on your profile.
            </p>
          )}

          <div className="flex flex-col gap-3">
            {ranked.map((job) => (
              <Card key={job.id} className={isNepalRelevant(job) && boosting ? "border-primary/40" : ""}>
                <CardHeader className="pb-1">
                  <CardTitle className="text-base font-normal">
                    <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {job.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <div>{job.company} · {job.location}</div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {SOURCE_LABELS[job.source]}
                    </span>
                    {job.tags.slice(0, 5).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-xs">{tag}</span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">More Nepal portals</h2>
          <p className="text-sm text-muted-foreground">
            Merojob and JobsNepal don't have public search APIs. These open each site's own search
            with your query pre-filled.
          </p>
          <div className="flex flex-col gap-2">
            {nepalLinks.map((link) => (
              <Button key={link.name} variant="outline" asChild className="justify-start">
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  Search on {link.name}
                </a>
              </Button>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
