import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Filter,
  ArrowUpRight,
  Zap,
  Award,
} from "lucide-react";
import { DEPARTMENT_STATS } from "../../data/mockData";

const MONTHLY_TREND_DATA = [
  { month: "Jan", resolved: 420, aiMatch: 96.2, avgDays: 2.1 },
  { month: "Feb", resolved: 510, aiMatch: 97.0, avgDays: 1.9 },
  { month: "Mar", resolved: 640, aiMatch: 97.8, avgDays: 1.8 },
  { month: "Apr", resolved: 780, aiMatch: 98.2, avgDays: 1.7 },
  { month: "May", resolved: 920, aiMatch: 98.6, avgDays: 1.6 },
  { month: "Jun", resolved: 1080, aiMatch: 98.9, avgDays: 1.5 },
];

const CATEGORY_DISTRIBUTION = [
  { name: "Sanitation & Waste", count: 1340, color: "#10B981" },
  { name: "Potholes & Roads", count: 838, color: "#3B82F6" },
  { name: "Street Lighting", count: 502, color: "#F59E0B" },
  { name: "Greenery & Trees", count: 402, color: "#8B5CF6" },
  { name: "Water & Drainage", count: 268, color: "#EC4899" },
];

const CONFIDENCE_DISTRIBUTION = [
  { range: "95% - 100%", count: 2280, color: "#059669" },
  { range: "90% - 94%", count: 740, color: "#10B981" },
  { range: "80% - 89%", count: 230, color: "#F59E0B" },
  { range: "< 80% (Manual)", count: 100, color: "#EF4444" },
];

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "6m">("6m");
  const [selectedDept, setSelectedDept] = useState<string>("All");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-emerald-700" />
            </div>
            <span>Green India AI Analytics Hub</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time insights into resolution speed, AI image validation accuracy, and civic governance benchmarks.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setTimeRange("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === "7d" ? "bg-white text-emerald-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === "30d" ? "bg-white text-emerald-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange("6m")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === "6m" ? "bg-white text-emerald-900 shadow-xs" : "text-stone-600 hover:text-stone-900"
              }`}
            >
              6 Months
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="w-24 h-24 text-white" />
          </div>
          <div className="text-xs font-bold text-emerald-200">Total Cases Resolved</div>
          <div className="text-3xl font-black mt-2 tracking-tight">3,350</div>
          <div className="text-xs text-emerald-300 mt-2 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% faster vs last period</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-500">AI Match Accuracy</div>
          <div className="text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">98.9%</div>
          <div className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Automated visual proof verification</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-500">Avg Resolution SLA</div>
          <div className="text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">1.5 Days</div>
          <div className="text-xs text-purple-600 mt-2 flex items-center gap-1 font-semibold">
            <Zap className="w-3.5 h-3.5 text-purple-600" />
            <span>Target &lt; 2.0 Days (Exceeding SLA)</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="text-xs font-bold text-stone-500">Citizen Satisfaction</div>
          <div className="text-3xl font-extrabold text-stone-900 mt-2 tracking-tight">4.9 / 5.0</div>
          <div className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-semibold">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Based on 2,840 verified reviews</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resolution & AI Match Trend Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Monthly Complaint Resolution & AI Match Trend</h3>
              <p className="text-xs text-stone-500">Growth in resolved tickets vs AI visual match verification rate</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
              Live Data
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  }}
                />
                <Area type="monotone" dataKey="resolved" name="Resolved Complaints" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Pie Chart */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">Complaint Category Breakdown</h3>
            <p className="text-xs text-stone-500">Distribution by civic problem sector</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DISTRIBUTION} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {CATEGORY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legend */}
          <div className="space-y-1.5 pt-2">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-stone-700 font-medium">{cat.name}</span>
                </div>
                <span className="font-bold text-stone-900">{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department SLA & AI Verification Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department SLA Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Department AI Proof Match Rate (%)</h3>
              <p className="text-xs text-stone-500">Image validation score by civic utility department</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#4B5563" }} axisLine={false} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: "#4B5563" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                  }}
                />
                <Bar dataKey="aiProofRate" name="AI Match Rate %" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Match Confidence Score Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-bold text-stone-900 text-sm">AI Verification Confidence Score Ranges</h3>
            <p className="text-xs text-stone-500">Breakdown of before/after photo verification confidence levels</p>
          </div>

          <div className="space-y-4 pt-2">
            {CONFIDENCE_DISTRIBUTION.map((item) => {
              const total = 3350;
              const percentage = ((item.count / total) * 100).toFixed(1);
              return (
                <div key={item.range} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.range} Score</span>
                    </span>
                    <span className="text-stone-900">
                      {item.count} cases <span className="text-stone-500 font-normal">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
