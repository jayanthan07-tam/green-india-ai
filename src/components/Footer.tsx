import React from "react";
import { ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#064E3B] text-emerald-100 border-t border-[#043327] pt-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <div className="font-bold text-white text-base tracking-wide">GREEN INDIA AI</div>
              <p className="text-xs text-[#10B981] font-semibold">
                “Don’t Just Close Complaints. PROVE THEY WERE SOLVED.”
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-[#043327]/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
              <Lock className="w-3.5 h-3.5 text-[#10B981]" />
              End-to-End Encrypted Auth
            </span>
            <span className="flex items-center gap-1.5 bg-[#043327]/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
              Role-Based Access Control
            </span>
            <span className="flex items-center gap-1.5 bg-[#043327]/80 px-2.5 py-1 rounded-md border border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              AI Proof Image Verification
            </span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80 gap-2">
          <p>© 2026 Green India AI Civic Governance Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>🔐 Secure Login Protocol</span>
            <span>•</span>
            <span>National AI Proof Standard</span>
          </p>
        </div>
      </div>

      {/* Tricolor Bottom Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="h-full bg-[#064E3B] w-1/3"></div>
        <div className="h-full bg-[#10B981] w-1/3"></div>
        <div className="h-full bg-[#F59E0B] w-1/3"></div>
      </div>
    </footer>
  );
};
