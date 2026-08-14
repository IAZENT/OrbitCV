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

function hashQuery(query: string, location: string): string {
  const data = JSON.stringify({ query, location });
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) + hash + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}

function json(res: ServerResponse, status: number, data: unknown) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function handleJobs(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
  const query = url.searchParams.get("query") ?? "";
  const location = url.searchParams.get("location") ?? "";

  if (!query) {
    return json(res, 400, { error: "Missing query parameter" });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return json(res, 500, { error: "Missing Supabase env vars" });
  }

  const queryHash = hashQuery(query, location);

  const { data, error } = await supabase
    .from("job_cache")
    .select("results, fetched_at")
    .eq("query_hash", queryHash)
    .eq("source", "adzuna")
    .single();

  if (error || !data) {
    return json(res, 200, { results: [], note: "no cached results for this query" });
  }

  const fetchedAt = new Date(data.fetched_at).getTime();
  const isStale = Date.now() - fetchedAt > 24 * 60 * 60 * 1000;

  if (isStale) {
    return json(res, 200, { results: [], note: "cached results expired" });
  }

  return json(res, 200, { results: data.results });
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
