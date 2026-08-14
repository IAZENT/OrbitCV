import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/error-boundary";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { DashboardPage } from "@/features/cv-builder/DashboardPage";
import { CvEditPage } from "@/features/cv-builder/CvEditPage";
import { CvVersionEditPage } from "@/features/cv-builder/CvVersionEditPage";
import { JobSearchPage } from "@/features/job-search/JobSearchPage";
import { GuidancePage } from "@/features/guidance/GuidancePage";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { LandingPage } from "@/features/landing/LandingPage";
import { OnboardingWizard } from "@/features/profile/OnboardingWizard";
import { ProfilePage } from "@/features/profile/ProfilePage";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/onboarding" element={<OnboardingWizard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cv/:id" element={<CvEditPage />} />
          <Route path="/cv/:id/versions/:versionId" element={<CvVersionEditPage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/guide" element={<GuidancePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
