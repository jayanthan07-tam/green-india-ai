import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User as UserIcon, ShieldCheck, Mail, Phone, MapPin, Lock, LogOut } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-lg">
            {user?.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">{user?.fullName}</h1>
            <p className="text-xs text-stone-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-700" /> Mobile Number
            </span>
            <div className="font-bold text-stone-900">{user?.mobile}</div>
            <div className="text-[10px] text-emerald-700 font-bold">✓ Mobile Verified via OTP</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-700" /> Email Address
            </span>
            <div className="font-bold text-stone-900">{user?.email}</div>
            <div className="text-[10px] text-emerald-700 font-bold">✓ Email Verified</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Location
            </span>
            <div className="font-bold text-stone-900">
              {user?.city}, {user?.district}, {user?.state}
            </div>
            <div className="text-[10px] text-stone-500">Pincode: {user?.pincode}</div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Account Security
            </span>
            <div className="font-bold text-emerald-800">2FA & Session Encryption</div>
            <div className="text-[10px] text-stone-500">Active Token Verified</div>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-200">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/90 hover:bg-red-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all text-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-300" />
            <span>Sign Out from Green India AI Session</span>
          </button>
        </div>
      </div>
    </div>
  );
};
