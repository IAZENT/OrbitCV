import type { VercelRequest, VercelResponse } from "@vercel/node";

interface ArbeitnowRawJob {
  slug: string;
  company_name: string;
  title: string;
  remote: boolean;
  url: string;
  tags: string[];
  location: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const query = String(req.query.query ?? "");

  try {
    const upstream = await fetch("https://arbeitnow.com/api/job-board-api");
    if (!upstream.ok) {
      return res.status(502).json({ error: `Arbeitnow upstream failed (${upstream.status})` });
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

    return res.status(200).json({ results });
  } catch (err) {
    return res.status(502).json({
      error: err instanceof Error ? err.message : "Arbeitnow proxy failed",
    });
  }
}
