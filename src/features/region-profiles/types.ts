export type FieldVisibility = "hidden" | "optional" | "required" | "expected";

export type SectionId = "summary" | "experience" | "education" | "skills" | "projects";

export interface RegionProfile {
  id: string;
  label: string;
  fields: {
    photo: FieldVisibility;
    dateOfBirth: FieldVisibility;
    fatherName: FieldVisibility;
    citizenshipNumber: FieldVisibility;
    nationality: FieldVisibility;
    declaration: boolean;
  };
  lengthGuidance: { minPages: number; maxPages: number };
  defaultSectionOrder: SectionId[];
}
