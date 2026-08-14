// No public API exists for these portals (confirmed in docs/06-job-search.md
// research), and Merojob's Terms of Use explicitly prohibit scraping, so
// deep-linking to each portal's own search is the approach for them.
// Kumarijob is deliberately NOT listed here: it's scraped live instead (see
// api/cron/fetch-jobs.ts and JobSearchPage.tsx), since its robots.txt and
// Terms of Use are permissive.

export interface NepalPortalLink {
  name: string;
  url: string;
}

export function buildNepalSearchLinks(query: string): NepalPortalLink[] {
  const q = encodeURIComponent(query.trim());

  return [
    { name: "Merojob", url: q ? `https://merojob.com/search/?q=${q}` : "https://merojob.com/search" },
    { name: "JobsNepal", url: q ? `https://www.jobsnepal.com/search?q=${q}` : "https://www.jobsnepal.com" },
  ];
}
