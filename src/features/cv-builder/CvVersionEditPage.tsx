import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { getCvMaster, getCvVersion, updateCvVersion } from "@/features/cv-builder/api";
import { emptySections, type CvSections, type CvVersion } from "@/features/cv-builder/types";
import { getRegionProfile } from "@/features/region-profiles/profiles";
import { CvSectionsForm } from "@/features/cv-builder/components/CvSectionsForm";
import { KeywordScoreCard } from "@/features/cv-builder/keyword-match/KeywordScoreCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CvVersionEditPage() {
  const { id: masterId, versionId } = useParams<{ id: string; versionId: string }>();
  const navigate = useNavigate();
  const [version, setVersion] = useState<CvVersion | null>(null);
  const [regionProfileId, setRegionProfileId] = useState("international");
  const [label, setLabel] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [sections, setSections] = useState<CvSections>(emptySections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!masterId || !versionId) return;
    Promise.all([getCvMaster(masterId), getCvVersion(versionId)])
      .then(([master, loadedVersion]) => {
        setRegionProfileId(master.region_profile);
        setVersion(loadedVersion);
        setLabel(loadedVersion.label);
        setTargetRole(loadedVersion.target_role ?? "");
        setJdText(loadedVersion.jd_text ?? "");
        setSections({ ...emptySections, ...loadedVersion.sections });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load version."))
      .finally(() => setLoading(false));
  }, [masterId, versionId]);

  const profile = getRegionProfile(regionProfileId);

  async function handleSave() {
    if (!version) return;
    setSaving(true);
    setError(null);
    try {
      await updateCvVersion(version.id, {
        label,
        target_role: targetRole || null,
        jd_text: jdText || null,
        sections,
      });
      navigate(`/cv/${masterId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save version.");
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const { downloadCvPdf } = await import("@/features/cv-builder/pdf/downloadCvPdf");
      await downloadCvPdf(label, sections, profile);
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

  if (error && !version) {
    return (
      <AppShell>
        <p className="p-6 text-destructive">{error}</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="version-label">Version label</Label>
            <Input id="version-label" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="target-role">Target role</Label>
            <Input id="target-role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
          </div>
        </div>

        <section className="mb-10">
          <Label htmlFor="jd-text" className="mb-1.5 block">
            Job description
          </Label>
          <Textarea id="jd-text" rows={6} value={jdText} onChange={(e) => setJdText(e.target.value)} />
          <div className="mt-3">
            <KeywordScoreCard jdText={jdText} sections={sections} />
          </div>
        </section>

        <CvSectionsForm sections={sections} onChange={setSections} profile={profile} />

        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export PDF"}
          </Button>
          <Button variant="ghost" onClick={() => navigate(`/cv/${masterId}`)}>
            Back to master CV
          </Button>
        </div>
      </main>
    </AppShell>
  );
}
