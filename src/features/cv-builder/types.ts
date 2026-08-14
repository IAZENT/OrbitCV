export interface ProfileLink {
  id: string;
  label: string;
  url: string;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  photoUrl: string;
  dateOfBirth: string;
  fatherName: string;
  citizenshipNumber: string;
  nationality: string;
  linkedinUrl: string;
  links: ProfileLink[];
}

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  link: string;
  bullets: string[];
}

export interface CvSections {
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  projects: ProjectEntry[];
  declaration: string;
}

export interface CvMaster {
  id: string;
  user_id: string;
  name: string;
  region_profile: string;
  sections: CvSections;
  updated_at: string;
}

export interface CvVersion {
  id: string;
  cv_master_id: string;
  label: string;
  target_role: string | null;
  jd_text: string | null;
  sections: CvSections;
  ai_diff: unknown;
  created_at: string;
}

export const emptyPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  photoUrl: "",
  dateOfBirth: "",
  fatherName: "",
  citizenshipNumber: "",
  nationality: "",
  linkedinUrl: "",
  links: [],
};

export const emptySections: CvSections = {
  personal: emptyPersonalInfo,
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  declaration: "",
};

export function newId(): string {
  return crypto.randomUUID();
}

// Deep-merges stored sections onto the current defaults so CVs saved before
// a new field was added (e.g. links, linkedinUrl) load without crashing on
// undefined nested values.
export function normalizeSections(loaded: Partial<CvSections> | undefined): CvSections {
  return {
    ...emptySections,
    ...loaded,
    personal: { ...emptyPersonalInfo, ...loaded?.personal },
  };
}
