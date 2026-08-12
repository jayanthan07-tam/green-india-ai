import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { DEMO_ACCOUNTS } from "../../data/mockData";
import { UserRole } from "../../types";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, navigate } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Mode: "password" or "otp"
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [smsAlert, setSmsAlert] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Please enter your email or mobile number.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier, password, rememberMe, false);
    } catch (err: any) {
      setErrorMessage("Incorrect email/mobile number or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setErrorMessage("Please enter your mobile number or email first.");
      return;
    }
    setErrorMessage("");
    setSmsAlert(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: identifier }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOtpSent(true);
      if (data.otpCode) {
        setSmsAlert(`📱 SMS Alert (${data.target}): Your Green India AI Security OTP is ${data.otpCode}. (Stored in Server DB)`);
        setOtpCode(data.otpCode);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not send verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode.trim()) {
      setErrorMessage("Please enter the 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(identifier, undefined, rememberMe, true, otpCode);
    } catch (err: any) {
      setErrorMessage("Incorrect email/mobile number or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      await quickDemoLogin(role);
    } catch (err) {
      setErrorMessage("Demo login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-between font-sans text-[#1A1A1A] overflow-x-hidden">
      {/* Top Brand Banner */}
      <div className="pt-8 pb-4 text-center px-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <span className="text-4xl">🌿</span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#064E3B]">GREEN INDIA AI</h1>
        </div>
        <p className="text-[#10B981] font-semibold tracking-wide uppercase text-xs sm:text-sm">
          “Don’t Just Close Complaints. PROVE THEY WERE SOLVED.”
        </p>
      </div>

      {/* Main Login Card Container */}
      <div className="w-[420px] max-w-[92vw] bg-white rounded-2xl shadow-[0_20px_50px_rgba(6,78,59,0.08)] border border-[#E5E7EB] p-6 sm:p-10 my-4 mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#064E3B]">Welcome Back</h2>
          <p className="text-gray-500 mt-1 text-sm">Sign in to continue to Green India AI.</p>
        </div>

        <div className="space-y-5">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-xs font-medium animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Real SMS Notification Toast */}
          {smsAlert && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start gap-3 text-[#064E3B] text-xs font-semibold shadow-xs animate-in fade-in duration-300">
              <Smartphone className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5 animate-bounce" />
              <div>{smsAlert}</div>
            </div>
          )}

          {loginMode === "password" ? (
            /* Standard Password Form */
            <form onSubmit={handlePasswordLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Email or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@gmail.com or +91 00000 00000"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all text-sm text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-all text-sm text-[#1A1A1A] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-[#064E3B] transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-semibold text-[#10B981] hover:text-[#064E3B] transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-green-900/10 cursor-pointer disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? "Authenticating..." : "Login"}
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400 font-medium">Or</span>
                </div>
              </div>

              {/* Login with OTP Button */}
              <button
                type="button"
                onClick={() => {
                  setLoginMode("otp");
                  setErrorMessage("");
                }}
                className="w-full bg-white border-2 border-[#10B981] text-[#10B981] hover:bg-green-50 font-bold py-3 rounded-lg transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                <span>Login with OTP</span>
              </button>
            </form>
          ) : (
            /* OTP Login Form */
            <form onSubmit={handleOtpLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Mobile Number or Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="name@gmail.com or +91 00000 00000"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSubmitting || !identifier}
                    className="px-4 py-3 bg-[#064E3B] hover:bg-[#043327] text-white text-xs font-bold rounded-lg transition-all"
                  >
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </div>

              {otpSent && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Enter 6-Digit OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full tracking-widest text-center text-lg font-bold py-3 bg-stone-50 border border-gray-200 rounded-lg text-stone-900 focus:border-[#10B981]"
                  />
                  <p className="text-[11px] text-gray-500 mt-1 text-center">
                    (Demo backup OTP: <code className="font-mono text-[#064E3B] font-bold">123456</code>)
                  </p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !otpSent}
                  className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg transition-all shadow-lg text-sm cursor-pointer disabled:opacity-50"
                >
                  Verify & Login
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginMode("password");
                    setErrorMessage("");
                  }}
                  className="w-full text-center text-xs font-bold text-gray-600 hover:text-[#064E3B] py-2 cursor-pointer"
                >
                  ← Back to Password Login
                </button>
              </div>
            </form>
          )}

          {/* Registration Link */}
          <div className="mt-6 text-center pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-[#10B981] font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Quick Demo Role Selector Panel */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#064E3B] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Quick Demo Role Login (1-Click Test)</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  onClick={() => handleDemoLogin(acc.role)}
                  className="bg-white hover:bg-[#064E3B] hover:text-white text-[#064E3B] font-semibold px-2.5 py-1.5 rounded-lg border border-emerald-200/80 shadow-2xs transition-all text-left flex items-center justify-between cursor-pointer"
                  title={acc.desc}
                >
                  <span className="truncate">{acc.role}</span>
                  <span className="text-[9px] opacity-70">➔</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Security Indicator Pill */}
      <div className="flex items-center space-x-2 text-gray-400 text-xs font-medium bg-white/70 px-4 py-2 rounded-full border border-gray-100 shadow-sm mx-auto my-3 w-fit">
        <span>🔐</span>
        <span className="uppercase tracking-widest text-[11px]">Secure Login Environment</span>
      </div>

      {/* Tricolor Bottom Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="h-full bg-[#064E3B] w-1/3"></div>
        <div className="h-full bg-[#10B981] w-1/3"></div>
        <div className="h-full bg-[#F59E0B] w-1/3"></div>
      </div>
    </div>
  );
};
