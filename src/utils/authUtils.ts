import { PasswordStrength } from "../types";

export function checkPasswordStrength(password: string): {
  strength: PasswordStrength;
  label: string;
  color: string;
  percent: number;
} {
  if (!password) {
    return { strength: "weak", label: "🔴 Weak", color: "text-red-600 bg-red-100", percent: 0 };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length < 8 || score <= 2) {
    return { strength: "weak", label: "🔴 Weak", color: "text-red-600 bg-red-50 border-red-200", percent: 30 };
  } else if (score >= 3 && score <= 4) {
    return { strength: "good", label: "🟡 Good", color: "text-amber-600 bg-amber-50 border-amber-200", percent: 65 };
  } else {
    return { strength: "strong", label: "🟢 Strong", color: "text-emerald-700 bg-emerald-50 border-emerald-200", percent: 100 };
  }
}
