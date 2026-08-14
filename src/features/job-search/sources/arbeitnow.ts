import type { JobListing } from "@/features/job-search/types";

// Free, no API key, no published rate limit. Fetched directly from the
// browser. See the note in remoteok.ts about moving behind a serverless
// proxy if CORS ever becomes an issue in production.
const ARBEITNOW_API_URL = "https://arbeitnow.com/api/job-board-api";

interface ArbeitnowRawJob {
  slug: string;
  company_name: string;
  title: string;
  remote: boolean;
  url: string;
  tags: string[];
  location: string;
}

export async function fetchArbeitnowJobs(query: string): Promise<JobListing[]> {
  const response = await fetch(ARBEITNOW_API_URL);
  if (!response.ok) {
    throw new Error(`Arbeitnow request failed (${response.status})`);
  }

  const body = (await response.json()) as { data: ArbeitnowRawJob[] };
  const jobs = body.data ?? [];

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? jobs.filter((job) => {
        const haystack = [job.title, job.company_name, ...(job.tags ?? [])].join(" ").toLowerCase();
        return haystack.includes(needle);
      })
    : jobs;

  return matches.slice(0, 30).map((job) => ({
    id: `arbeitnow-${job.slug}`,
    source: "arbeitnow" as const,
    title: job.title,
    company: job.company_name,
    location: job.location || (job.remote ? "Remote" : "Not specified"),
    url: job.url,
    tags: job.tags ?? [],
  }));
}
