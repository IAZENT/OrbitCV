import type { RegionProfile } from "@/features/region-profiles/types";

// Kept in sync with the seed rows in supabase/migrations/20260814000000_init.sql
// and the research in docs/04-cv-standards.md.

export const INTERNATIONAL_PROFILE: RegionProfile = {
  id: "international",
  label: "International / US-style",
  fields: {
    nationality: "hidden",
  },
  lengthGuidance: { minPages: 1, maxPages: 1 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const NEPAL_PROFILE: RegionProfile = {
  id: "nepal",
  label: "Nepal",
  fields: {
    nationality: "optional",
  },
  lengthGuidance: { minPages: 1, maxPages: 2 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const UK_PROFILE: RegionProfile = {
  id: "uk",
  label: "UK",
  fields: {
    nationality: "hidden",
  },
  lengthGuidance: { minPages: 1, maxPages: 2 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const GERMANY_PROFILE: RegionProfile = {
  id: "de",
  label: "Germany / DACH",
  fields: {
    nationality: "expected",
  },
  lengthGuidance: { minPages: 2, maxPages: 3 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const REGION_PROFILES: Record<string, RegionProfile> = {
  international: INTERNATIONAL_PROFILE,
  nepal: NEPAL_PROFILE,
  uk: UK_PROFILE,
  de: GERMANY_PROFILE,
};

export function getRegionProfile(id: string): RegionProfile {
  return REGION_PROFILES[id] ?? INTERNATIONAL_PROFILE;
}
