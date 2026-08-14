import { Outlet } from "react-router-dom";
import { AppHeader } from "@/features/auth/AppHeader";
import { AppFooter } from "@/features/auth/AppFooter";

export function AppShell() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <AppFooter />
    </div>
  );
}
