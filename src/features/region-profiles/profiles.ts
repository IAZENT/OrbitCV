import type { RegionProfile } from "@/features/region-profiles/types";

// Kept in sync with the seed rows in supabase/migrations/20260814000000_init.sql
// and the research in docs/04-cv-standards.md.

export const INTERNATIONAL_PROFILE: RegionProfile = {
  id: "international",
  label: "International / US-style",
  fields: {
    photo: "hidden",
    dateOfBirth: "hidden",
    fatherName: "hidden",
    citizenshipNumber: "hidden",
    nationality: "hidden",
    declaration: false,
  },
  lengthGuidance: { minPages: 1, maxPages: 1 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const NEPAL_PROFILE: RegionProfile = {
  id: "nepal",
  label: "Nepal",
  fields: {
    photo: "optional",
    dateOfBirth: "optional",
    fatherName: "optional",
    citizenshipNumber: "optional",
    nationality: "optional",
    declaration: true,
  },
  lengthGuidance: { minPages: 1, maxPages: 2 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const UK_PROFILE: RegionProfile = {
  id: "uk",
  label: "UK",
  fields: {
    photo: "hidden",
    dateOfBirth: "hidden",
    fatherName: "hidden",
    citizenshipNumber: "hidden",
    nationality: "hidden",
    declaration: false,
  },
  lengthGuidance: { minPages: 1, maxPages: 2 },
  defaultSectionOrder: ["summary", "experience", "education", "skills", "projects"],
};

export const GERMANY_PROFILE: RegionProfile = {
  id: "de",
  label: "Germany / DACH",
  fields: {
    photo: "expected",
    dateOfBirth: "expected",
    fatherName: "hidden",
    citizenshipNumber: "hidden",
    nationality: "expected",
    declaration: false,
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
