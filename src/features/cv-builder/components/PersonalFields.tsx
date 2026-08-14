import type { PersonalInfo } from "@/features/cv-builder/types";
import type { RegionProfile } from "@/features/region-profiles/types";
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
  
        {fields.photo !== "hidden" && (
          <Field
            id="photoUrl"
            label={`Photo URL${fields.photo === "expected" ? " (recommended)" : " (optional)"}`}
            value={value.photoUrl}
            onChange={(v) => set("photoUrl", v)}
          />
        )}
        {fields.dateOfBirth !== "hidden" && (
          <Field
            id="dateOfBirth"
            label="Date of birth"
            type="date"
            value={value.dateOfBirth}
            onChange={(v) => set("dateOfBirth", v)}
            required={fields.dateOfBirth === "required" || fields.dateOfBirth === "expected"}
          />
        )}
        {fields.fatherName !== "hidden" && (
          <Field
            id="fatherName"
            label="Father's name"
            value={value.fatherName}
            onChange={(v) => set("fatherName", v)}
            required={fields.fatherName === "required"}
          />
        )}
        {fields.citizenshipNumber !== "hidden" && (
          <Field
            id="citizenshipNumber"
            label="Citizenship number"
            value={value.citizenshipNumber}
            onChange={(v) => set("citizenshipNumber", v)}
          />
        )}
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
