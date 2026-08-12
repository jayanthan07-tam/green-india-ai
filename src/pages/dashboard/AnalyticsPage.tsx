import React from "react";
import { DEPARTMENT_STATS } from "../../data/mockData";
import { BarChart3, TrendingUp, CheckCircle2, ShieldCheck } from "lucide-react";

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Green India AI Platform Analytics</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">Resolution speed, AI accuracy rates, and civic performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-emerald-900">Total Cases Resolved</div>
            <div className="text-3xl font-extrabold text-emerald-800 mt-2">3,350</div>
            <div className="text-xs text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +14% faster resolution this month
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-blue-900">AI Proof Match Rate</div>
            <div className="text-3xl font-extrabold text-blue-800 mt-2">98.9%</div>
            <div className="text-xs text-blue-700 mt-1 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Automated image validation
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
            <div className="text-xs font-bold text-purple-900">Avg Resolution SLA</div>
            <div className="text-3xl font-extrabold text-purple-800 mt-2">1.6 Days</div>
            <div className="text-xs text-purple-700 mt-1 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Target SLA &lt; 2.0 Days
            </div>
          </div>
        </div>

        {/* Detailed Department Table */}
        <div className="space-y-3">
          <h3 className="font-bold text-stone-900 text-sm">Department Performance Benchmark</h3>
          <div className="space-y-3">
            {DEPARTMENT_STATS.map((dept) => (
              <div key={dept.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-stone-900">{dept.name}</span>
                  <span className="text-emerald-700">{dept.aiProofRate}% AI Proof Rate</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${dept.aiProofRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
