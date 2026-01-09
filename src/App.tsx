import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LandingPage } from "./components/LandingPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { ThemeWarmPage } from "./components/ThemeWarmPage";
import { ThemeMonoPage } from "./components/ThemeMonoPage";
import { ThemeOceanPage } from "./components/ThemeOceanPage";
import { ApplicationsPage } from "./components/ApplicationsPage";
import { AdminDashboard } from "./components/AdminDashboard";
import DepartmentOfficialsPage from "./components/DepartmentOfficialsPage";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Footer } from "./components/ui/footer";
import { AppShell } from "./components/AppShell";


function AppContent() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage onNavigateToDocuments={() => { window.location.href = '/documents'; }} />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/theme-warm" element={<ThemeWarmPage />} />
        <Route path="/theme-mono" element={<ThemeMonoPage />} />
        <Route path="/theme-ocean" element={<ThemeOceanPage />} />
        <Route path="/department-officials" element={<DepartmentOfficialsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </AppShell>
  );
}


export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}