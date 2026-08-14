import type { JobListing } from "@/features/job-search/types";

export async function fetchAdzunaJobs(query: string): Promise<JobListing[]> {
  const params = new URLSearchParams({ query, source: "adzuna" });

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`Adzuna search failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
