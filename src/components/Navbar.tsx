import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Bell,
  MapPin,
  BarChart3,
  FileText,
  Menu,
  X,
  Sparkles,
  Building2,
  CheckCircle2,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, currentPath, navigate, getRoleDashboard } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated || !user) return null;

  const roleDashboard = getRoleDashboard(user.role);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Citizen":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Department Officer":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Reviewer":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Administrator":
      case "Super Administrator":
        return "bg-amber-100 text-amber-900 border-amber-300";
      default:
        return "bg-stone-100 text-stone-800 border-stone-300";
    }
  };

  const navItems = [
    { label: "Dashboard", path: roleDashboard, icon: BarChart3 },
    ...(user.role === "Citizen"
      ? [
          { label: "Report Issue", path: "/report", icon: FileText },
          { label: "Track Status", path: "/track", icon: ShieldCheck },
          { label: "Live Map", path: "/map", icon: MapPin },
          { label: "Analytics", path: "/analytics", icon: BarChart3 },
        ]
      : []),
    ...(user.role === "Department Officer"
      ? [
          { label: "Department Queue", path: "/department", icon: Building2 },
          { label: "Live Issue Map", path: "/map", icon: MapPin },
        ]
      : []),
    ...(user.role === "Reviewer"
      ? [
          { label: "Review Queue", path: "/review", icon: CheckCircle2 },
          { label: "AI Accuracy", path: "/analytics", icon: BarChart3 },
        ]
      : []),
    ...(user.role === "Administrator" || user.role === "Super Administrator"
      ? [
          { label: "Admin Console", path: "/admin", icon: ShieldCheck },
          { label: "Departments", path: "/department", icon: Building2 },
          { label: "City Analytics", path: "/analytics", icon: BarChart3 },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#064E3B] text-white shadow-md border-b border-[#043327]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => navigate(roleDashboard)}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-[#10B981] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl">🌿</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-lg tracking-wide text-white">
                GREEN INDIA <span className="text-[#10B981] font-black">AI</span>
              </div>
              <p className="text-[10px] text-emerald-200/90 -mt-0.5 tracking-wider uppercase font-semibold">
                Proof-Verified Civic Platform
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-inner"
                      : "text-emerald-100/80 hover:bg-emerald-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 text-emerald-200 hover:text-white hover:bg-emerald-900 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            <div
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2.5 bg-emerald-900/70 hover:bg-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-800/80 cursor-pointer transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                {user.fullName.charAt(0)}
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                  {user.fullName}
                </div>
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold border ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-medium bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/60 px-3 py-2 rounded-lg transition-colors"
              title="Logout from session"
            >
              <LogOut className="w-4 h-4 text-red-300" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-emerald-200 hover:bg-emerald-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 border-b border-emerald-800 px-4 pt-2 pb-4 space-y-2">
          <div className="flex items-center gap-3 p-3 bg-emerald-950 rounded-xl mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{user.fullName}</div>
              <div className="text-xs text-emerald-300">{user.email}</div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>
          </div>

          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-emerald-100 hover:bg-emerald-800 text-left"
            >
              <item.icon className="w-4 h-4 text-emerald-400" />
              {item.label}
            </button>
          ))}

          <button
            onClick={() => {
              navigate("/profile");
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-emerald-100 hover:bg-emerald-800 text-left"
          >
            <UserIcon className="w-4 h-4 text-emerald-400" />
            My Profile
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-200 bg-red-950/60 hover:bg-red-900 text-left mt-2"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Sign Out Securely
          </button>
        </div>
      )}
    </header>
  );
};
