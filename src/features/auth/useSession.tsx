/* eslint-disable react/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { withTimeout } from "@/lib/withTimeout";

interface SessionContextType {
  session: Session | null;
  loading: boolean;
  error: string | null;
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  loading: true,
  error: null,
});

let globalSessionCache: Session | null = null;
let globalFetchDone = false;

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(globalSessionCache);
  const [loading, setLoading] = useState<boolean>(!globalFetchDone);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    withTimeout(supabase.auth.getSession(), 15000, "Session lookup")
      .then(({ data }) => {
        globalSessionCache = data.session;
        globalFetchDone = true;
        setSession(data.session);
      })
      .catch((err) => {
        globalFetchDone = true;
        setSession(null);
        setError(err instanceof Error ? err.message : "Failed to load session.");
      })
      .finally(() => setLoading(false));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      globalSessionCache = newSession;
      globalFetchDone = true;
      setSession(newSession);
      setError(null);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, loading, error }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
