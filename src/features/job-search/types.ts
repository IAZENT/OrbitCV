export interface JobListing {
  id: string;
  source: "remoteok" | "arbeitnow";
  title: string;
  company: string;
  location: string;
  url: string;
  tags: string[];
}
