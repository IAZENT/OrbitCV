import { Plus, Trash2 } from "lucide-react";
import type { ExperienceEntry } from "@/features/cv-builder/types";
import { newId } from "@/features/cv-builder/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BulletListEditor } from "@/features/cv-builder/components/BulletListEditor";

interface Props {
  entries: ExperienceEntry[];
  onChange: (entries: ExperienceEntry[]) => void;
}

const emptyEntry = (): ExperienceEntry => ({
  id: newId(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  bullets: [],
});

export function ExperienceSection({ entries, onChange }: Props) {
  function update(id: string, patch: Partial<ExperienceEntry>) {
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
                <Label htmlFor={`role-${entry.id}`}>Role</Label>
                <Input id={`role-${entry.id}`} value={entry.role} onChange={(e) => update(entry.id, { role: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`company-${entry.id}`}>Company</Label>
                <Input id={`company-${entry.id}`} value={entry.company} onChange={(e) => update(entry.id, { company: e.target.value })} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`location-${entry.id}`}>Location</Label>
                <Input id={`location-${entry.id}`} value={entry.location} onChange={(e) => update(entry.id, { location: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`start-${entry.id}`}>Start</Label>
                  <Input
                    id={`start-${entry.id}`}
                    type="month"
                    value={entry.startDate}
                    onChange={(e) => update(entry.id, { startDate: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`end-${entry.id}`}>End</Label>
                  <Input
                    id={`end-${entry.id}`}
                    type="month"
                    value={entry.endDate}
                    disabled={entry.current}
                    onChange={(e) => update(entry.id, { endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={entry.current}
                onChange={(e) => update(entry.id, { current: e.target.checked, endDate: "" })}
              />
              I currently work here
            </label>

            <div className="flex flex-col gap-1.5">
              <Label>Bullets</Label>
              <BulletListEditor
                bullets={entry.bullets}
                onChange={(bullets) => update(entry.id, { bullets })}
              />
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
        <Plus className="size-4" /> Add experience
      </Button>
    </div>
  );
}
