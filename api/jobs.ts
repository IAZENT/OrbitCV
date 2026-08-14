import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const VALID_SOURCES = new Set(["adzuna", "jooble", "kumarijob"]);
const STALE_MS = 24 * 60 * 60 * 1000;

interface CachedJob {
  id: string;
  title: string;
  company: string;
  tags?: string[];
}

// Searches across every cached row for a source, not just an exact
// query/location match. The cron only pre-fetches a small fixed list of
// popular terms per source (see api/cron/fetch-jobs.ts), so this widens
// what a user can actually find to "anything in that small cached pool
// whose title/company/tags contain the search text" instead of requiring
// the typed query to exactly equal one of ~10 magic strings. Confirmed via
// real search: "frontend" alone used to return nothing because only the
// exact phrase "frontend developer" was cached.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = String(req.query.query ?? "");
  const source = String(req.query.source ?? "");

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }
  if (!VALID_SOURCES.has(source)) {
    return res.status(400).json({ error: `Unknown source. Expected one of: ${[...VALID_SOURCES].join(", ")}` });
  }

  const { data, error } = await supabase.from("job_cache").select("results, fetched_at").eq("source", source);

  if (error || !data) {
    return res.status(200).json({ results: [], note: "no cached data for this source" });
  }

  const needle = query.trim().toLowerCase();
  const now = Date.now();
  const seen = new Set<string>();
  const matches: CachedJob[] = [];

  for (const row of data) {
    const isStale = now - new Date(row.fetched_at).getTime() > STALE_MS;
    if (isStale) continue;

    for (const job of (row.results as CachedJob[]) ?? []) {
      if (seen.has(job.id)) continue;
      const haystack = [job.title, job.company, ...(job.tags ?? [])].join(" ").toLowerCase();
      if (!haystack.includes(needle)) continue;
      seen.add(job.id);
      matches.push(job);
    }
  }

  return res.status(200).json({ results: matches.slice(0, 40) });
}
