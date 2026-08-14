import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_API_KEY = process.env.ADZUNA_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface AdzunaResult {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  redirect_url: string;
  tags: string[];
  created: string;
}

interface JobListing {
  id: string;
  source: "adzuna";
  title: string;
  company: string;
  location: string;
  url: string;
  tags: string[];
}

const POPULAR_QUERIES: Array<{ query: string; country: string; location: string }> = [
  { query: "frontend developer", country: "np", location: "nepal" },
  { query: "backend developer", country: "np", location: "nepal" },
  { query: "accountant", country: "np", location: "nepal" },
  { query: "data analyst", country: "np", location: "nepal" },
  { query: "frontend developer", country: "gb", location: "london" },
  { query: "backend developer", country: "gb", location: "london" },
  { query: "data analyst", country: "gb", location: "london" },
  { query: "software engineer", country: "us", location: "new york" },
  { query: "frontend developer", country: "us", location: "san francisco" },
  { query: "data analyst", country: "de", location: "berlin" },
];

async function fetchAdzuna(
  query: string,
  country: string,
  location: string,
): Promise<JobListing[]> {
  const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_API_KEY}&what=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&results_per_page=20`;

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

function hashQuery(query: string, location: string): string {
  const data = JSON.stringify({ query, location });
  // Use SubtleCrypto via a synchronous fallback for simplicity in serverless.
  // Node 18+ has crypto.randomUUID but we need a simple hash.
  // We'll use a basic DJB2 hash converted to hex for determinism.
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) + hash + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!ADZUNA_APP_ID || !ADZUNA_API_KEY) {
    return res.status(500).json({ error: "Missing ADZUNA_APP_ID or ADZUNA_API_KEY env vars" });
  }

  let cached = 0;
  const errors: string[] = [];

  for (const q of POPULAR_QUERIES) {
    try {
      const listings = await fetchAdzuna(q.query, q.country, q.location);
      if (listings.length === 0) continue;

      const queryHash = hashQuery(q.query, q.location);
      const { error } = await supabase.from("job_cache").upsert(
        {
          query_hash: queryHash,
          source: "adzuna",
          results: listings,
          fetched_at: new Date().toISOString(),
        },
        { onConflict: "query_hash" },
      );

      if (error) {
        errors.push(`${q.query}/${q.location}: ${error.message}`);
      } else {
        cached++;
      }
    } catch (err) {
      errors.push(`${q.query}/${q.location}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return res.status(200).json({
    ok: true,
    cached,
    errors: errors.length > 0 ? errors : undefined,
  });
}
