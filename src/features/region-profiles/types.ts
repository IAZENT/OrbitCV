export type FieldVisibility = "hidden" | "optional" | "required" | "expected";

export type SectionId = "summary" | "experience" | "education" | "skills" | "projects";

export interface RegionProfile {
  id: string;
  label: string;
  fields: {
    nationality: FieldVisibility;
  };
  lengthGuidance: { minPages: number; maxPages: number };
  defaultSectionOrder: SectionId[];
}
