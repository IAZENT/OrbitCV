import { Spinner } from "@/components/ui/spinner";

export function LoadingPage() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="h-7 w-7 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}
