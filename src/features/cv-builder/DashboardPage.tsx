import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";
import { AppShell } from "@/features/auth/AppShell";
import { createCvMaster, deleteCvMaster, listCvMasters } from "@/features/cv-builder/api";
import type { CvMaster } from "@/features/cv-builder/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DashboardPage() {
  const { session } = useSession();
  const [cvs, setCvs] = useState<CvMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setCvs(await listCvMasters());
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
      await createCvMaster("Untitled CV", session.user.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create CV.");
    } finally {
      setCreating(false);
    }
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
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl">Your CVs</h1>
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
          <p className="text-muted-foreground">Loading…</p>
        ) : cvs.length === 0 ? (
          <p className="text-muted-foreground">
            No CVs yet. Create one to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cvs.map((cv) => (
              <Card key={cv.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <CardTitle className="text-lg font-normal">
                    <Link to={`/cv/${cv.id}`} className="hover:underline">
                      {cv.name}
                    </Link>
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(cv.id)}>
                    Delete
                  </Button>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Updated {new Date(cv.updated_at).toLocaleString()}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </AppShell>
  );
}
