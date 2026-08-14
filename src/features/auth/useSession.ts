import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/lib/withTimeout";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withTimeout(supabase.auth.getSession(), 15000, "Session lookup")
      .then(({ data }) => {
        setSession(data.session);
      })
      .catch((err) => {
        // A stalled or failed session lookup should never leave the app
        // stuck on a loading screen forever, fall through to signed-out.
        setSession(null);
        setError(err instanceof Error ? err.message : "Failed to load session.");
      })
      .finally(() => setLoading(false));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setError(null);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { session, loading, error };
}
