import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "@/features/auth/useSession";

export function ProtectedRoute() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
