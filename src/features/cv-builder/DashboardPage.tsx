import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { createCvMaster, deleteCvMaster, listCvMasters, listCvVersions } from "@/features/cv-builder/api";
import { getUserProfile } from "@/features/profile/api";
import { scoreAts } from "@/features/cv-builder/ats-score/atsScore";
import { getRegionProfile } from "@/features/region-profiles/profiles";
import { normalizeSections, type CvMaster, type CvVersion } from "@/features/cv-builder/types";
import type { UserProfile } from "@/features/profile/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, FileText, Sparkles, ChevronDown, ChevronRight } from "lucide-react";

interface CvCardData {
  cv: CvMaster;
  atsScore: number;
  atsGrade: string;
  versions: CvVersion[];
  regionLabel: string;
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "bg-primary/15 text-primary";
    case "B": return "bg-primary/10 text-primary";
    case "C": return "bg-muted text-muted-foreground";
    case "D": return "bg-destructive/10 text-destructive";
    case "F": return "bg-destructive/15 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

export function DashboardPage() {
  const { session } = useSession();
  const [cards, setCards] = useState<CvCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [expandedCvs, setExpandedCvs] = useState<Set<string>>(new Set());

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const cvs = await listCvMasters();
      const cardData: CvCardData[] = await Promise.all(
        cvs.map(async (cv) => {
          const sections = normalizeSections(cv.sections);
          const { score, grade } = scoreAts(sections);
          const profile = getRegionProfile(cv.region_profile);
          let versions: CvVersion[] = [];
          try {
            versions = await listCvVersions(cv.id);
          } catch { /* ignore */ }
          return {
            cv,
            atsScore: score,
            atsGrade: grade,
            versions,
            regionLabel: profile.label,
          };
        }),
      );
      setCards(cardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CVs.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!session) return;
    setCreating(true);
    setError(null);
    try {
      const profile: UserProfile | null = await getUserProfile(session.user.id);
      await createCvMaster("Untitled CV", session.user.id, profile);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create CV.");
    } finally {
      setCreating(false);
    }
  }

  function toggleExpand(cvId: string) {
    setExpandedCvs((prev) => {
      const next = new Set(prev);
      if (next.has(cvId)) next.delete(cvId);
      else next.add(cvId);
      return next;
    });
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteCvMaster(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete CV.");
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">Your CVs</h1>
          <p className="mt-1 text-muted-foreground">
            Build one master CV, tailor it for every role.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          {creating ? "Creating…" : "New CV"}
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-destructive">
          {error}
          {error.includes("schema cache") && " (has the database migration been run yet?)"}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Spinner className="h-4 w-4" />
          <span>Loading…</span>
        </div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-16 text-center">
          <FileText className="mb-3 size-10 text-muted-foreground/50" />
          <h2 className="mb-1 text-lg">No CVs yet</h2>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Create your first CV and we'll pre-fill it from your profile. Then tailor it for any job.
          </p>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Creating…" : "Create your first CV"}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ cv, atsScore, atsGrade, versions, regionLabel }) => {
            const isExpanded = expandedCvs.has(cv.id);
            return (
              <div
                key={cv.id}
                className="group flex flex-col rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
              >
                {/* Header with ATS badge */}
                <div className="flex items-start justify-between px-5 pt-5 pb-3">
                  <Link
                    to={`/cv/${cv.id}`}
                    className="text-lg font-medium text-foreground hover:underline"
                  >
                    {cv.name}
                  </Link>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${gradeColor(atsGrade)}`}>
                    ATS {atsScore}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 px-5 text-xs text-muted-foreground">
                  <span className="rounded-md bg-secondary px-2 py-0.5">{regionLabel}</span>
                  {versions.length > 0 && (
                    <button
                      onClick={() => toggleExpand(cv.id)}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
                      <Sparkles className="size-3" />
                      {versions.length} version{versions.length !== 1 ? "s" : ""}
                    </button>
                  )}
                </div>

                {/* Expanded versions list */}
                {isExpanded && versions.length > 0 && (
                  <div className="mx-5 mb-3 mt-2 flex flex-col gap-1 rounded-md bg-muted/50 p-2">
                    {versions.map((v) => (
                      <Link
                        key={v.id}
                        to={`/cv/${cv.id}/versions/${v.id}`}
                        className="flex items-center justify-between rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <span className="truncate">{v.label || v.target_role || "Untitled"}</span>
                        {v.target_role && (
                          <span className="ml-2 shrink-0 text-muted-foreground/60">{v.target_role}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                  <span>Updated {new Date(cv.updated_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDelete(cv.id)}
                    className="rounded p-1 text-muted-foreground/50 transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Delete ${cv.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
