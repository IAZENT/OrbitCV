import type { IncomingMessage, ServerResponse } from "node:http";
import { createClient } from "@supabase/supabase-js";
import { URL, fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local for dev server. Vite only injects VITE_ vars client-side.
try {
  const envPath = resolve(__dirname, "../.env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) process.env[key] = val;
  }
} catch { /* .env.local missing, rely on real env vars */ }

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const VALID_SOURCES = new Set(["adzuna", "jooble", "kumarijob"]);
const STALE_MS = 24 * 60 * 60 * 1000;

interface CachedJob {
  id: string;
  title: string;
  company: string;
  tags?: string[];
}

// Mirrors api/jobs.ts: search across every cached row for a source rather
// than requiring an exact query/location match. Keep both in sync.
async function handleJobs(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const query = url.searchParams.get("query") ?? "";
  const source = url.searchParams.get("source") ?? "";

  if (!query) {
    return json(res, 400, { error: "Missing query parameter" });
  }
  if (!VALID_SOURCES.has(source)) {
    return json(res, 400, { error: `Unknown source. Expected one of: ${[...VALID_SOURCES].join(", ")}` });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return json(res, 500, { error: "Missing Supabase env vars" });
  }

  const { data, error } = await supabase.from("job_cache").select("results, fetched_at").eq("source", source);

  if (error || !data) {
    return json(res, 200, { results: [], note: "no cached data for this source" });
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

  return json(res, 200, { results: matches.slice(0, 40) });
}

interface ArbeitnowRawJob {
  slug: string;
  company_name: string;
  title: string;
  remote: boolean;
  url: string;
  tags: string[];
  location: string;
}

async function handleArbeitnowProxy(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const query = url.searchParams.get("query") ?? "";

  try {
    const upstream = await fetch("https://arbeitnow.com/api/job-board-api");
    if (!upstream.ok) {
      return json(res, 502, { error: `Arbeitnow upstream failed (${upstream.status})` });
    }

    const body = (await upstream.json()) as { data: ArbeitnowRawJob[] };
    const jobs = body.data ?? [];

    const needle = query.trim().toLowerCase();
    const matches = needle
      ? jobs.filter((job) => {
          const haystack = [job.title, job.company_name, ...(job.tags ?? [])].join(" ").toLowerCase();
          return haystack.includes(needle);
        })
      : jobs;

    const results = matches.slice(0, 30).map((job) => ({
      id: `arbeitnow-${job.slug}`,
      source: "arbeitnow" as const,
      title: job.title,
      company: job.company_name,
      location: job.location || (job.remote ? "Remote" : "Not specified"),
      url: job.url,
      tags: job.tags ?? [],
    }));

    return json(res, 200, { results });
  } catch (err) {
    return json(res, 502, {
      error: err instanceof Error ? err.message : "Arbeitnow proxy failed",
    });
  }
}

const handlers: Record<string, (req: IncomingMessage, res: ServerResponse) => Promise<void>> = {
  "/api/jobs": handleJobs,
  "/api/arbeitnow": handleArbeitnowProxy,
};

export async function handleApiRoute(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
  const pathname = new URL(req.url ?? "/", `http://${req.headers.host}`).pathname;
  const handler = handlers[pathname];
  if (!handler) return false;
  await handler(req, res);
  return true;
}
