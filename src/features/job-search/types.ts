export interface JobListing {
  id: string;
  source: "remoteok" | "arbeitnow" | "adzuna" | "jooble" | "kumarijob";
  title: string;
  company: string;
  location: string;
  url: string;
  tags: string[];
}
