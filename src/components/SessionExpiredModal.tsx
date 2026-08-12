import React from "react";
import { useAuth } from "../context/AuthContext";
import { AlertTriangle, LogIn } from "lucide-react";

export const SessionExpiredModal: React.FC = () => {
  const { sessionExpired, dismissSessionExpired } = useAuth();

  if (!sessionExpired) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-200 text-center animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">Session Expired</h3>
        <p className="text-stone-600 text-sm mb-6">
          Your secure Green India AI session has expired due to inactivity. Please log in again to continue.
        </p>
        <button
          onClick={dismissSessionExpired}
          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-900/20 transition-all cursor-pointer text-sm"
        >
          <LogIn className="w-4 h-4" />
          Login Again
        </button>
      </div>
    </div>
  );
};
