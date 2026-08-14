import { useState } from "react";
import type { AiSuggestion } from "@/features/ai-tailoring/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AiSuggestionPanelProps {
  suggestions: AiSuggestion[];
  onApply: (accepted: AiSuggestion[]) => void;
  onClear: () => void;
}

export function AiSuggestionPanel({ suggestions, onApply, onClear }: AiSuggestionPanelProps) {
  const [items, setItems] = useState(
    suggestions.map((s) => ({ ...s })),
  );

  function toggle(index: number, accept: boolean) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, accepted: accept } : item)),
    );
  }

  function acceptAll() {
    setItems((prev) => prev.map((item) => ({ ...item, accepted: true })));
  }

  function rejectAll() {
    setItems((prev) => prev.map((item) => ({ ...item, accepted: false })));
  }

  const pendingCount = items.filter((s) => s.accepted === null).length;
  const acceptedCount = items.filter((s) => s.accepted === true).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          AI Suggestions ({acceptedCount}/{items.length} accepted)
        </h3>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={acceptAll}>
                Accept all
              </Button>
              <Button variant="outline" size="sm" onClick={rejectAll}>
                Reject all
              </Button>
            </>
          )}
          <Button
            size="sm"
            onClick={() => onApply(items.filter((s) => s.accepted === true))}
            disabled={acceptedCount === 0}
          >
            Apply accepted
          </Button>
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((suggestion, i) => (
          <Card
            key={i}
            className={
              suggestion.accepted === true
                ? "border-green-500"
                : suggestion.accepted === false
                  ? "border-red-300 opacity-60"
                  : ""
            }
          >
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="text-xs text-muted-foreground">
                {suggestion.section}
                {suggestion.entryIndex !== undefined && ` > entry ${suggestion.entryIndex}`}
                {suggestion.bulletIndex !== undefined && ` > bullet ${suggestion.bulletIndex}`}
              </div>
              <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                <div>
                  <div className="mb-1 text-xs font-medium text-muted-foreground">Original</div>
                  <p className="rounded bg-muted/50 p-2">{suggestion.original}</p>
                </div>
                <div>
                  <div className="mb-1 text-xs font-medium text-muted-foreground">Suggested</div>
                  <p className="rounded bg-muted/50 p-2">{suggestion.suggested}</p>
                </div>
              </div>
              {suggestion.accepted === null && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toggle(i, true)}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggle(i, false)}>
                    Reject
                  </Button>
                </div>
              )}
              {suggestion.accepted === true && (
                <span className="text-xs text-green-600">Accepted</span>
              )}
              {suggestion.accepted === false && (
                <span className="text-xs text-red-500">Rejected</span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
