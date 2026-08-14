// Generates Google advanced search queries for job hunting.
// Uses Boolean operators, site: and intitle: directives supported by Google.

export interface GoogleQuery {
  label: string;
  description: string;
  url: string;
}

export function buildGoogleJobQueries(query: string): GoogleQuery[] {
  if (!query.trim()) return [];

  const q = query.trim();
  const encoded = (s: string) => encodeURIComponent(s);

  return [
    {
      label: "LinkedIn Jobs",
      description: "Open roles posted directly on LinkedIn",
      url: `https://www.google.com/search?q=${encoded(`site:linkedin.com/jobs "${q}"`)}`,
    },
    {
      label: "Indeed listings",
      description: "Job postings indexed from Indeed",
      url: `https://www.google.com/search?q=${encoded(`site:indeed.com "${q}" job`)}`,
    },
    {
      label: "Glassdoor listings",
      description: "Glassdoor job postings with reviews",
      url: `https://www.google.com/search?q=${encoded(`site:glassdoor.com "${q}" jobs`)}`,
    },
    {
      label: "Remote roles",
      description: "Remote positions across all sites",
      url: `https://www.google.com/search?q=${encoded(`"${q}" "remote" (job OR hiring OR vacancy) -site:merojob.com`)}`,
    },
    {
      label: "Nepal postings",
      description: "Jobs in Nepal across all boards",
      url: `https://www.google.com/search?q=${encoded(`"${q}" (Nepal OR Kathmandu) (job OR vacancy OR hiring)`)}`,
    },
    {
      label: "Company career pages",
      description: "Direct career page listings (not job boards)",
      url: `https://www.google.com/search?q=${encoded(`"${q}" intitle:"careers" OR intitle:"jobs" -site:linkedin.com -site:indeed.com -site:glassdoor.com`)}`,
    },
  ];
}
