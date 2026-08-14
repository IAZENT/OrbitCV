import type { JobListing } from "@/features/job-search/types";

export async function fetchArbeitnowJobs(query: string): Promise<JobListing[]> {
  const params = new URLSearchParams({ query });
  const response = await fetch(`/api/arbeitnow?${params}`);
  if (!response.ok) {
    throw new Error(`Arbeitnow request failed (${response.status})`);
  }

  const body = (await response.json()) as { results: JobListing[] };
  return body.results ?? [];
}
