export type ExperienceLevel = "entry" | "mid" | "senior";

export interface UserProfile {
  user_id: string;
  full_name: string;
  nationality: string;
  location: string;
  desired_roles: string[];
  desired_locations: string[];
  experience_level: ExperienceLevel;
  industries: string[];
  languages: string[];
  created_at: string;
  updated_at: string;
}

export const emptyUserProfile: UserProfile = {
  user_id: "",
  full_name: "",
  nationality: "",
  location: "",
  desired_roles: [],
  desired_locations: [],
  experience_level: "entry",
  industries: [],
  languages: [],
  created_at: "",
  updated_at: "",
};
