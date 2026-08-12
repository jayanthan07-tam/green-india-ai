import React from "react";
import { useAuth } from "../../context/AuthContext";
import { DEPARTMENT_STATS, DEMO_ACCOUNTS } from "../../data/mockData";
import {
  ShieldCheck,
  Users,
  Building2,
  Activity,
  Lock,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export const AdminPortal: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-900 rounded-xl border border-amber-700">
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {user?.role === "Super Administrator" ? "National Super Admin Console" : "Administrator Governance Console"}
            </h1>
            <p className="text-xs text-amber-200">
              System Health • Role-Based Access Audit • Security Enforcement • {user?.fullName}
            </p>
          </div>
        </div>
      </div>

      {/* System Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">Total Verified Complaints</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">3,550</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">98.4% Resolution Speed</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">Active Department Officers</div>
          <div className="text-2xl font-extrabold text-blue-700 mt-1">128</div>
          <div className="text-[11px] text-blue-700 font-semibold mt-1">Across 14 Municipal Boards</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">AI Proof Accuracy</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">99.1%</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">0 False Resolutions</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">Active Auth Sessions</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">1,240</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Encrypted Sessions</div>
        </div>
      </div>

      {/* Department Leaderboard */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-700" />
          <span>Department Performance & Resolution Speed</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Department Name</th>
                <th className="p-3">Total Issues</th>
                <th className="p-3">Resolved</th>
                <th className="p-3">Pending</th>
                <th className="p-3">AI Proof Match Rate</th>
                <th className="p-3 rounded-r-xl">Avg SLA (Days)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {DEPARTMENT_STATS.map((dept) => (
                <tr key={dept.id} className="hover:bg-stone-50">
                  <td className="p-3 font-bold text-stone-900">{dept.name} ({dept.code})</td>
                  <td className="p-3 text-stone-700">{dept.totalComplaints}</td>
                  <td className="p-3 text-emerald-700 font-bold">{dept.resolvedComplaints}</td>
                  <td className="p-3 text-amber-700 font-bold">{dept.pendingComplaints}</td>
                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
                      {dept.aiProofRate}%
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-stone-800">{dept.avgResolutionDays} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Security Audit Logs */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-amber-700" />
          <span>Security & Role Audit Logs</span>
        </h2>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>User <strong className="text-stone-900">{user?.fullName}</strong> authenticated via Role-Based Access Control</span>
            </div>
            <span className="text-stone-500 font-mono">Just now</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>New Department Officer role assigned to <strong className="text-stone-900">Anil Kumar (PWD)</strong></span>
            </div>
            <span className="text-stone-500 font-mono">10 mins ago</span>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Password reset requested and old sessions invalidated for user <strong className="text-stone-900">Ramesh Sharma</strong></span>
            </div>
            <span className="text-stone-500 font-mono">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
