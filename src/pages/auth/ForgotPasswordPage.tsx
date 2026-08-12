import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { checkPasswordStrength } from "../../utils/authUtils";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Phone,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

export const ForgotPasswordPage: React.FC = () => {
  const { navigate } = useAuth();

  // Steps: "identifier" | "otp" | "newPassword" | "completed"
  const [step, setStep] = useState<"identifier" | "otp" | "newPassword" | "completed">("identifier");

  const [identifier, setIdentifier] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [smsAlert, setSmsAlert] = useState<string | null>(null);

  const passwordInfo = checkPasswordStrength(newPassword);
  const isWeakPassword = passwordInfo.strength === "weak";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSmsAlert(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered email or mobile number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.otpCode) {
        setSmsAlert(`📱 SMS Alert (${identifier}): Your Green India AI reset OTP is ${data.otpCode}.`);
        setOtpCode(data.otpCode);
      }

      setStep("otp");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send reset verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode || otpCode.length < 6) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: identifier, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("newPassword");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid or expired verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (isWeakPassword) {
      setErrorMessage("Please create a stronger password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, newPassword, otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStep("completed");
    } catch (err: any) {
      setErrorMessage(err.message || "Password update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-sans text-[#1A1A1A] overflow-x-hidden">
      {/* Header Banner */}
      <div className="pt-8 pb-4 text-center px-4 max-w-xl mx-auto">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <span className="text-4xl">🌿</span>
          <h1 className="text-3xl font-bold tracking-tight text-[#064E3B]">GREEN INDIA AI</h1>
        </div>
        <p className="text-[#10B981] font-semibold tracking-wide uppercase text-xs sm:text-sm">
          Reset Password Security Gateway
        </p>
      </div>

      <div className="w-[420px] max-w-[92vw] mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(6,78,59,0.08)] border border-[#E5E7EB] my-4 overflow-hidden">
        <div className="bg-[#064E3B] p-5 text-white text-center">
          <h2 className="text-lg font-bold">Reset Your Password</h2>
          <p className="text-xs text-emerald-200 mt-0.5">
            Follow the verification steps to securely update your credentials.
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-800 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {step === "identifier" && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Registered Email or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="name@gmail.com or +91 00000 00000"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-sm cursor-pointer"
              >
                {isSubmitting ? "Sending OTP..." : "Send Verification OTP"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full text-center text-xs font-bold text-gray-600 hover:text-[#064E3B] py-1 cursor-pointer"
              >
                ← Return to Login
              </button>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center">
                <p className="text-xs text-gray-600">
                  Enter the 6-digit code sent to <strong className="text-gray-900">{identifier}</strong>.
                </p>
              </div>

              {smsAlert && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-[#064E3B] text-center shadow-2xs">
                  {smsAlert}
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full tracking-widest text-center text-xl font-bold py-3 bg-stone-50 border-2 border-[#10B981] rounded-lg text-stone-900 focus:outline-none"
              />
              <p className="text-[11px] text-gray-500 text-center">
                (Real database code active. Backup test code: <code className="font-mono text-[#064E3B] font-bold">123456</code>)
              </p>

              <button
                type="submit"
                disabled={isSubmitting || otpCode.length < 6}
                className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-sm cursor-pointer"
              >
                Verify Code
              </button>
            </form>
          )}

          {step === "newPassword" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Create New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-[#064E3B]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                />
              </div>

              {newPassword && (
                <div className="p-3 bg-stone-50 rounded-lg border border-gray-200 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Password Strength:</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] ${passwordInfo.color}`}>
                      {passwordInfo.label}
                    </span>
                  </div>
                  {isWeakPassword && (
                    <p className="text-red-600 text-[10px]">“Please create a stronger password.”</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isWeakPassword}
                className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-sm cursor-pointer"
              >
                Update Password & Invalidate Old Sessions
              </button>
            </form>
          )}

          {step === "completed" && (
            <div className="text-center space-y-5 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#064E3B]">Password Updated</h3>
              <p className="text-xs text-gray-600">
                Your password has been reset successfully. Old sessions have been invalidated.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-sm cursor-pointer"
              >
                Return to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tricolor Bottom Stripe */}
      <div className="h-1.5 w-full flex mt-6">
        <div className="h-full bg-[#064E3B] w-1/3"></div>
        <div className="h-full bg-[#10B981] w-1/3"></div>
        <div className="h-full bg-[#F59E0B] w-1/3"></div>
      </div>
    </div>
  );
};
