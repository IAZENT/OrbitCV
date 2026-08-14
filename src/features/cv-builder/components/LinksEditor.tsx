import { Plus, Trash2 } from "lucide-react";
import type { ProfileLink } from "@/features/cv-builder/types";
import { newId } from "@/features/cv-builder/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  links: ProfileLink[];
  onChange: (links: ProfileLink[]) => void;
}

export function LinksEditor({ links, onChange }: Props) {
  function update(id: string, patch: Partial<ProfileLink>) {
    onChange(links.map((link) => (link.id === id ? { ...link, ...patch } : link)));
  }

  function remove(id: string) {
    onChange(links.filter((link) => link.id !== id));
  }

  function add() {
    onChange([...links, { id: newId(), label: "", url: "" }]);
  }

  return (
    <div className="flex flex-col gap-2">
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-2">
          <Input
            value={link.label}
            placeholder="e.g. GitHub, HackTheBox, TryHackMe, Portfolio"
            className="w-40 shrink-0"
            onChange={(e) => update(link.id, { label: e.target.value })}
          />
          <Input
            value={link.url}
            placeholder="https://…"
            onChange={(e) => update(link.id, { url: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(link.id)}
            aria-label="Remove link"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add} className="w-fit">
        <Plus className="size-3.5" /> Add profile link
      </Button>
    </div>
  );
}
