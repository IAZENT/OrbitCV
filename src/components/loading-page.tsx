import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <Spinner className="h-7 w-7 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading…</p>
        {slow && (
          <div className="flex flex-col items-center gap-2">
            <p className="max-w-xs text-sm text-muted-foreground">
              This is taking longer than usual. The connection may be slow to respond.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Reload the page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
