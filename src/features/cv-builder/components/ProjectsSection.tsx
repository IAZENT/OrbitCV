import { Plus, Trash2 } from "lucide-react";
import type { ProjectEntry } from "@/features/cv-builder/types";
import { newId } from "@/features/cv-builder/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BulletListEditor } from "@/features/cv-builder/components/BulletListEditor";

interface Props {
  entries: ProjectEntry[];
  onChange: (entries: ProjectEntry[]) => void;
}

const emptyEntry = (): ProjectEntry => ({
  id: newId(),
  name: "",
  description: "",
  link: "",
  bullets: [],
});

export function ProjectsSection({ entries, onChange }: Props) {
  function update(id: string, patch: Partial<ProjectEntry>) {
    onChange(entries.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  }

  function remove(id: string) {
    onChange(entries.filter((entry) => entry.id !== id));
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="flex flex-col gap-3 pt-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`project-name-${entry.id}`}>Name</Label>
                <Input id={`project-name-${entry.id}`} value={entry.name} onChange={(e) => update(entry.id, { name: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`project-link-${entry.id}`}>Link</Label>
                <Input id={`project-link-${entry.id}`} value={entry.link} onChange={(e) => update(entry.id, { link: e.target.value })} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`project-desc-${entry.id}`}>Description</Label>
              <Textarea
                id={`project-desc-${entry.id}`}
                rows={2}
                value={entry.description}
                onChange={(e) => update(entry.id, { description: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Bullets</Label>
              <BulletListEditor bullets={entry.bullets} onChange={(bullets) => update(entry.id, { bullets })} />
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit text-destructive"
              onClick={() => remove(entry.id)}
            >
              <Trash2 className="size-3.5" /> Remove
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={() => onChange([...entries, emptyEntry()])} className="w-fit">
        <Plus className="size-4" /> Add project
      </Button>
    </div>
  );
}
