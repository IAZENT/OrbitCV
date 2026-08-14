import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

export function BulletListEditor({ bullets, onChange }: Props) {
  function updateBullet(index: number, value: string) {
    onChange(bullets.map((b, i) => (i === index ? value : b)));
  }

  function removeBullet(index: number) {
    onChange(bullets.filter((_, i) => i !== index));
  }

  function addBullet() {
    onChange([...bullets, ""]);
  }

  return (
    <div className="flex flex-col gap-2">
      {bullets.map((bullet, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            value={bullet}
            placeholder="Achievement or responsibility…"
            onChange={(e) => updateBullet(index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => removeBullet(index)}
            aria-label="Remove bullet"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addBullet} className="w-fit">
        <Plus className="size-3.5" /> Add bullet
      </Button>
    </div>
  );
}
