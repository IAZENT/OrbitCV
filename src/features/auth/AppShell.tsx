import type { ReactNode } from "react";
import { AppHeader } from "@/features/auth/AppHeader";
import { AppFooter } from "@/features/auth/AppFooter";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <div className="flex-1">{children}</div>
      <AppFooter />
    </div>
  );
}
