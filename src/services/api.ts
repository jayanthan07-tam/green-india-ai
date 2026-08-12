import { User, AuthState } from "../types";

const TOKEN_KEY = "gia_auth_token";
const REMEMBER_KEY = "gia_remember_me";

export async function loginApi(
  identifier: string,
  password?: string,
  rememberMe: boolean = false,
  isOtpLogin: boolean = false,
  otpCode?: string
): Promise<{ token: string; user: User }> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password, rememberMe, isOtpLogin, otpCode }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Incorrect email/mobile number or password.");
    }

    if (data.token) {
      if (rememberMe) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(REMEMBER_KEY, "true");
      } else {
        sessionStorage.setItem(TOKEN_KEY, data.token);
        localStorage.removeItem(REMEMBER_KEY);
      }
    }

    return { token: data.token, user: data.user };
  } catch (err: any) {
    throw new Error(err.message || "Incorrect email/mobile number or password.");
  }
}

export async function registerApi(formData: any): Promise<{ message: string; userId: string; mobile: string; email: string }> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Registration failed. Please try again.");
  }

  return data;
}

export async function sendOtpApi(target: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to send verification code.");
  }

  return data;
}

export async function verifyOtpApi(target: string, code: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target, code }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Invalid verification code.");
  }

  return data;
}

export async function verifyEmailApi(email: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/verify-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Email verification failed.");
  }

  return data;
}

export async function resetPasswordApi(identifier: string, newPassword: string, otpCode?: string): Promise<{ message: string }> {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, newPassword, otpCode }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Password reset failed.");
  }

  return data;
}

export async function fetchCurrentUserApi(): Promise<User | null> {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      clearSessionToken();
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

export async function logoutApi(): Promise<void> {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {
      // Ignore network errors on logout
    }
  }
  clearSessionToken();
}

export function clearSessionToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.getItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
