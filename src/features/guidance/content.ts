// Research-backed CV writing guidance, shown in the app and reused as
// inline hints in the form. See docs/07-cv-best-practices.md for sources.

export interface BulletExample {
  weak: string;
  strong: string;
  why: string;
}

export const bulletExamples: BulletExample[] = [
  {
    weak: "Responsible for managing the sales team",
    strong: "Led a team of 10 sales reps, growing quarterly revenue by 25% through a new onboarding process",
    why: "\"Responsible for\" describes a job category anyone in that role would have. The strong version names the action, the scale, and a measurable result.",
  },
  {
    weak: "Helped with inventory management",
    strong: "Cut stock shortages by 30% by rebuilding the demand forecasting process for a 500-SKU inventory",
    why: "\"Helped with\" signals a supporting role. Naming what changed, and by how much, shows ownership.",
  },
  {
    weak: "Worked on the company website",
    strong: "Rebuilt the marketing site in React, cutting page load time from 4.2s to 1.1s and lifting signups 18%",
    why: "Specifics (the technology, the before/after numbers) let a reader judge the work without asking follow-up questions.",
  },
  {
    weak: "Duties included handling customer support tickets",
    strong: "Resolved 40+ support tickets a week, holding a 96% satisfaction score across 2,000+ conversations",
    why: "Volume and a quality metric together show both throughput and standard of work, not just that the task was done.",
  },
];

export interface SummaryExample {
  label: string;
  weak: string;
  strong: string;
}

export const summaryExamples: SummaryExample[] = [
  {
    label: "Marketing",
    weak: "I am a marketing expert and have worked in digital marketing for several years. I am good at SEO and social media, and I can help your company grow.",
    strong:
      "Digital marketer with 5 years running SEO and paid campaigns for B2B SaaS. Grew organic traffic 3x in 18 months and cut cost-per-lead by 40% through funnel testing.",
  },
  {
    label: "Software",
    weak: "Hardworking software developer looking for a challenging opportunity to use my skills and grow professionally.",
    strong:
      "Backend engineer with 4 years building payment infrastructure in Go. Led the migration to event-driven processing that cut checkout failures by 60%.",
  },
];

export const summaryFormula = "[Job title] + [top skills] + [a quantifiable achievement], in 2 to 4 sentences.";
export const bulletFormula = "Action verb + what you did + measurable result.";

export interface ChecklistItem {
  item: string;
  guidance: string;
}

export const universallyAvoid: ChecklistItem[] = [
  {
    item: "\"References available upon request\"",
    guidance: "Assumed by every employer. Mention references in your cover letter or when asked, not as a resume line.",
  },
  {
    item: "An objective statement (\"seeking a challenging role where I can grow\")",
    guidance: "Says nothing about what you offer. Replace it with a summary that states your title, skills, and a result.",
  },
  {
    item: "Vague duty descriptions without numbers",
    guidance: "About a third of hiring managers pass over resumes with no measurable results. Quantify wherever possible: volume, frequency, percentage, or scale.",
  },
  {
    item: "Passive phrasing (\"responsible for\", \"duties included\", \"assisted with\")",
    guidance: "Open every bullet with a direct action verb (led, built, cut, grew, launched) instead.",
  },
];

export const regionSensitiveFields: ChecklistItem[] = [
  {
    item: "Photo",
    guidance:
      "Hidden by default for the International profile: in the US and UK, employers generally avoid resumes with photos to reduce bias-related liability under equal-opportunity law. Expected by convention in Germany. Optional and employer-dependent in Nepal.",
  },
  {
    item: "Date of birth",
    guidance:
      "Hidden for International. Age-related screening is a discrimination risk in the US/UK, so it is left off. Commonly included in Germany, optional in Nepal.",
  },
  {
    item: "Gender / marital status",
    guidance:
      "Not collected by any OrbitCV region profile. It is not relevant to job performance and is illegal for most employers to request in screening in the US, UK, and EU.",
  },
  {
    item: "Father's name / citizenship number",
    guidance:
      "Not applicable internationally. Shown as optional fields only in the Nepal profile, where they are a common (though not universal) convention for domestic government and NGO roles.",
  },
];
