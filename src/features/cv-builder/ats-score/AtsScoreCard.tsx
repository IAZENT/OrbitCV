import { useMemo, useState } from "react";
import type { CvSections } from "@/features/cv-builder/types";
import { scoreAts, type AtsCheck } from "@/features/cv-builder/ats-score/atsScore";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

interface Props {
  sections: CvSections;
}

const CATEGORY_LABELS: Record<string, string> = {
  format: "Format & Parsing",
  contact: "Contact Info",
  sections: "Section Completeness",
  keywords: "Keywords & Skills",
  experience: "Experience Quality",
  content: "Content Quality",
};

const CATEGORY_ORDER = ["format", "contact", "sections", "keywords", "experience", "content"];

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "text-primary";
    case "B": return "text-primary";
    case "C": return "text-foreground";
    default: return "text-destructive";
  }
}

function gradeBarColor(grade: string): string {
  switch (grade) {
    case "A": return "bg-primary";
    case "B": return "bg-primary";
    case "C": return "bg-muted-foreground/60";
    default: return "bg-destructive";
  }
}

function CheckRow({ check }: { check: AtsCheck }) {
  return (
    <div className="flex items-start gap-2">
      <span className={`mt-0.5 text-xs ${check.passed ? "text-primary" : "text-destructive"}`}>
        {check.passed ? "\u2713" : "\u2717"}
      </span>
      <div className="min-w-0 flex-1">
        <span className={check.passed ? "" : "text-destructive/80"}>
          {check.label}
        </span>
        {check.detail && (
          <span className="ml-1 text-xs text-muted-foreground">
            {check.detail}
          </span>
        )}
      </div>
    </div>
  );
}

function ParseRiskBadge({ risk }: { risk: string }) {
  if (risk === "low") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-primary">
        <ShieldCheck className="size-3.5" />
        Low parse risk
      </div>
    );
  }
  if (risk === "medium") {
    return (
      <div className="flex items-center gap-1.5 text-xs text-foreground">
        <ShieldAlert className="size-3.5" />
        Medium parse risk
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-xs text-destructive">
      <ShieldX className="size-3.5" />
      High parse risk
    </div>
  );
}

export function AtsScoreCard({ sections }: Props) {
  const [expanded, setExpanded] = useState(false);
  const result = useMemo(() => scoreAts(sections), [sections]);

  const failedChecks = result.checks.filter((c) => !c.passed && c.weight > 0);

  // Group checks by category
  const grouped = CATEGORY_ORDER
    .map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      checks: result.checks.filter((c) => c.category === cat),
    }))
    .filter((g) => g.checks.length > 0);

  return (
    <div className="rounded-md border border-border p-4 text-sm">
      <div className="mb-2 flex items-baseline gap-2">
        <span className={`text-2xl ${gradeColor(result.grade)}`}>
          {result.score}
        </span>
        <span className="text-muted-foreground">
          ATS score
          <span className={`ml-1.5 font-medium ${gradeColor(result.grade)}`}>
            {result.grade}
          </span>
        </span>
      </div>

      {/* Score bar */}
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${gradeBarColor(result.grade)}`}
          style={{ width: `${result.score}%` }}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <ParseRiskBadge risk={result.parseRisk} />
        {failedChecks.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {failedChecks.length} issue{failedChecks.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div className="mt-3 flex flex-col gap-3">
          {grouped.map((group) => (
            <div key={group.category}>
              <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {group.label}
              </div>
              <div className="flex flex-col gap-1">
                {group.checks.map((check) => (
                  <CheckRow key={check.id} check={check} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
