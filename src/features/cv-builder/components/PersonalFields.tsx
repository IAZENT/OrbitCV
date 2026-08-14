import type { PersonalInfo } from "@/features/cv-builder/types";
import type { RegionProfile } from "@/features/region-profiles/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LinksEditor } from "@/features/cv-builder/components/LinksEditor";

interface Props {
  value: PersonalInfo;
  onChange: (value: PersonalInfo) => void;
  profile: RegionProfile;
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export function PersonalFields({ value, onChange, profile }: Props) {
  const set = <K extends keyof PersonalInfo>(key: K, v: PersonalInfo[K]) =>
    onChange({ ...value, [key]: v });

  const { fields } = profile;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field id="fullName" label="Full name" value={value.fullName} onChange={(v) => set("fullName", v)} required />
        <Field id="email" label="Email" type="email" value={value.email} onChange={(v) => set("email", v)} required />
        <Field id="phone" label="Phone" value={value.phone} onChange={(v) => set("phone", v)} />
        <Field id="location" label="Location" value={value.location} onChange={(v) => set("location", v)} />
        <Field
          id="linkedinUrl"
          label="LinkedIn URL"
          value={value.linkedinUrl}
          onChange={(v) => set("linkedinUrl", v)}
        />
        {fields.nationality !== "hidden" && (
          <Field
            id="nationality"
            label="Nationality"
            value={value.nationality}
            onChange={(v) => set("nationality", v)}
            required={fields.nationality === "required" || fields.nationality === "expected"}
          />
        )}
      </div>

      <div className="flex flex-col gap-2 rounded-lg border p-3.5 bg-muted/20">
        <div className="flex flex-col gap-0.5">
          <Label className="text-sm font-medium">Link Display Style in PDF</Label>
          <p className="text-xs text-muted-foreground">
            Choose whether profile links appear as clean hyperlinked names or full domain URLs in your header.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            type="button"
            variant={value.linkStyle !== "full" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => set("linkStyle", "compact")}
          >
            🏷️ Minimal (Hyperlinked Words)
          </Button>
          <Button
            type="button"
            variant={value.linkStyle === "full" ? "default" : "outline"}
            size="sm"
            className="text-xs"
            onClick={() => set("linkStyle", "full")}
          >
            🔗 Full Domain URL
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Other profiles</Label>
        <p className="text-sm text-muted-foreground">
          GitHub, HackTheBox, TryHackMe, personal site, anything relevant to the role.
        </p>
        <LinksEditor links={value.links} onChange={(links) => set("links", links)} />
      </div>
    </div>
  );
}
