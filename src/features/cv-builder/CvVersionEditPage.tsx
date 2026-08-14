import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/features/auth/AppShell";
import { useSession } from "@/features/auth/useSession";
import { getCvMaster, getCvVersion, updateCvVersion } from "@/features/cv-builder/api";
import { emptySections, normalizeSections, type CvSections, type CvVersion } from "@/features/cv-builder/types";
import { getRegionProfile } from "@/features/region-profiles/profiles";
import { CvSectionsForm } from "@/features/cv-builder/components/CvSectionsForm";
import { KeywordScoreCard } from "@/features/cv-builder/keyword-match/KeywordScoreCard";
import { getUserSettings } from "@/features/settings/api";
import { tailorCv, applySuggestions } from "@/features/ai-tailoring/tailor";
import type { AiSuggestion } from "@/features/ai-tailoring/types";
import { AiSuggestionPanel } from "@/features/ai-tailoring/AiSuggestionPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CvVersionEditPage() {
  const { id: masterId, versionId } = useParams<{ id: string; versionId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();
  const [version, setVersion] = useState<CvVersion | null>(null);
  const [regionProfileId, setRegionProfileId] = useState("international");
  const [label, setLabel] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [sections, setSections] = useState<CvSections>(emptySections);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const lastSavedRef = useRef<{ label: string; targetRole: string; jdText: string; sections: CvSections } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AiSuggestion[] | null>(null);
  const [tailoring, setTailoring] = useState(false);
  const [userKey, setUserKey] = useState<{ encrypted: string; iv: string } | null>(null);

  useEffect(() => {
    if (!masterId || !versionId) return;
    Promise.all([getCvMaster(masterId), getCvVersion(versionId)])
      .then(([master, loadedVersion]) => {
        setRegionProfileId(master.region_profile);
        setVersion(loadedVersion);
        setLabel(loadedVersion.label);
        setTargetRole(loadedVersion.target_role ?? "");
        setJdText(loadedVersion.jd_text ?? "");
        const loadedSections = normalizeSections(loadedVersion.sections);
        setSections(loadedSections);
        lastSavedRef.current = {
          label: loadedVersion.label,
          targetRole: loadedVersion.target_role ?? "",
          jdText: loadedVersion.jd_text ?? "",
          sections: loadedSections,
        };
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load version."))
      .finally(() => setLoading(false));

    // Load user's API key settings for BYOK tailoring.
    if (session?.user) {
      getUserSettings(session.user.id)
        .then((settings) => {
          if (settings.ai_key_encrypted && settings.ai_key_iv) {
            setUserKey({ encrypted: settings.ai_key_encrypted, iv: settings.ai_key_iv });
          }
        })
        .catch(() => {});
    }
  }, [masterId, versionId, session?.user]);

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
      lastSavedRef.current = { label, targetRole, jdText, sections };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save version.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTailor() {
    if (!jdText.trim()) {
      setError("Add a job description first to use AI tailoring.");
      return;
    }
    setTailoring(true);
    setError(null);
    try {
      const result = await tailorCv({
        jdText,
        sections,
        encryptedKey: userKey?.encrypted ?? null,
        iv: userKey?.iv ?? null,
        sessionToken: session?.access_token ?? "",
      });
      setAiSuggestions(result.suggestions);
      if (result.source === "shared" && result.remaining !== undefined) {
        setError(`Shared quota: ${result.remaining} requests remaining today.`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI tailoring failed.");
    } finally {
      setTailoring(false);
    }
  }

  function handleApplySuggestions(accepted: AiSuggestion[]) {
    const updated = applySuggestions(accepted, sections);
    setSections(updated);
    setAiSuggestions(null);
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

  const isSaved = lastSavedRef.current !== null &&
    JSON.stringify({ label, targetRole, jdText, sections }) === JSON.stringify(lastSavedRef.current);

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
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="order-2 min-w-0 lg:order-1">
            <CvSectionsForm sections={sections} onChange={setSections} profile={profile} />

            {aiSuggestions && (
              <AiSuggestionPanel
                suggestions={aiSuggestions}
                onApply={handleApplySuggestions}
                onClear={() => setAiSuggestions(null)}
              />
            )}

            {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
          </div>

          <aside className="order-1 flex flex-col gap-4 lg:sticky lg:top-8 lg:order-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="version-label">Version label</Label>
              <Input id="version-label" value={label} onChange={(e) => setLabel(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="target-role">Target role</Label>
              <Input id="target-role" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
              {targetRole && (
                <Link
                  to={`/jobs?q=${encodeURIComponent(targetRole)}`}
                  className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                >
                  Find jobs for this role
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="jd-text">Job description</Label>
              <Textarea id="jd-text" rows={6} value={jdText} onChange={(e) => setJdText(e.target.value)} />
              <KeywordScoreCard jdText={jdText} sections={sections} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleSave} disabled={saving || isSaved}>
                {saving ? "Saving…" : isSaved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={handleTailor} disabled={tailoring || !jdText.trim()}>
                {tailoring ? "Tailoring…" : "AI Tailor"}
              </Button>
              <Button variant="outline" onClick={handleExport} disabled={exporting}>
                {exporting ? "Exporting…" : "Export PDF"}
              </Button>
              <Button variant="ghost" onClick={() => navigate(`/cv/${masterId}`)}>
                Back to master CV
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </AppShell>
  );
}
