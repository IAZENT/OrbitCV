import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSession } from "@/features/auth/useSession";
import { LoadingPage } from "@/components/loading-page";
import { getUserProfile } from "@/features/profile/api";
import { withTimeout } from "@/lib/withTimeout";

const PUBLIC_ROUTES = ["/onboarding", "/profile"];

export function ProtectedRoute() {
  const { session, loading } = useSession();
  const location = useLocation();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    if (!session?.user || loading) return;
    // Skip profile check for public routes
    if (PUBLIC_ROUTES.some((r) => location.pathname.startsWith(r))) {
      setHasProfile(true);
      return;
    }
    withTimeout(getUserProfile(session.user.id), 15000, "Profile lookup")
      .then((profile) => setHasProfile(!!profile))
      .catch(() => setHasProfile(false));
  }, [session?.user, loading, location.pathname]);

  if (loading || hasProfile === null) {
    return <LoadingPage />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // New user without profile, redirect to onboarding (unless already there)
  if (!hasProfile && !PUBLIC_ROUTES.some((r) => location.pathname.startsWith(r))) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
