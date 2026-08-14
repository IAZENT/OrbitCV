import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { upsertUserProfile } from "@/features/profile/api";
import type { ExperienceLevel } from "@/features/profile/types";
import { TagInput } from "@/components/tag-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEPS = ["About you", "Career goals", "Preferences"] as const;

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: "entry", label: "Entry level", desc: "0-2 years, fresh graduate or early career" },
  { value: "mid", label: "Mid level", desc: "3-7 years, established professional" },
  { value: "senior", label: "Senior level", desc: "8+ years, leadership or specialist roles" },
];

export function OnboardingWizard() {
  const { session } = useSession();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [nationality, setNationality] = useState("");
  const [location, setLocation] = useState("");
  const [desiredRoles, setDesiredRoles] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>("entry");
  const [desiredLocations, setDesiredLocations] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  async function handleFinish() {
    if (!session?.user) return;
    setSaving(true);
    setError(null);
    try {
      await upsertUserProfile(session.user.id, {
        full_name: fullName,
        nationality,
        location,
        desired_roles: desiredRoles,
        experience_level: experienceLevel,
        desired_locations: desiredLocations,
        industries,
        languages,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  function handleSkip() {
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                  i < step
                    ? "bg-primary text-primary-foreground"
                    : i === step
                      ? "border-2 border-primary text-primary"
                      : "border border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {i < step ? "\u2713" : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>

        <h1 className="mb-1 text-2xl">{STEPS[step]}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {step === 0 && "Tell us about yourself. This helps personalize your experience."}
          {step === 1 && "What kind of roles are you looking for?"}
          {step === 2 && "Where do you want to work? What industries interest you?"}
        </p>

        {/* Step content */}
        <div className="min-h-[280px]">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-name">Full name</Label>
                <Input
                  id="ob-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ram Sharma"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-nationality">Nationality</Label>
                <Input
                  id="ob-nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. Nepali"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ob-location">Current location</Label>
                <Input
                  id="ob-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Kathmandu, Nepal"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Desired roles</Label>
                <TagInput
                  tags={desiredRoles}
                  onChange={setDesiredRoles}
                  placeholder="e.g. frontend developer, data analyst..."
                  label="Desired roles"
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter or comma to add each role.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Experience level</Label>
                <div className="flex flex-col gap-2">
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors ${
                        experienceLevel === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <input
                        type="radio"
                        name="experience"
                        value={opt.value}
                        checked={experienceLevel === opt.value}
                        onChange={() => setExperienceLevel(opt.value)}
                        className="accent-primary"
                      />
                      <div>
                        <div className="text-sm font-medium">{opt.label}</div>
                        <div className="text-xs text-muted-foreground">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Desired locations</Label>
                <TagInput
                  tags={desiredLocations}
                  onChange={setDesiredLocations}
                  placeholder="e.g. Nepal, London, Remote..."
                  label="Desired locations"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Industries</Label>
                <TagInput
                  tags={industries}
                  onChange={setIndustries}
                  placeholder="e.g. tech, finance, NGO..."
                  label="Industries"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Languages</Label>
                <TagInput
                  tags={languages}
                  onChange={setLanguages}
                  placeholder="e.g. English, Nepali, Hindi..."
                  label="Languages"
                />
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" onClick={back}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Next</Button>
            ) : (
              <Button onClick={handleFinish} disabled={saving}>
                {saving ? "Saving…" : "Finish"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
