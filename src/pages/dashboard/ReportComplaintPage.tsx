import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FilePlus,
  MapPin,
  Camera,
  CheckCircle2,
  UploadCloud,
  X,
  FileImage,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export const ReportComplaintPage: React.FC = () => {
  const { user, navigate } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Sanitation & Waste");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(`${user?.city || "New Delhi"}, ${user?.district || "Central Delhi"}`);

  // Image Upload States
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setUploadError("");
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload a valid image file (JPG, PNG, WEBP, HEIC).");
      return;
    }
    // Limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size should be less than 10 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!imagePreview) {
      setUploadError("Please upload a photo of the civic issue before submitting.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const ticketNum = "GIA-2026-" + Math.floor(1000 + Math.random() * 9000);
      setSubmittedTicket(ticketNum);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
        <div className="border-b border-stone-200 pb-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-[#064E3B] text-xs font-bold px-3 py-1 rounded-full mb-2">
            <FilePlus className="w-3.5 h-3.5" />
            <span>Civic Complaint Filing Protocol</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900">Report a Civic Issue</h1>
          <p className="text-xs text-stone-500 mt-1">
            Submit a live photo proof of the issue. Green India AI will assign the responsible municipal department automatically.
          </p>
        </div>

        {submittedTicket ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Complaint Registered Successfully</h2>
            <p className="text-xs text-stone-600">
              Your ticket number is <strong className="text-[#064E3B] font-mono text-sm">{submittedTicket}</strong>.
            </p>

            {imagePreview && (
              <div className="max-w-xs mx-auto border border-stone-200 rounded-xl overflow-hidden shadow-sm p-2 bg-stone-50">
                <p className="text-[10px] font-bold text-stone-500 mb-1">Attached Image Proof:</p>
                <img src={imagePreview} alt="Submitted proof" className="w-full h-32 object-cover rounded-lg" />
              </div>
            )}

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-[#064E3B] hover:bg-[#043327] text-white font-bold px-6 py-3 rounded-xl text-xs cursor-pointer shadow-md"
            >
              Go to Citizen Dashboard
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Issue Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-[#10B981] outline-none"
              >
                <option value="Sanitation & Waste">Sanitation & Waste</option>
                <option value="Potholes & Roads">Potholes & Roads</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Street Lighting">Street Lighting</option>
                <option value="Air & Environmental">Air & Environmental</option>
                <option value="Tree Plantation">Tree Plantation Drive Request</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Issue Title / Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Overflowing garbage dump near main park gate"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-[#10B981] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Detailed Description *</label>
              <textarea
                rows={3}
                required
                placeholder="Provide location details, duration of issue, severity..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-[#10B981] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Location Address *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs focus:ring-2 focus:ring-[#10B981] outline-none"
                />
              </div>
            </div>

            {/* Direct Image File Upload & Drag-and-Drop */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  Upload Photo (Before Issue Proof) *
                </label>
                <span className="text-[10px] text-stone-500 font-medium">Supports JPG, PNG, WEBP (Max 10MB)</span>
              </div>

              {uploadError && (
                <div className="mb-2 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Hidden Inputs for File Picker and Camera */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />

              {!imagePreview ? (
                /* Drag and Drop Zone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                    isDragging
                      ? "border-[#10B981] bg-emerald-50/80 scale-[1.01]"
                      : "border-stone-300 bg-stone-50 hover:bg-stone-100/80 hover:border-emerald-600"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#064E3B] flex items-center justify-center mx-auto mb-3 shadow-xs">
                    <UploadCloud className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">
                    Drag & Drop issue photo here, or <span className="text-[#10B981] underline">Browse File</span>
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Upload an authentic image taken at the problem site
                  </p>

                  <div className="flex items-center justify-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-700 hover:bg-stone-50 shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileImage className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Choose Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-[#064E3B] text-white rounded-lg text-xs font-bold hover:bg-[#043327] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Capture Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Uploaded Image Preview Box */
                <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50 space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-stone-300 bg-black/5 h-52 group">
                    <img
                      src={imagePreview}
                      alt="Uploaded civic issue"
                      className="w-full h-full object-contain bg-stone-900/90"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileImage className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span className="font-bold text-stone-800 truncate">
                        {imageFile ? imageFile.name : "Uploaded_Issue_Photo.jpg"}
                      </span>
                      {imageFile && (
                        <span className="text-[10px] text-stone-500 font-mono">
                          ({(imageFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Generating AI Verification Ticket...</span>
                </>
              ) : (
                "Submit Complaint with Photo Proof"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

