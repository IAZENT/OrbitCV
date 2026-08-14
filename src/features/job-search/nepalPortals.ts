// No Nepali job portal publishes a public API (confirmed in docs/06-job-search.md
// research). Deep-linking to each portal's own search with the query
// pre-filled is the zero-legal-risk, zero-maintenance v1 approach. A
// respectful scraper is an explicit Phase-2 item, gated on a ToS review.

export interface NepalPortalLink {
  name: string;
  url: string;
}

export function buildNepalSearchLinks(query: string): NepalPortalLink[] {
  const q = encodeURIComponent(query.trim());

  return [
    { name: "Merojob", url: q ? `https://merojob.com/search/?q=${q}` : "https://merojob.com/search" },
    { name: "Kumarijob", url: q ? `https://www.kumarijob.com/search?q=${q}` : "https://www.kumarijob.com/search" },
    { name: "JobsNepal", url: q ? `https://www.jobsnepal.com/search?q=${q}` : "https://www.jobsnepal.com" },
  ];
}
