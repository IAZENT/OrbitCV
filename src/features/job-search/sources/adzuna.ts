import type { JobListing } from "@/features/job-search/types";

export async function fetchAdzunaJobs(query: string, location: string = ""): Promise<JobListing[]> {
  const params = new URLSearchParams({ query, source: "adzuna" });
  if (location) params.set("location", location);

  const res = await fetch(`/api/jobs?${params.toString()}`);
  if (!res.ok) throw new Error(`Adzuna search failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
