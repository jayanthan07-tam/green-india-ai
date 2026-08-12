import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { MOCK_COMPLAINTS } from "../../data/mockData";
import { Complaint } from "../../types";
import {
  PlusCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Filter,
  ShieldCheck,
  Search,
} from "lucide-react";

export const CitizenDashboard: React.FC = () => {
  const { user, navigate } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredComplaints = complaints.filter((cmp) => {
    const matchesCat = filterCategory === "All" || cmp.category === filterCategory;
    const matchesSearch =
      cmp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmp.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmp.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getStatusBadge = (status: Complaint["status"]) => {
    switch (status) {
      case "Resolved (AI Validated)":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Work In Progress":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Assigned to Department":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Pending Verification":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-stone-100 text-stone-800 border-stone-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-emerald-800/80 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-700/60 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Citizen Portal • {user?.district}, {user?.state}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="mt-2 text-sm text-emerald-100/90 leading-relaxed">
            Report civic issues in your neighborhood. Green India AI uses artificial intelligence to independently verify before & after proof images before closing tickets.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/report")}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report New Issue</span>
            </button>
            <button
              onClick={() => navigate("/map")}
              className="flex items-center gap-2 bg-emerald-900/80 hover:bg-emerald-900 text-white font-semibold px-4 py-2.5 rounded-xl border border-emerald-700 transition-all cursor-pointer text-sm"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>View Issue Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">Total Complaints Submitted</div>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{complaints.length}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">100% Tracked on Ledger</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">Resolved (AI Validated)</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {complaints.filter((c) => c.status === "Resolved (AI Validated)").length}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Avg 98.8% Match Score</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">In Progress</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {complaints.filter((c) => c.status === "Work In Progress" || c.status === "Assigned to Department").length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Assigned to Local PWD</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-stone-500 text-xs font-semibold">AI Proof Accuracy</div>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">99.4%</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Tamper-Proof Guarantee</div>
        </div>
      </div>

      {/* Complaint List Header & Filters */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-700" />
              <span>Civic Complaints & AI Resolutions</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Real-time tracking with proof images</p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search ticket, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No complaints found matching your search criteria.
            </div>
          ) : (
            filteredComplaints.map((item) => (
              <div
                key={item.id}
                className="bg-stone-50/80 hover:bg-stone-50 border border-stone-200 rounded-xl p-4 sm:p-5 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-md border border-emerald-200">
                      {item.ticketNumber}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">{item.category}</span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status === "Resolved (AI Validated)" && <ShieldCheck className="w-3.5 h-3.5" />}
                    {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Location & Department */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span>Dept: <strong className="text-stone-700">{item.assignedDepartment}</strong></span>
                </div>

                {/* Proof Images Section if available */}
                {(item.beforeImageUrl || item.afterImageUrl) && (
                  <div className="bg-white p-3 rounded-xl border border-stone-200 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {item.beforeImageUrl && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-stone-500 tracking-wider">
                          📸 BEFORE (Issue Reported)
                        </span>
                        <div className="h-36 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 relative">
                          <img
                            src={item.beforeImageUrl}
                            alt="Before complaint"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {item.afterImageUrl ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                            ✨ AFTER (Work Completed)
                          </span>
                          {item.aiVerificationScore && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                              AI Match: {item.aiVerificationScore}%
                            </span>
                          )}
                        </div>
                        <div className="h-36 rounded-lg overflow-hidden border border-emerald-300 bg-emerald-50 relative">
                          <img
                            src={item.afterImageUrl}
                            alt="After resolution"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 flex flex-col justify-center items-center bg-stone-50 border border-dashed border-stone-300 rounded-lg p-4 text-center">
                        <Clock className="w-6 h-6 text-amber-500 mb-1" />
                        <p className="text-xs font-semibold text-stone-700">Awaiting Completion Photo</p>
                        <p className="text-[10px] text-stone-500">Department team assigned on site</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
