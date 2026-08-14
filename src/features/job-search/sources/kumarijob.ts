import type { JobListing } from "@/features/job-search/types";

// Reads from the job_cache table via /api/jobs, populated by scraping
// Kumarijob's own search results in api/cron/fetch-jobs. Confirmed
// permissive robots.txt and Terms of Use, see docs/06-job-search.md.
// Merojob is deliberately NOT scraped: its Terms of Use explicitly
// prohibit "data scraping, automated bots, or other tools for collecting
// or mining... data".
export async function fetchKumarijobJobs(query: string): Promise<JobListing[]> {
  const params = new URLSearchParams({ query, location: "nepal", source: "kumarijob" });

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`Kumarijob search failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
