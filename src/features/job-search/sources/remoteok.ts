import type { JobListing } from "@/features/job-search/types";

// Previously this called remoteok.com/api directly from the browser, which
// fails in production because RemoteOK does not set CORS headers for
// arbitrary origins. Now routed through /api/remoteok (api/remoteok.ts)
// which fetches server-side and returns the filtered subset.
export async function fetchRemoteOkJobs(query: string): Promise<JobListing[]> {
  const params = new URLSearchParams({ query });
  const res = await fetch(`/api/remoteok?${params.toString()}`);
  if (!res.ok) throw new Error(`RemoteOK request failed (${res.status})`);

  const data = await res.json();
  return (data.results ?? []) as JobListing[];
}
