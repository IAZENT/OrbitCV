import type { JobListing } from "@/features/job-search/types";
import type { UserProfile } from "@/features/profile/types";

export function isNepalRelevant(job: JobListing): boolean {
  return job.source === "kumarijob" || job.location.toLowerCase().includes("nepal");
}

function mentionsNepal(value: string): boolean {
  return value.toLowerCase().includes("nepal");
}

export function isNepaliUser(profile: UserProfile | null): boolean {
  if (!profile) return false;
  return (
    mentionsNepal(profile.nationality) ||
    mentionsNepal(profile.location) ||
    profile.desired_locations.some(mentionsNepal)
  );
}

// Boosts Nepal-relevant listings to the top for a Nepali user, otherwise
// leaves ordering as-is. Array.prototype.sort is stable in modern engines,
// so within each group the original source order is preserved.
export function rankJobs(jobs: JobListing[], profile: UserProfile | null): JobListing[] {
  if (!isNepaliUser(profile)) return jobs;

  return [...jobs].sort((a, b) => Number(isNepalRelevant(b)) - Number(isNepalRelevant(a)));
}
