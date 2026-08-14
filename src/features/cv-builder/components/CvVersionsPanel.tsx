import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { CvMaster, CvSections, CvVersion } from "@/features/cv-builder/types";
import { createCvVersion, deleteCvVersion, listCvVersions } from "@/features/cv-builder/api";
import { KeywordScoreCard } from "@/features/cv-builder/keyword-match/KeywordScoreCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Wand2 } from "lucide-react";

interface Props {
  cvMaster: CvMaster;
  currentSections: CvSections;
}

export function CvVersionsPanel({ cvMaster, currentSections }: Props) {
  const [versions, setVersions] = useState<CvVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [label, setLabel] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, [cvMaster.id]);

  async function refresh() {
    setLoading(true);
    try {
      setVersions(await listCvVersions(cvMaster.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load versions.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      await createCvVersion(
        cvMaster.id,
        label || targetRole || "Untitled version",
        targetRole,
        jdText,
        currentSections,
      );
      setLabel("");
      setTargetRole("");
      setJdText("");
      setShowForm(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create version.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteCvVersion(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete version.");
    }
  }

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl">Tailored versions</h2>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Wand2 className="mr-1.5 size-3.5" />
            New tailored version
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="mb-4">
          <CardContent className="flex flex-col gap-3 pt-6">
            <p className="text-sm text-muted-foreground">
              Fork a copy of your CV for a specific job. Paste a job description and AI will help
              rewrite your bullets to match. The original CV won't change.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label>Label</Label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Backend role @ Acme" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Target role</Label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Job description (optional, for keyword matching)</Label>
              <Textarea rows={6} value={jdText} onChange={(e) => setJdText(e.target.value)} />
            </div>

            <KeywordScoreCard jdText={jdText} sections={currentSections} />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={creating}>
                {creating ? "Creating…" : "Create version"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="h-4 w-4" />
          <span>Loading…</span>
        </div>
      ) : versions.length === 0 && !showForm ? (
        <p className="text-muted-foreground">No tailored versions yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {versions.map((version) => (
            <Card key={version.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-normal">
                  <Link to={`/cv/${cvMaster.id}/versions/${version.id}`} className="hover:underline">
                    {version.label}
                  </Link>
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(version.id)}>
                  Delete
                </Button>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {version.target_role && <span>{version.target_role} · </span>}
                Created {new Date(version.created_at).toLocaleString()}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
