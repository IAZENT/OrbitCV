import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import * as cheerio from "cheerio";
import { hashQueryKey } from "../_lib/jobCache.js";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface JobListing {
  id: string;
  source: "adzuna" | "jooble" | "kumarijob";
  title: string;
  company: string;
  location: string;
  url: string;
  tags: string[];
}

// Adzuna does NOT support Nepal, confirmed via direct testing on 2026-08-15:
// the /np/ country endpoint returns UNSUPPORTED_COUNTRY. Its supported list
// is at, au, be, br, ca, ch, de, es, fr, gb, in, it, mx, nl, nz, pl, sg, us,
// za, per that error response. "in" (India) is used below as the closest
// supported South Asia market instead of silently dropping those query
// slots. See docs/06-job-search.md.
const ADZUNA_QUERIES: Array<{ query: string; country: string; location: string }> = [
  // India (closest Adzuna-supported South Asia market)
  { query: "frontend developer",    country: "in", location: "delhi" },
  { query: "backend developer",     country: "in", location: "delhi" },
  { query: "software engineer",     country: "in", location: "bangalore" },
  { query: "data analyst",          country: "in", location: "bangalore" },
  { query: "accountant",            country: "in", location: "mumbai" },
  { query: "cyber security",        country: "in", location: "delhi" },
  { query: "devops engineer",       country: "in", location: "bangalore" },
  { query: "python developer",      country: "in", location: "bangalore" },
  // UK
  { query: "frontend developer",    country: "gb", location: "london" },
  { query: "backend developer",     country: "gb", location: "london" },
  { query: "software engineer",     country: "gb", location: "london" },
  { query: "data analyst",          country: "gb", location: "london" },
  { query: "cyber security",        country: "gb", location: "london" },
  { query: "devops engineer",       country: "gb", location: "london" },
  // US
  { query: "software engineer",     country: "us", location: "new york" },
  { query: "frontend developer",    country: "us", location: "san francisco" },
  { query: "data analyst",          country: "us", location: "new york" },
  { query: "cyber security",        country: "us", location: "new york" },
  { query: "devops engineer",       country: "us", location: "san francisco" },
  // DE
  { query: "data analyst",          country: "de", location: "berlin" },
  { query: "software engineer",     country: "de", location: "berlin" },
];

// Jooble's location matching for "Nepal"/"Kathmandu" was confirmed to return
// zero results (and "Nepal, Asia" returns unrelated USA listings instead of
// erroring) via direct testing on 2026-08-15. See docs/06-job-search.md.
// Nepal queries are deliberately excluded here rather than wasting calls on
// a combination proven not to work.
const JOOBLE_QUERIES: Array<{ query: string; location: string }> = [
  { query: "frontend developer",  location: "london" },
  { query: "backend developer",   location: "london" },
  { query: "software engineer",   location: "london" },
  { query: "data analyst",        location: "london" },
  { query: "cyber security",      location: "london" },
  { query: "devops engineer",     location: "london" },
  { query: "software engineer",   location: "new york" },
  { query: "frontend developer",  location: "san francisco" },
  { query: "cyber security",      location: "new york" },
  { query: "data analyst",        location: "berlin" },
  { query: "software engineer",   location: "berlin" },
];

// Queries pre-scraped for Kumarijob (Nepal-domestic, no country param needed).
// See docs/06-job-search.md for why Kumarijob specifically: robots.txt
// allows /search, and its Terms of Use have no scraping prohibition, unlike
// Merojob which explicitly bans scraping and is intentionally excluded.
const NEPAL_SCRAPE_QUERIES = [
  "frontend developer",
  "backend developer",
  "software engineer",
  "accountant",
  "data analyst",
  "marketing",
  "civil engineer",
  "customer service",
  "teacher",
  "cyber security",
  "network engineer",
  "graphic designer",
  "hr officer",
  "sales executive",
];

// --- Adzuna ---

interface AdzunaResult {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  redirect_url: string;
  tags: string[];
}

