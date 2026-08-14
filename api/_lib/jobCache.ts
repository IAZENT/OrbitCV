// Shared by api/jobs.ts (read) and api/cron/fetch-jobs.ts (write) so the
// cache key computed on write always matches the key looked up on read.
//
// job_cache.query_hash is the table's sole primary key (see
// supabase/migrations/20260814000000_init.sql), so the hash MUST include
// `source`. Without it, two different sources for the same query/location
// (e.g. adzuna and jooble both matching "frontend developer"/"nepal")
// collide on the same primary key and silently overwrite each other.
export function hashQueryKey(source: string, query: string, location: string): string {
  const data = JSON.stringify({ source, query, location });
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) + hash + data.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(16).padStart(8, "0");
}
