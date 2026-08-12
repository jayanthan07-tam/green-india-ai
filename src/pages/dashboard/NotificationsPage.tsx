import React from "react";
import { Bell, CheckCircle2, ShieldCheck, Clock } from "lucide-react";

export const NotificationsPage: React.FC = () => {
  const alerts = [
    {
      id: "n-1",
      title: "Complaint GIA-2026-8821 Resolved & AI Validated",
      desc: "Municipal Sanitation Board uploaded completion proof. AI Vision Match score: 98.4%. Ticket closed successfully.",
      time: "10 minutes ago",
      type: "success",
    },
    {
      id: "n-2",
      title: "Work Initiated on Ticket GIA-2026-8822",
      desc: "PWD Department Officer assigned on-site team for Bitumen road repair near Moolchand.",
      time: "1 hour ago",
      type: "info",
    },
    {
      id: "n-3",
      title: "Security Alert: Login Successful",
      desc: "Authenticated via Role-Based Access Control session protocol.",
      time: "Today at 10:02 AM",
      type: "security",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 pb-3">
          <Bell className="w-5 h-5 text-emerald-700" />
          <h1 className="text-xl font-bold text-stone-900">Real-Time Civic Alerts</h1>
        </div>

        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {a.title}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">{a.time}</span>
              </div>
              <p className="text-xs text-stone-600 pl-5">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
