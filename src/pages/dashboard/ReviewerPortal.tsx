import React from "react";
import { useAuth } from "../../context/AuthContext";
import { MOCK_COMPLAINTS } from "../../data/mockData";
import { CheckCircle2, ShieldCheck, FileCheck, XCircle } from "lucide-react";

export const ReviewerPortal: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-950 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-purple-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-800 rounded-xl border border-purple-600">
            <FileCheck className="w-6 h-6 text-purple-200" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold">Quality Control & Reviewer Bureau</h1>
            <p className="text-xs text-purple-200">
              Audit AI proof verification accuracy & department resolutions • Reviewer: {user?.fullName}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900">AI Confidence Audit Queue</h2>

        <div className="space-y-4">
          {MOCK_COMPLAINTS.map((item) => (
            <div key={item.id} className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-900 bg-purple-100 px-2.5 py-1 rounded border border-purple-300">
                  {item.ticketNumber}
                </span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded border border-emerald-300">
                  AI Match Score: {item.aiVerificationScore || 98.4}%
                </span>
              </div>

              <div>
                <h3 className="font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600 mt-1">{item.aiAnalysisNotes || "Automated Before/After photo comparison passed WCAG & Civic Proof criteria."}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Resolution & Archive</span>
                </button>
                <button className="flex items-center gap-1.5 bg-stone-200 hover:bg-red-100 text-stone-700 hover:text-red-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer">
                  <XCircle className="w-4 h-4" />
                  <span>Flag for Re-Inspection</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
