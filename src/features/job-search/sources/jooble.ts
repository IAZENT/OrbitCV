import type { JobListing } from "@/features/job-search/types";

// Reads from the job_cache table via /api/jobs, populated by the
// api/cron/fetch-jobs cron job. See docs/06-job-search.md: Jooble is useful
// for International/UK/US/DE coverage, confirmed NOT to have usable Nepal
// coverage despite the "60+ countries" claim.
export async function fetchJoobleJobs(query: string): Promise<JobListing[]> {
  const params = new URLSearchParams({ query, source: "jooble" });

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`Jooble search failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
