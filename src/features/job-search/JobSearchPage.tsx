import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
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
      .catch((err) =>
        setRemoteOk({ loading: false, error: err instanceof Error ? err.message : "Failed to load.", results: [] }),
      );

    fetchArbeitnowJobs(q)
      .then((results) => setArbeitnow({ loading: false, error: null, results }))
      .catch((err) =>
        setArbeitnow({ loading: false, error: err instanceof Error ? err.message : "Failed to load.", results: [] }),
      );

    fetchAdzunaJobs(q)
      .then((results) => setAdzuna({ loading: false, error: null, results }))
      .catch((err) =>
        setAdzuna({ loading: false, error: err instanceof Error ? err.message : "Failed to load.", results: [] }),
      );

    fetchJoobleJobs(q)
      .then((results) => setJooble({ loading: false, error: null, results }))
      .catch((err) =>
        setJooble({ loading: false, error: err instanceof Error ? err.message : "Failed to load.", results: [] }),
      );

    fetchKumarijobJobs(q)
      .then((results) => setKumarijob({ loading: false, error: null, results }))
      .catch((err) =>
        setKumarijob({ loading: false, error: err instanceof Error ? err.message : "Failed to load.", results: [] }),
      );
  }

  useEffect(() => {
    const initial = searchParams.get("q");
    if (initial) runSearch(initial);
    // Only run once on mount from an incoming ?q= link.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  const nepalLinks = buildNepalSearchLinks(query);
  const allResults = [
    ...remoteOk.results,
    ...arbeitnow.results,
    ...adzuna.results,
    ...jooble.results,
    ...kumarijob.results,
  ];
  const ranked = rankJobs(allResults, profile);
  const boosting = isNepaliUser(profile);
  const anyLoading = remoteOk.loading || arbeitnow.loading || adzuna.loading || jooble.loading || kumarijob.loading;
  const anyError = [remoteOk, arbeitnow, adzuna, jooble, kumarijob].find((s) => s.error);

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h1 className="mb-6 text-3xl">Find jobs</h1>

        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-2 sm:flex-row">
          <Label htmlFor="job-search" className="sr-only">
            Search jobs
          </Label>
          <Input
            id="job-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. frontend developer, accountant, data analyst"
            className="max-w-md"
          />
          <Button type="submit" disabled={anyLoading}>
            {anyLoading ? "Searching…" : "Search"}
          </Button>
        </form>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="min-w-0">
            <h2 className="mb-3 text-xl">Results</h2>

            {!searched && (
              <p className="text-muted-foreground">
                Search above to pull live and cached roles from RemoteOK, Arbeitnow, Adzuna, Jooble,
                and Kumarijob.
              </p>
            )}

            {(
              [
                ["remoteok", remoteOk],
                ["arbeitnow", arbeitnow],
                ["adzuna", adzuna],
                ["jooble", jooble],
                ["kumarijob", kumarijob],
              ] as const
            ).map(
              ([source, state]) =>
                state.error && (
                  <p key={source} className="mb-2 text-sm text-destructive">
                    {SOURCE_LABELS[source]}: {state.error}
                  </p>
                ),
            )}

            {searched && !anyLoading && ranked.length === 0 && !anyError && (
              <p className="text-muted-foreground">No results. Try a broader search term.</p>
            )}

            {boosting && ranked.length > 0 && (
              <p className="mb-3 text-sm text-muted-foreground">
                Showing Nepal-relevant roles first, based on your profile.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {ranked.map((job) => (
                <Card key={job.id} className={isNepalRelevant(job) && boosting ? "border-primary/40" : ""}>
                  <CardHeader>
                    <CardTitle className="text-lg font-normal">
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {job.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <div>
                      {job.company} · {job.location}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">
                        {SOURCE_LABELS[job.source]}
                      </span>
                      {job.tags.length > 0 && <span>{job.tags.slice(0, 6).join(", ")}</span>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <h2 className="text-xl">More Nepal portals</h2>
            <p className="text-sm text-muted-foreground">
              Merojob and JobsNepal do not have public search APIs, so these open each site's own
              search with your query pre-filled.
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
    </AppShell>
  );
}
