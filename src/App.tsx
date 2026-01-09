import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { LandingPage } from "./components/LandingPage";
import { DocumentsPage } from "./components/DocumentsPage";
import { ThemeWarmPage } from "./components/ThemeWarmPage";
import { ThemeMonoPage } from "./components/ThemeMonoPage";
import { ThemeOceanPage } from "./components/ThemeOceanPage";
import { ApplicationsPage } from "./components/ApplicationsPage";
import { AdminDashboard } from "./components/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { Card } from "./components/ui/card";
import { Footer } from "./components/ui/footer";
import { AppShell } from "./components/AppShell";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<
    | "home"
    | "documents"
    | "applications"
    | "admin"
    | "theme-warm"
    | "theme-mono"
    | "theme-ocean"
  >("home");
  const { isAuthenticated, isAdmin } = useAuth();

  // Redirect to home if trying to access applications without authentication
  if (currentPage === "applications" && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500/20 via-cyan-500/20 to-purple-600/20 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjUwJSIgY3k9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmNjY2NiIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwZGRkZCIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2NjAwZmYiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50"></div>
        <div className="relative z-10">
          <Navigation currentPage="home" onNavigate={setCurrentPage} />
          <div className="max-w-4xl mx-auto px-8 py-20">
            <Card className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">You must be logged in with Discord to access the applications section.</p>
              <p className="text-sm text-muted-foreground">Please click the Login button in the navigation bar to continue.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to home if trying to access admin without being admin
  if (currentPage === "admin" && !isAdmin) {
    setCurrentPage("home");
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500/20 via-cyan-500/20 to-purple-600/20 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYSIgY3g9IjUwJSIgY3k9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmNjY2NiIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iIzAwZGRkZCIgc3RvcC1vcGFjaXR5PSIwLjEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM2NjAwZmYiIHN0b3Atb3BhY2l0eT0iMC4xIi8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50"></div>
        <div className="relative z-10">
          <Navigation currentPage="home" onNavigate={setCurrentPage} />
          <div className="max-w-4xl mx-auto px-8 py-20">
            <Card className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">You do not have permission to access the admin panel.</p>
              <p className="text-sm text-muted-foreground">Only authorized administrators can access this section.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      {currentPage === "home" ? (
        <LandingPage onNavigateToDocuments={() => setCurrentPage("documents")} />
      ) : currentPage === "documents" ? (
        <DocumentsPage />
      ) : currentPage === "applications" ? (
        <ApplicationsPage />
      ) : currentPage === "theme-warm" ? (
        <ThemeWarmPage />
      ) : currentPage === "theme-mono" ? (
        <ThemeMonoPage />
      ) : currentPage === "theme-ocean" ? (
        <ThemeOceanPage />
      ) : (
        <AdminDashboard />
      )}
      <Footer />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}