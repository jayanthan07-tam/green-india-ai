import { User } from "../types";

const TOKEN_KEY = "gia_auth_token";
const REMEMBER_KEY = "gia_remember_me";
const USER_KEY = "gia_user_profile";

const MOCK_USERS: User[] = [
  {
    id: "user-1",
    fullName: "Ramesh Sharma",
    email: "citizen@greenindia.gov.in",
    mobile: "9876543210",
    role: "Citizen",
    city: "New Delhi",
    district: "Central Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    fullName: "Anil Kumar (PWD)",
    email: "officer@greenindia.gov.in",
    mobile: "9876543211",
    role: "Department Officer",
    department: "Public Works Department (PWD)",
    city: "New Delhi",
    district: "New Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110002",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    fullName: "Priya Sundaram (Quality Control)",
    email: "reviewer@greenindia.gov.in",
    mobile: "9876543212",
    role: "Reviewer",
    department: "AI Proof Verification Bureau",
    city: "Bengaluru",
    district: "Bengaluru Urban",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-4",
    fullName: "Dr. Sunita Patel",
    email: "admin@greenindia.gov.in",
    mobile: "9876543213",
    role: "Administrator",
    department: "Ministry of Environment & Civic Tech",
    city: "New Delhi",
    district: "Central Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-5",
    fullName: "Vikramaditya Roy",
    email: "superadmin@greenindia.gov.in",
    mobile: "9876543214",
    role: "Super Administrator",
    department: "National Civic AI Oversight Board",
    city: "New Delhi",
    district: "Central Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  },
];

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

    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (data.token) {
        saveSession(data.token, data.user, rememberMe);
      }
      return { token: data.token, user: data.user };
    } else if (!response.ok && contentType && contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data.error || "Incorrect email/mobile number or password.");
    }
  } catch (err: any) {
    if (err.message && !err.message.includes("Unexpected token") && !err.message.includes("Failed to fetch")) {
      throw err;
    }
  }

  // Fallback for Static Host (GitHub Pages)
  const foundUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.mobile === identifier
  ) || {
    id: `user-${Date.now()}`,
    fullName: identifier.includes("@") ? identifier.split("@")[0] : "Civic User",
    email: identifier.includes("@") ? identifier : `${identifier}@greenindia.gov.in`,
    mobile: identifier.match(/^\d+$/) ? identifier : "9876543210",
    role: "Citizen" as const,
    city: "New Delhi",
    district: "Central Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    isMobileVerified: true,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  };

  const mockToken = `mock-jwt-token-${foundUser.id}-${Date.now()}`;
  saveSession(mockToken, foundUser, rememberMe);
  return { token: mockToken, user: foundUser };
}

export async function registerApi(formData: any): Promise<{ message: string; userId: string; mobile: string; email: string }> {
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {
    // Ignore static host fetch error
  }

  return {
    message: "Registration successful. Please enter verification code.",
    userId: `user-${Date.now()}`,
    mobile: formData.mobile,
    email: formData.email,
  };
}

export async function sendOtpApi(target: string): Promise<{ message: string }> {
  try {
    const response = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target }),
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {}

  return { message: `Verification code sent to ${target}` };
}

export async function verifyOtpApi(target: string, code: string): Promise<{ message: string }> {
  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target, code }),
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {}

  return { message: "Verification successful!" };
}

export async function verifyEmailApi(email: string): Promise<{ message: string }> {
  try {
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {}

  return { message: "Email verified successfully!" };
}

export async function resetPasswordApi(identifier: string, newPassword: string, otpCode?: string): Promise<{ message: string }> {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, newPassword, otpCode }),
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      return await response.json();
    }
  } catch (e) {}

  return { message: "Password updated successfully." };
}

export async function fetchCurrentUserApi(): Promise<User | null> {
  const token = getStoredToken();
  if (!token) return null;

  try {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const contentType = response.headers.get("content-type");
    if (response.ok && contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data.user;
    }
  } catch (e) {}

  // Static Host Fallback: retrieve stored user profile
  const storedUser = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {}
  }

  // Fallback default citizen demo profile
  return MOCK_USERS[0];
}

export async function logoutApi(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (e) {}
  }
  clearSessionToken();
}

function saveSession(token: string, user: User, rememberMe: boolean): void {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, "true");
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.removeItem(REMEMBER_KEY);
  }
}

export function clearSessionToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}
