import type { JobListing } from "@/features/job-search/types";

// Free, no API key, no published rate limit. Fetched directly from the
// browser. If this ever gets CORS-blocked in production, move it behind the
// /api/jobs serverless proxy described in docs/06-job-search.md (same home
// planned for the cached Adzuna source).
const REMOTEOK_API_URL = "https://remoteok.com/api";

interface RemoteOkRawJob {
  id?: string;
  slug?: string;
  position?: string;
  company?: string;
  location?: string;
  url?: string;
  tags?: string[];
}

export async function fetchRemoteOkJobs(query: string): Promise<JobListing[]> {
  const response = await fetch(REMOTEOK_API_URL);
  if (!response.ok) {
    throw new Error(`RemoteOK request failed (${response.status})`);
  }

  const raw = (await response.json()) as RemoteOkRawJob[];
  // The first array item is RemoteOK's own legal notice, not a job.
  const jobs = raw.filter((job): job is Required<Pick<RemoteOkRawJob, "id" | "position">> & RemoteOkRawJob =>
    Boolean(job.id && job.position),
  );

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? jobs.filter((job) => {
        const haystack = [job.position, job.company, ...(job.tags ?? [])].join(" ").toLowerCase();
        return haystack.includes(needle);
      })
    : jobs;

  return matches.slice(0, 30).map((job) => ({
    id: `remoteok-${job.id}`,
    source: "remoteok" as const,
    title: job.position ?? "Untitled role",
    company: job.company ?? "Unknown company",
    location: job.location || "Remote",
    url: job.url ? (job.url.startsWith("http") ? job.url : `https://remoteok.com${job.url}`) : REMOTEOK_API_URL,
    tags: job.tags ?? [],
  }));
}
