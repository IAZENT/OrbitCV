import { type LanguageEntry, type CefrLevel, newId } from "@/features/cv-builder/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const CEFR_LEVELS: { value: CefrLevel; label: string; description: string; percent: number }[] = [
  { value: "A1", label: "A1 - Beginner", description: "Can understand and use familiar everyday expressions. Basic phrases for concrete needs.", percent: 15 },
  { value: "A2", label: "A2 - Elementary", description: "Can communicate in simple, routine tasks. Describes immediate environment and personal background.", percent: 30 },
  { value: "B1", label: "B1 - Intermediate", description: "Can deal with most travel situations. Produces connected text on familiar topics. Describes experiences and ambitions.", percent: 50 },
  { value: "B2", label: "B2 - Upper Intermediate", description: "Can interact with native speakers fluently. Produces clear, detailed text on a wide range of subjects.", percent: 70 },
  { value: "C1", label: "C1 - Advanced", description: "Can express ideas fluently and spontaneously. Uses language flexibly for social, academic, and professional purposes.", percent: 85 },
  { value: "C2", label: "C2 - Proficient", description: "Can understand virtually everything. Expresses themselves precisely, spontaneously, and with fine nuance.", percent: 98 },
];

interface Props {
  entries: LanguageEntry[];
  onChange: (entries: LanguageEntry[]) => void;
}

export function LanguagesSection({ entries, onChange }: Props) {
  function add() {
    onChange([...entries, { id: newId(), language: "", level: "B1" }]);
  }

  function update(id: string, patch: Partial<LanguageEntry>) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function remove(id: string) {
    onChange(entries.filter((e) => e.id !== id));
  }

  return (
    <div className="flex flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-2 rounded-md border border-border p-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Label htmlFor={`lang-${entry.id}`} className="sr-only">
                Language
              </Label>
              <Input
                id={`lang-${entry.id}`}
                value={entry.language}
                onChange={(e) => update(entry.id, { language: e.target.value })}
                placeholder="e.g. English, Nepali, Hindi..."
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(entry.id)}
              aria-label={`Remove ${entry.language || "language"}`}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-1.5">
              {CEFR_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => update(entry.id, { level: lvl.value })}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    entry.level === lvl.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {lvl.value}
                </button>
              ))}
            </div>
            {entry.level && (
              <CefrDescription level={entry.level} />
            )}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={add} className="self-start">
        + Add language
      </Button>
    </div>
  );
}

function CefrDescription({ level }: { level: CefrLevel }) {
  const lvl = CEFR_LEVELS.find((l) => l.value === level);
  if (!lvl) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${lvl.percent}%` }}
        />
      </div>
      <span className="w-9 text-right text-xs text-muted-foreground">{lvl.percent}%</span>
    </div>
  );
}

export { CEFR_LEVELS };
