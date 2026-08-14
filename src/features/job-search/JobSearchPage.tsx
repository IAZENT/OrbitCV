import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { fetchRemoteOkJobs } from "@/features/job-search/sources/remoteok";
import { fetchArbeitnowJobs } from "@/features/job-search/sources/arbeitnow";
import { fetchAdzunaJobs } from "@/features/job-search/sources/adzuna";
import { buildNepalSearchLinks } from "@/features/job-search/nepalPortals";
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

export function JobSearchPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [searched, setSearched] = useState(false);
  const [remoteOk, setRemoteOk] = useState<SourceState>(emptySourceState);
  const [arbeitnow, setArbeitnow] = useState<SourceState>(emptySourceState);
  const [adzuna, setAdzuna] = useState<SourceState>(emptySourceState);

  async function runSearch(q: string) {
    setSearched(true);
    setRemoteOk({ loading: true, error: null, results: [] });
    setArbeitnow({ loading: true, error: null, results: [] });
    setAdzuna({ loading: true, error: null, results: [] });

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
  const combined = [...remoteOk.results, ...arbeitnow.results, ...adzuna.results];
  const anyLoading = remoteOk.loading || arbeitnow.loading || adzuna.loading;

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
            <h2 className="mb-3 text-xl">International and remote roles</h2>

            {!searched && (
              <p className="text-muted-foreground">
                Search above to pull live roles from RemoteOK and Arbeitnow.
              </p>
            )}

            {remoteOk.error && (
              <p className="mb-2 text-sm text-destructive">RemoteOK: {remoteOk.error}</p>
            )}
            {arbeitnow.error && (
              <p className="mb-2 text-sm text-destructive">Arbeitnow: {arbeitnow.error}</p>
            )}
            {adzuna.error && (
              <p className="mb-2 text-sm text-destructive">Adzuna: {adzuna.error}</p>
            )}

            {searched && !anyLoading && combined.length === 0 && !remoteOk.error && !arbeitnow.error && (
              <p className="text-muted-foreground">No results. Try a broader search term.</p>
            )}

            <div className="flex flex-col gap-3">
              {combined.map((job) => (
                <Card key={job.id}>
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
                    {job.tags.length > 0 && <div className="mt-1">{job.tags.slice(0, 6).join(", ")}</div>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <h2 className="text-xl">Nepal job portals</h2>
            <p className="text-sm text-muted-foreground">
              These portals do not have a public search API, so this opens each one's own search with
              your query pre-filled.
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
