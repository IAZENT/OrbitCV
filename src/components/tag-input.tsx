import { useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function TagInput({ tags, onChange, placeholder = "Type and press Enter...", label = "Add items" }: Props) {
  const [draft, setDraft] = useState("");

  function commitDraft() {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitDraft();
    } else if (e.key === "Backspace" && draft === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
      </div>
      <Label htmlFor={`tag-input-${label}`} className="sr-only">
        {label}
      </Label>
      <Input
        id={`tag-input-${label}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commitDraft}
        placeholder={placeholder}
      />
    </div>
  );
}
