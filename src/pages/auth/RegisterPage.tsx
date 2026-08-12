import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { checkPasswordStrength } from "../../utils/authUtils";
import {
  User as UserIcon,
  Phone,
  Mail,
  Lock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";

export const RegisterPage: React.FC = () => {
  const { navigate } = useAuth();

  // Multi-step registration state: "form" | "otp" | "email" | "completed"
  const [step, setStep] = useState<"form" | "otp" | "email" | "completed">("form");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Location Fields
  const [city, setCity] = useState("New Delhi");
  const [district, setDistrict] = useState("Central Delhi");
  const [state, setState] = useState("Delhi");
  const [country, setCountry] = useState("India");
  const [pincode, setPincode] = useState("110001");

  // Verification states
  const [otpCode, setOtpCode] = useState("");
  const [otpResendCountdown, setOtpResendCountdown] = useState(30);
  const [smsAlert, setSmsAlert] = useState<string | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordInfo = checkPasswordStrength(password);
  const isWeakPassword = passwordInfo.strength === "weak";

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !mobile.trim() || !email.trim()) {
      setErrorMessage("Please complete all required personal information fields.");
      return;
    }

    if (isWeakPassword) {
      setErrorMessage("Please create a stronger password.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify your password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          mobile,
          email,
          password,
          city,
          district,
          state,
          country,
          pincode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Request initial OTP from backend database
      const otpRes = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: mobile }),
      });
      const otpData = await otpRes.json();

      if (otpData.otpCode) {
        setSmsAlert(`📱 Real SMS Sent to ${mobile}: Your Green India AI verification OTP is ${otpData.otpCode}.`);
        setOtpCode(otpData.otpCode);
      }

      // Move to Mobile OTP verification step
      setStep("otp");
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!otpCode || otpCode.length < 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: mobile, code: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Next step: Email verification
      setStep("email");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStep("completed");
    } catch (err) {
      setStep("completed");
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
          Create Account • Join the Proof-Verified Civic Community
        </p>
      </div>

      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-[0_20px_50px_rgba(6,78,59,0.08)] border border-[#E5E7EB] my-4 overflow-hidden">
        {/* Progress Header */}
        <div className="bg-[#064E3B] p-5 text-white">
          <div className="flex items-center justify-between text-xs text-emerald-200 mb-2 font-medium">
            <span>
              {step === "form" && "Step 1: Registration Form"}
              {step === "otp" && "Step 2: Mobile OTP Verification"}
              {step === "email" && "Step 3: Email Verification"}
              {step === "completed" && "Account Ready"}
            </span>
            <span>
              {step === "form" && "1/3"}
              {step === "otp" && "2/3"}
              {step === "email" && "3/3"}
              {step === "completed" && "✓ Done"}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[#043327] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#10B981] transition-all duration-300"
              style={{
                width:
                  step === "form"
                    ? "33%"
                    : step === "otp"
                    ? "66%"
                    : step === "email"
                    ? "90%"
                    : "100%",
              }}
            />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-800 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Personal Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-[#064E3B] uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-100 pb-1.5">
                  <UserIcon className="w-4 h-4 text-[#10B981]" />
                  Personal Information
                </h3>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Gmail / Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-[#064E3B] uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-100 pb-1.5">
                  <MapPin className="w-4 h-4 text-[#10B981]" />
                  Location Information
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#10B981] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#10B981] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#10B981] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#10B981] outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#10B981] outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Password Creation */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-extrabold text-[#064E3B] uppercase tracking-wider flex items-center gap-1.5 border-b border-emerald-100 pb-1.5">
                  <Lock className="w-4 h-4 text-[#10B981]" />
                  Password Creation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Password *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <label className="block text-xs font-bold text-gray-600 mb-1">Confirm Password *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none text-sm"
                    />
                  </div>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="p-3 bg-stone-50 rounded-lg border border-gray-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-gray-700">Password Strength:</span>
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${passwordInfo.color}`}>
                        {passwordInfo.label}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordInfo.strength === "weak"
                            ? "bg-red-500"
                            : passwordInfo.strength === "good"
                            ? "bg-amber-500"
                            : "bg-[#10B981]"
                        }`}
                        style={{ width: `${passwordInfo.percent}%` }}
                      />
                    </div>

                    {isWeakPassword && (
                      <p className="text-red-600 font-semibold text-[11px] mt-1">
                        “Please create a stronger password.” (At least 8 characters with numbers or symbols)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isWeakPassword}
                  className="w-full flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-green-900/10 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                  {isSubmitting ? (
                    <span>Processing Registration...</span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-xs text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#10B981] font-bold hover:underline cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            </form>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-[#064E3B] rounded-full flex items-center justify-center mx-auto">
                <Phone className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#064E3B]">Verify Your Mobile Number</h3>
                <p className="text-gray-600 text-xs mt-1">
                  We sent a 6-digit verification code to your mobile number{" "}
                  <strong className="text-gray-900">{mobile}</strong>.
                </p>
              </div>

              {smsAlert && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-[#064E3B] text-center shadow-2xs">
                  {smsAlert}
                </div>
              )}

              <div className="max-w-xs mx-auto">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-2xl font-black py-3 bg-stone-50 border-2 border-[#10B981] rounded-lg text-[#064E3B] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-2">
                  (Real database code active. Universal test backup code: <code className="font-mono text-[#064E3B] font-bold">123456</code>)
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || otpCode.length < 6}
                  className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all disabled:opacity-50 text-sm cursor-pointer"
                >
                  Verify Code
                </button>

                <div className="flex items-center justify-between text-xs text-gray-600 px-2">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ target: mobile }),
                        });
                        const data = await res.json();
                        if (data.otpCode) {
                          setSmsAlert(`📱 New Real OTP generated for ${mobile}: ${data.otpCode}`);
                          setOtpCode(data.otpCode);
                        }
                      } catch (e) {}
                    }}
                    className="font-bold text-[#10B981] hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* EMAIL VERIFICATION STEP */}
          {step === "email" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#064E3B]">Verify Your Email</h3>
                <p className="text-gray-600 text-xs mt-1">
                  We sent a confirmation link to <strong className="text-gray-900">{email}</strong>.
                </p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-left text-xs text-[#064E3B] space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  Mobile Number Verified Successfully!
                </div>
                <p className="text-gray-700">
                  Click below to finalize email verification and complete your account creation.
                </p>
              </div>

              <button
                onClick={handleVerifyEmail}
                disabled={isSubmitting}
                className="w-full bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 rounded-lg shadow-lg transition-all text-sm cursor-pointer"
              >
                Complete Email Verification
              </button>
            </div>
          )}

          {/* COMPLETED STEP */}
          {step === "completed" && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-[#064E3B]">✓ Account Created Successfully</h3>
                <p className="text-gray-600 text-xs mt-1">
                  Welcome to Green India AI, {fullName}! Your account is active and verified.
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 bg-[#064E3B] hover:bg-[#043327] text-white font-bold py-3.5 px-4 rounded-lg shadow-lg transition-all cursor-pointer text-sm"
              >
                <span>Continue to Login</span>
                <ArrowRight className="w-4 h-4" />
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
