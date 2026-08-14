import { useMemo } from "react";
import type { CvSections } from "@/features/cv-builder/types";
import { scoreCvAgainstJd } from "@/features/cv-builder/keyword-match/keywordScore";

interface Props {
  jdText: string;
  sections: CvSections;
}

export function KeywordScoreCard({ jdText, sections }: Props) {
  const result = useMemo(() => scoreCvAgainstJd(jdText, sections), [jdText, sections]);

  if (!jdText.trim()) return null;

  const color =
    result.score >= 70 ? "text-primary" : result.score >= 40 ? "text-foreground" : "text-destructive";

  return (
    <div className="rounded-md border border-border p-4 text-sm">
      <div className="mb-2 flex items-baseline gap-2">
        <span className={`text-2xl ${color}`}>{result.score}%</span>
        <span className="text-muted-foreground">keyword match with this job description</span>
      </div>
      {result.missing.length > 0 && (
        <div>
          <span className="text-muted-foreground">Consider adding: </span>
          <span>{result.missing.join(", ")}</span>
        </div>
      )}
    </div>
  );
}
