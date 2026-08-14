import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { DashboardPage } from "@/features/cv-builder/DashboardPage";
import { CvEditPage } from "@/features/cv-builder/CvEditPage";
import { CvVersionEditPage } from "@/features/cv-builder/CvVersionEditPage";
import { JobSearchPage } from "@/features/job-search/JobSearchPage";
import { GuidancePage } from "@/features/guidance/GuidancePage";
import { SettingsPage } from "@/features/settings/SettingsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/cv/:id" element={<CvEditPage />} />
        <Route path="/cv/:id/versions/:versionId" element={<CvVersionEditPage />} />
        <Route path="/jobs" element={<JobSearchPage />} />
        <Route path="/guide" element={<GuidancePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
