import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { getCvMaster, updateCvMaster } from "@/features/cv-builder/api";
import { emptySections, type CvMaster, type CvSections } from "@/features/cv-builder/types";
import { REGION_PROFILES, getRegionProfile } from "@/features/region-profiles/profiles";
import { CvSectionsForm } from "@/features/cv-builder/components/CvSectionsForm";
import { CvVersionsPanel } from "@/features/cv-builder/components/CvVersionsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

  if (loading) {
    return (
      <AppShell>
        <p className="p-6 text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (error && !cv) {
    return (
      <AppShell>
        <p className="p-6 text-destructive">{error}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
            <CvSectionsForm sections={sections} onChange={setSections} profile={profile} />

            {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

            {cv && <CvVersionsPanel cvMaster={cv} currentSections={sections} />}
          </div>

          <aside className="order-1 flex flex-col gap-4 lg:sticky lg:top-8 lg:order-2">
            <div className="flex flex-col gap-1.5">
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

            <div className="flex flex-wrap gap-2">
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
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
