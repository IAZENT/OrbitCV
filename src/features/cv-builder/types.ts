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
