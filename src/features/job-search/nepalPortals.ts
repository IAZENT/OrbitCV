// Deep-link only portals for Nepal domestic job search.
// Kumarijob is intentionally NOT listed here: it is scraped live instead
// (see api/cron/fetch-jobs.ts), so results appear inline in the job list.
//
// ToS / robots.txt status for each portal (verified 2026-08-14):
//   Merojob     - ToS explicitly prohibits scraping. Deep-link only.
//   JobsNepal   - robots.txt open, ToS not found. JS-rendered results,
//                 no cheerio-parseable HTML. Deep-link only.
//                 Confirmed search URL: /search?q=QUERY
//   Kantipurjob - robots.txt open, ToS not found. Category-based nav,
//                 no clean keyword search param found. Deep-link via /?s=
//   Froxjob     - robots.txt open, ToS not found. SPA, no public API.
//                 Deep-link via /job?keyword=QUERY
//   Jobejee     - robots.txt open (403 on direct fetch - likely bot block).
//                 ToS not found. Deep-link via /search-jobs?keyword=QUERY

export interface NepalPortalLink {
  name: string;
  url: string;
  description: string;
}

export function buildNepalSearchLinks(query: string): NepalPortalLink[] {
  const q = encodeURIComponent(query.trim());

  return [
    {
      name: "Merojob",
      url: q ? `https://merojob.com/search/?q=${q}` : "https://merojob.com/search",
      description: "Largest Nepal job board",
    },
    {
      name: "JobsNepal",
      url: q ? `https://www.jobsnepal.com/search?q=${q}` : "https://www.jobsnepal.com",
      description: "Est. 2000, broad coverage",
    },
    {
      name: "Kantipurjob",
      url: q ? `https://kantipurjob.com/?s=${q}` : "https://kantipurjob.com",
      description: "Kantipur Media Group",
    },
    {
      name: "Froxjob",
      url: q ? `https://www.froxjob.com/job?keyword=${q}` : "https://www.froxjob.com/job",
      description: "AI-powered, Nepal-focused",
    },
    {
      name: "Jobejee",
      url: q ? `https://jobejee.com/search-jobs?keyword=${q}` : "https://jobejee.com",
      description: "Lalitpur-based portal",
    },
  ];
}
