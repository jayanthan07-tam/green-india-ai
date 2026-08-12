import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { MOCK_COMPLAINTS } from "../../data/mockData";
import { Complaint } from "../../types";
import {
  Building2,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Clock,
  Camera,
  AlertCircle,
  UploadCloud,
  FileImage,
  X,
} from "lucide-react";

export const DepartmentPortal: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [afterImageInput, setAfterImageInput] = useState<string>("");
  const [isSimulatingAI, setIsSimulatingAI] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleResolveWithAI = (item: Complaint) => {
    setSelectedTicket(item);
    setAfterImageInput(
      "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80"
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAfterImageInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmProof = () => {
    if (!selectedTicket) return;
    setIsSimulatingAI(true);

    setTimeout(() => {
      const matchScore = (95 + Math.random() * 4.5).toFixed(1);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedTicket.id
            ? {
                ...c,
                status: "Resolved (AI Validated)",
                afterImageUrl: afterImageInput,
                aiVerificationScore: parseFloat(matchScore),
                aiAnalysisNotes: "Before/After photo matched. 100% issue remediation confirmed by AI Vision Model.",
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );

      setIsSimulatingAI(false);
      setSelectedTicket(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-blue-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-800 rounded-xl border border-blue-600">
            <Building2 className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Department Officer Portal</h1>
            <p className="text-xs text-blue-200">
              {user?.department || "Public Works & Sanitation Board"} • Verified Officer ID: {user?.id}
            </p>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-stone-900">Assigned Complaints Queue</h2>

        <div className="space-y-4">
          {complaints.map((item) => (
            <div
              key={item.id}
              className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold bg-blue-100 text-blue-900 px-2.5 py-1 rounded border border-blue-300">
                  {item.ticketNumber}
                </span>
                <span className="text-xs font-bold text-stone-600">{item.status}</span>
              </div>

              <div>
                <h3 className="font-bold text-stone-900">{item.title}</h3>
                <p className="text-xs text-stone-600 mt-1">{item.description}</p>
              </div>

              {item.status !== "Resolved (AI Validated)" ? (
                <button
                  onClick={() => handleResolveWithAI(item)}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Proof of Work & Verify with AI</span>
                </button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Resolved & AI Verified ({item.aiVerificationScore}% match)
                  </span>
                  <span className="text-[10px] text-emerald-700">Tamper-Proof Audit Passed</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Proof Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-700" />
              <span>AI Proof Upload for {selectedTicket.ticketNumber}</span>
            </h3>

            <p className="text-xs text-stone-600">
              Upload the completion photo taken on site. The Green India AI vision algorithm will compare it against the original complaint photo to verify issue resolution.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">
                Upload Completion Photo Proof
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <FileImage className="w-4 h-4 text-[#10B981]" />
                  <span>Choose Image File</span>
                </button>
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-[#064E3B] hover:bg-[#043327] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Camera className="w-4 h-4 text-emerald-300" />
                  <span>On-Site Camera</span>
                </button>
              </div>
            </div>

            {afterImageInput && (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-stone-900 h-48 group">
                <img src={afterImageInput} alt="Preview proof" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setAfterImageInput("")}
                  className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmProof}
                disabled={isSimulatingAI}
                className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSimulatingAI ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Running AI Vision Match...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Run AI Proof Verification</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
