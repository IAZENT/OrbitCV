export interface AiSuggestion {
  section: string;
  entryIndex: number;
  bulletIndex: number;
  original: string;
  suggested: string;
  accepted: boolean | null; // null = pending, true = accepted, false = rejected
}