async function fetchAdzuna(query: string, country: string, location: string): Promise<JobListing[]> {
  // Adzuna's free-text location filter param is `where`, not `location`.
  // `location` returns an HTTP 400 every time, confirmed via direct testing
  // on 2026-08-15, silently swallowed by the `if (!res.ok) return []` below
  // until now. See docs/06-job-search.md.
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(query)}&where=${encodeURIComponent(location)}&results_per_page=20`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  const results: AdzunaResult[] = data.results ?? [];

  return results.map((r) => ({
    id: `adzuna-${Buffer.from(r.redirect_url).toString("base64").slice(0, 12)}`,
    source: "adzuna" as const,
    title: r.title,
    company: r.company?.display_name ?? "Unknown",
    location: r.location?.display_name ?? location,
    url: r.redirect_url,
    tags: r.tags ?? [],
  }));
}

// --- Jooble ---
// Official free API, no scraping, broad multi-country coverage including
// Nepal. See docs/06-job-search.md: this is the primary lever for wide
// coverage, not more per-site scraping.

interface JoobleResult {
  title: string;
  location: string;
  company: string;
  link: string;
  snippet: string;
  id: string;
}

async function fetchJooble(query: string, location: string): Promise<JobListing[]> {
  const res = await fetch(`https://jooble.org/api/${JOOBLE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keywords: query, location }),
  });
  if (!res.ok) return [];

  const data = await res.json();
  const results: JoobleResult[] = data.jobs ?? [];

  return results.slice(0, 20).map((r) => ({
    id: `jooble-${r.id ?? Buffer.from(r.link).toString("base64").slice(0, 12)}`,
    source: "jooble" as const,
    title: r.title,
    company: r.company || "Unknown",
    location: r.location || location,
    url: r.link,
    tags: [],
  }));
}

// --- Kumarijob (scraped) ---
// Confirmed server-rendered HTML, real `?keywords=` filtering. robots.txt
// explicitly allows /search$; Terms of Use have no anti-scraping clause
// (checked manually, see docs/06-job-search.md). Cards occasionally include
// an unrendered `${jobTitle}` template artifact in the raw HTML; filtered
// out below.

async function fetchKumarijob(query: string): Promise<JobListing[]> {
  const url = `https://www.kumarijob.com/search?keywords=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; OrbitCV/1.0; +https://github.com/IAZENT/OrbitCV)" },
  });
  if (!res.ok) return [];

  const html = await res.text();
  const $ = cheerio.load(html);
  const listings: JobListing[] = [];

  $(".search-job-title a").each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr("href")?.trim() ?? "";
    if (!title || !href || title.includes("${") || href.includes("${") || !href.startsWith("http")) {
      return;
    }

    const company = $(el)
      .closest(".left")
      .find(".meta a")
      .first()
      .text()
      .trim();

    listings.push({
      id: `kumarijob-${Buffer.from(href).toString("base64").slice(0, 12)}`,
      source: "kumarijob",
      title,
      company: company || "Unknown",
      location: "Nepal",
      url: href,
      tags: [],
    });
  });

  return listings;
}

// --- Cache write ---

async function cacheResults(
  source: string,
  query: string,
  location: string,
  listings: JobListing[],
): Promise<{ error?: string }> {
  if (listings.length === 0) return {};

  const { error } = await supabase.from("job_cache").upsert(
    {
      query_hash: hashQueryKey(source, query, location),
      source,
      results: listings,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: "query_hash" },
  );

  return error ? { error: error.message } : {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let cached = 0;
  const errors: string[] = [];

  if (ADZUNA_APP_ID && ADZUNA_API_KEY) {
    for (const q of ADZUNA_QUERIES) {
      try {
        const listings = await fetchAdzuna(q.query, q.country, q.location);
        const { error } = await cacheResults("adzuna", q.query, q.location, listings);
        if (error) errors.push(`adzuna ${q.query}/${q.location}: ${error}`);
        else if (listings.length > 0) cached++;
      } catch (err) {
        errors.push(`adzuna ${q.query}/${q.location}: ${err instanceof Error ? err.message : "unknown"}`);
      }
    }
  } else {
    errors.push("adzuna: missing ADZUNA_APP_ID or ADZUNA_API_KEY, skipped");
  }

  if (JOOBLE_API_KEY) {
    for (const q of JOOBLE_QUERIES) {
      try {
        const listings = await fetchJooble(q.query, q.location);
        const { error } = await cacheResults("jooble", q.query, q.location, listings);
        if (error) errors.push(`jooble ${q.query}/${q.location}: ${error}`);
        else if (listings.length > 0) cached++;
      } catch (err) {
        errors.push(`jooble ${q.query}/${q.location}: ${err instanceof Error ? err.message : "unknown"}`);
      }
    }
  } else {
    errors.push("jooble: missing JOOBLE_API_KEY, skipped");
  }

  for (const query of NEPAL_SCRAPE_QUERIES) {
    try {
      const listings = await fetchKumarijob(query);
      const { error } = await cacheResults("kumarijob", query, "nepal", listings);
      if (error) errors.push(`kumarijob ${query}: ${error}`);
      else if (listings.length > 0) cached++;
    } catch (err) {
      errors.push(`kumarijob ${query}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return res.status(200).json({
    ok: true,
    cached,
    errors: errors.length > 0 ? errors : undefined,
  });
}
