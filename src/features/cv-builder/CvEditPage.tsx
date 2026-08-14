import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppHeader } from "@/features/auth/AppHeader";
import { getCvMaster, updateCvMaster } from "@/features/cv-builder/api";
import { emptySections, type CvMaster, type CvSections } from "@/features/cv-builder/types";
import { REGION_PROFILES, getRegionProfile } from "@/features/region-profiles/profiles";
import { PersonalFields } from "@/features/cv-builder/components/PersonalFields";
import { ExperienceSection } from "@/features/cv-builder/components/ExperienceSection";
import { EducationSection } from "@/features/cv-builder/components/EducationSection";
import { ProjectsSection } from "@/features/cv-builder/components/ProjectsSection";
import { SkillsField } from "@/features/cv-builder/components/SkillsField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-xl">{children}</h2>;
}

export function CvEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cv, setCv] = useState<CvMaster | null>(null);
  const [name, setName] = useState("");
  const [regionProfileId, setRegionProfileId] = useState("international");
  const [sections, setSections] = useState<CvSections>(emptySections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCvMaster(id)
      .then((loaded) => {
        setCv(loaded);
        setName(loaded.name);
        setRegionProfileId(loaded.region_profile);
        setSections({ ...emptySections, ...loaded.sections });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load CV."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    if (!cv) return;
    setSaving(true);
    setError(null);
    try {
      await updateCvMaster(cv.id, { name, region_profile: regionProfileId, sections });
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save CV.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-svh">
        <AppHeader />
        <p className="p-6 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (error && !cv) {
    return (
      <div className="min-h-svh">
        <AppHeader />
        <p className="p-6 text-destructive">{error}</p>
      </div>
    );
  }

  const profile = getRegionProfile(regionProfileId);

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const { downloadCvPdf } = await import("@/features/cv-builder/pdf/downloadCvPdf");
      await downloadCvPdf(name, sections, profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF.");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="min-h-svh">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="cv-name">CV name</Label>
            <Input id="cv-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="region-profile">Format</Label>
            <select
              id="region-profile"
              value={regionProfileId}
              onChange={(e) => setRegionProfileId(e.target.value)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              {Object.values(REGION_PROFILES).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <section className="mb-10">
          <SectionHeading>Personal details</SectionHeading>
          <PersonalFields
            value={sections.personal}
            profile={profile}
            onChange={(personal) => setSections((s) => ({ ...s, personal }))}
          />
        </section>

        <section className="mb-10">
          <SectionHeading>Summary</SectionHeading>
          <Textarea
            rows={4}
            value={sections.summary}
            onChange={(e) => setSections((s) => ({ ...s, summary: e.target.value }))}
            placeholder="A short professional summary…"
          />
        </section>

        <section className="mb-10">
          <SectionHeading>Experience</SectionHeading>
          <ExperienceSection
            entries={sections.experience}
            onChange={(experience) => setSections((s) => ({ ...s, experience }))}
          />
        </section>

        <section className="mb-10">
          <SectionHeading>Education</SectionHeading>
          <EducationSection
            entries={sections.education}
            onChange={(education) => setSections((s) => ({ ...s, education }))}
          />
        </section>

        <section className="mb-10">
          <SectionHeading>Skills</SectionHeading>
          <SkillsField
            skills={sections.skills}
            onChange={(skills) => setSections((s) => ({ ...s, skills }))}
          />
        </section>

        <section className="mb-10">
          <SectionHeading>Projects</SectionHeading>
          <ProjectsSection
            entries={sections.projects}
            onChange={(projects) => setSections((s) => ({ ...s, projects }))}
          />
        </section>

        {profile.fields.declaration && (
          <section className="mb-10">
            <SectionHeading>Declaration</SectionHeading>
            <Textarea
              rows={3}
              value={sections.declaration}
              onChange={(e) => setSections((s) => ({ ...s, declaration: e.target.value }))}
              placeholder="I hereby declare that the above information is true to the best of my knowledge."
            />
          </section>
        )}

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export PDF"}
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
