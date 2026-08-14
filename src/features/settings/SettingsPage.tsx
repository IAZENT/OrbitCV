import { useEffect, useState } from "react";
import { AppShell } from "@/features/auth/AppShell";
import { useSession } from "@/features/auth/useSession";
import { getUserSettings, upsertUserSettings } from "@/features/settings/api";
import { encryptApiKey, decryptApiKey } from "@/features/settings/crypto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsPage() {
  const { session } = useSession();
  const [hasKey, setHasKey] = useState(false);
  const [lastFour, setLastFour] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;
    getUserSettings(session.user.id)
      .then((settings) => {
        setHasKey(!!settings.ai_key_encrypted);
        if (settings.ai_key_encrypted && settings.ai_key_iv) {
          decryptApiKey(settings.ai_key_encrypted, settings.ai_key_iv)
            .then((key) => setLastFour(key.slice(-4)))
            .catch(() => setLastFour("****"));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user]);

  async function handleSaveKey() {
    if (!keyInput || !session?.user) return;
    setSaving(true);
    setMessage(null);
    try {
      const { encrypted, iv } = await encryptApiKey(keyInput);
      await upsertUserSettings(session.user.id, {
        ai_key_encrypted: encrypted,
        ai_key_iv: iv,
        ai_key_provider: "gemini",
      });
      setHasKey(true);
      setLastFour(keyInput.slice(-4));
      setKeyInput("");
      setMessage("API key saved. It will be used directly from your browser to Google.");
    } catch {
      setMessage("Failed to save key. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveKey() {
    if (!session?.user) return;
    setSaving(true);
    setMessage(null);
    try {
      await upsertUserSettings(session.user.id, {
        ai_key_encrypted: null,
        ai_key_iv: null,
        ai_key_provider: null,
      });
      setHasKey(false);
      setLastFour("");
      setMessage("API key removed. You will use the shared quota (5/day).");
    } catch {
      setMessage("Failed to remove key.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <p className="p-6 text-muted-foreground">Loading...</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <h1 className="mb-6 text-3xl">Settings</h1>

        <section className="flex flex-col gap-6">
          <div>
            <h2 className="mb-2 text-xl">AI Tailoring</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Connect your own Gemini API key for unlimited AI tailoring, or use the shared quota (5
              requests per day).
            </p>

            {hasKey ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm">
                  Your key (****{lastFour}) is saved and encrypted. API calls go directly from your
                  browser to Google.
                </p>
                <div>
                  <Button variant="outline" onClick={handleRemoveKey} disabled={saving}>
                    {saving ? "Removing..." : "Remove key"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  No key set. You are using the shared quota (5 requests per day).
                </p>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="api-key">Gemini API key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      placeholder="Paste your Gemini API key"
                      className="max-w-md"
                    />
                    <Button onClick={handleSaveKey} disabled={!keyInput || saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get a free key at ai.google.dev. Your key is encrypted locally and never sent to
                    our server.
                  </p>
                </div>
              </div>
            )}

            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>
        </section>
      </main>
    </AppShell>
  );
}
