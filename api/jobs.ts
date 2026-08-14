import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function hashQuery(query: string, location: string): string {
  const data = JSON.stringify({ query, location });
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

  const query = String(req.query.query ?? "");
  const location = String(req.query.location ?? "");

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  const queryHash = hashQuery(query, location);

  const { data, error } = await supabase
    .from("job_cache")
    .select("results, fetched_at")
    .eq("query_hash", queryHash)
    .eq("source", "adzuna")
    .single();

  if (error || !data) {
    return res.status(200).json({ results: [], note: "no cached results for this query" });
  }

  // Treat as stale after 24 hours.
  const fetchedAt = new Date(data.fetched_at).getTime();
  const isStale = Date.now() - fetchedAt > 24 * 60 * 60 * 1000;

  if (isStale) {
    return res.status(200).json({ results: [], note: "cached results expired" });
  }

  return res.status(200).json({ results: data.results });
}
