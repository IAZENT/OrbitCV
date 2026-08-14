import type { JobListing } from "@/features/job-search/types";

// Reads from the job_cache table via /api/jobs, populated by the
// api/cron/fetch-jobs cron job. See docs/06-job-search.md: Jooble is the
// primary lever for broad coverage (official API, 60+ countries including
// Nepal), not per-site scraping.
export async function fetchJoobleJobs(query: string, location: string = ""): Promise<JobListing[]> {
  const params = new URLSearchParams({ query, source: "jooble" });
  if (location) params.set("location", location);

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`Jooble search failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
