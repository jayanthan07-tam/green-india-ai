import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { SessionExpiredModal } from "./components/SessionExpiredModal";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";

import { CitizenDashboard } from "./pages/dashboard/CitizenDashboard";
import { DepartmentPortal } from "./pages/dashboard/DepartmentPortal";
import { ReviewerPortal } from "./pages/dashboard/ReviewerPortal";
import { AdminPortal } from "./pages/dashboard/AdminPortal";
import { ReportComplaintPage } from "./pages/dashboard/ReportComplaintPage";
import { LiveMapPage } from "./pages/dashboard/LiveMapPage";
import { AnalyticsPage } from "./pages/dashboard/AnalyticsPage";
import { ProfilePage } from "./pages/dashboard/ProfilePage";
import { NotificationsPage } from "./pages/dashboard/NotificationsPage";

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, currentPath } = useAuth();

  // Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(6,78,59,0.08)] border border-[#E5E7EB] text-center space-y-4 max-w-sm w-full">
          <div className="w-16 h-16 bg-[#064E3B] text-[#10B981] rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-md animate-pulse">
            🌿
          </div>
          <div className="font-extrabold text-[#064E3B] text-lg tracking-wide">
            GREEN INDIA <span className="text-[#10B981]">AI</span>
          </div>
          <p className="text-xs text-stone-500">Verifying session security credentials...</p>
        </div>
      </div>
    );
  }

  // Public Unauthenticated Pages
  if (!isAuthenticated || !user) {
    if (currentPath.startsWith("/register")) {
      return <RegisterPage />;
    }
    if (currentPath.startsWith("/forgot-password")) {
      return <ForgotPasswordPage />;
    }
    // Default fallback for ALL unauthenticated access (including /, /dashboard, etc.)
    return <LoginPage />;
  }

  // Render Protected Dashboard Pages with Navbar and Footer
  const renderDashboardView = () => {
    switch (currentPath) {
      case "/dashboard":
      case "/track":
        return <CitizenDashboard />;
      case "/department":
        return <DepartmentPortal />;
      case "/review":
        return <ReviewerPortal />;
      case "/admin":
        return <AdminPortal />;
      case "/report":
        return <ReportComplaintPage />;
      case "/map":
        return <LiveMapPage />;
      case "/analytics":
        return <AnalyticsPage />;
      case "/profile":
        return <ProfilePage />;
      case "/notifications":
        return <NotificationsPage />;
      default:
        // Redirect based on role if route unknown
        if (user.role === "Citizen") return <CitizenDashboard />;
        if (user.role === "Department Officer") return <DepartmentPortal />;
        if (user.role === "Reviewer") return <ReviewerPortal />;
        return <AdminPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col font-sans text-[#1A1A1A] selection:bg-emerald-200">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboardView()}
      </main>
      <Footer />
      <SessionExpiredModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Analytics />
    </AuthProvider>
  );
}
