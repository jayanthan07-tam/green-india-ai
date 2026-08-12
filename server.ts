import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database for Authentication & Users
interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: "Citizen" | "Department Officer" | "Reviewer" | "Administrator" | "Super Administrator";
  department?: string;
  passwordHash: string; // Simulated hashed password
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  isMobileVerified: boolean;
  isEmailVerified: boolean;
  createdAt: string;
}

// Default Seed Users for testing and demonstration
const seedUsers: User[] = [
  {
    id: "user-1",
    fullName: "Ramesh Sharma",
    email: "citizen@greenindia.gov.in",
    mobile: "9876543210",
    role: "Citizen",
    passwordHash: "Citizen@123", // Simple plain check for demo
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
    passwordHash: "Officer@123",
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
    passwordHash: "Reviewer@123",
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
    passwordHash: "Admin@123",
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
    department: "National Green India AI Governance",
    passwordHash: "SuperAdmin@123",
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

const usersDatabase: User[] = [...seedUsers];

// Active sessions map (Token -> { userId, expiresAt })
interface Session {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  rememberMe: boolean;
}

const activeSessions = new Map<string, Session>();

// Persistent OTP Database Model
interface OTPRecord {
  id: string;
  target: string; // Mobile phone number or email
  code: string;   // Real 6-digit verification code
  createdAt: string;
  expiresAt: number;
  isVerified: boolean;
}

// In-Memory Database Table for active OTPs and Audit Logs
const activeOTPs = new Map<string, { code: string; expiresAt: number }>();
const otpDatabaseRecords: OTPRecord[] = [];

// Helper to generate token
function generateToken(): string {
  return "gia_token_" + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// ------------------- API ROUTES -------------------

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Green India AI Auth Server" });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { identifier, password, rememberMe, isOtpLogin, otpCode } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: "Email or mobile number is required." });
  }

  // Find user by email or mobile number
  const user = usersDatabase.find(
    (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.mobile === identifier
  );

  if (isOtpLogin) {
    if (!user) {
      return res.status(401).json({ error: "Incorrect email/mobile number or password." });
    }
    const storedOtp = activeOTPs.get(user.mobile) || activeOTPs.get(user.email);
    if (!storedOtp || storedOtp.code !== otpCode || Date.now() > storedOtp.expiresAt) {
      return res.status(401).json({ error: "Invalid or expired OTP code." });
    }
    // Delete used OTP
    activeOTPs.delete(user.mobile);
    activeOTPs.delete(user.email);
  } else {
    // Normal password check
    if (!user || user.passwordHash !== password) {
      // Standard security requirement: Do not reveal which credential is incorrect
      return res.status(401).json({ error: "Incorrect email/mobile number or password." });
    }
  }

  // Generate Session
  const token = generateToken();
  const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000; // 30 days vs 2 hours
  const session: Session = {
    token,
    userId: user.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + duration,
    rememberMe: !!rememberMe,
  };

  activeSessions.set(token, session);

  const { passwordHash, ...userWithoutPassword } = user;
  return res.json({
    message: "Login successful",
    token,
    user: userWithoutPassword,
  });
});

// Send OTP to phone number / email and save to database
app.post("/api/auth/send-otp", (req, res) => {
  const { target } = req.body; // mobile number or email
  if (!target) {
    return res.status(400).json({ error: "Mobile number or email is required." });
  }

  // Generate real 6-digit random OTP code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  // Save in active map and append to database records
  activeOTPs.set(target, { code, expiresAt });

  const record: OTPRecord = {
    id: "otp-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
    target,
    code,
    createdAt: new Date().toISOString(),
    expiresAt,
    isVerified: false,
  };
  otpDatabaseRecords.push(record);

  console.log(`[REAL OTP GENERATED & STORED IN DB] Target: ${target} | Code: ${code} | Valid until: ${new Date(expiresAt).toLocaleTimeString()}`);

  return res.json({
    message: `Verification code generated and sent to ${target}.`,
    target,
    otpCode: code, // Sent in response for simulated SMS alert popup on client
    expiresInSeconds: 300,
  });
});

// Verify OTP against Database
app.post("/api/auth/verify-otp", (req, res) => {
  const { target, code } = req.body;
  if (!target || !code) {
    return res.status(400).json({ error: "Target mobile/email and OTP code are required." });
  }

  const storedOtp = activeOTPs.get(target);
  if (!storedOtp || Date.now() > storedOtp.expiresAt) {
    return res.status(400).json({ error: "Verification code has expired or is invalid. Please request a new code." });
  }

  // Check code match (or universal demo backup 123456)
  if (storedOtp.code !== code && code !== "123456") {
    return res.status(400).json({ error: "Incorrect verification code. Please check your SMS and try again." });
  }

  // Update record in database
  activeOTPs.delete(target);
  const dbRecord = otpDatabaseRecords.slice().reverse().find((r) => r.target === target && r.code === storedOtp.code);
  if (dbRecord) {
    dbRecord.isVerified = true;
  }

  // Mark user as verified if exists in database
  const user = usersDatabase.find((u) => u.mobile === target || u.email.toLowerCase() === target.toLowerCase());
  if (user) {
    user.isMobileVerified = true;
  }

  return res.json({ message: "Mobile number verified successfully in database." });
});

// Admin / Query OTPs Database endpoint
app.get("/api/auth/otps", (_req, res) => {
  return res.json({
    totalCount: otpDatabaseRecords.length,
    activeOtps: Array.from(activeOTPs.entries()).map(([target, data]) => ({
      target,
      code: data.code,
      expiresAt: new Date(data.expiresAt).toISOString(),
    })),
    history: otpDatabaseRecords.slice(-20),
  });
});

// Verify Email
app.post("/api/auth/verify-email", (req, res) => {
  const { email } = req.body;
  const user = usersDatabase.find((u) => u.email.toLowerCase() === email?.toLowerCase());
  if (user) {
    user.isEmailVerified = true;
  }
  return res.json({ message: "Email verified successfully." });
});

// Create Account / Register
app.post("/api/auth/register", (req, res) => {
  const {
    fullName,
    mobile,
    email,
    password,
    city,
    district,
    state,
    country,
    pincode,
  } = req.body;

  if (!fullName || !mobile || !email || !password) {
    return res.status(400).json({ error: "Please fill in all required personal information fields." });
  }

  // Check if email or mobile already registered
  const existingUser = usersDatabase.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() || u.mobile === mobile
  );
  if (existingUser) {
    return res.status(400).json({ error: "An account with this email or mobile number already exists." });
  }

  // Check password strength server side
  if (password.length < 8) {
    return res.status(400).json({ error: "Please create a stronger password." });
  }

  const newUser: User = {
    id: "user-" + (usersDatabase.length + 1),
    fullName,
    mobile,
    email,
    role: "Citizen", // Default registered user role
    passwordHash: password,
    city: city || "New Delhi",
    district: district || "Central Delhi",
    state: state || "Delhi",
    country: country || "India",
    pincode: pincode || "110001",
    isMobileVerified: false,
    isEmailVerified: false,
    createdAt: new Date().toISOString(),
  };

  usersDatabase.push(newUser);

  // Auto generate initial OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  activeOTPs.set(mobile, { code: otpCode, expiresAt: Date.now() + 5 * 60 * 1000 });
  console.log(`[AUTH DEBUG] Registration OTP generated for ${mobile}: ${otpCode}`);

  return res.json({
    message: "Registration successful. Please complete mobile OTP verification.",
    userId: newUser.id,
    mobile: newUser.mobile,
    email: newUser.email,
  });
});

// Forgot Password / Reset Password
app.post("/api/auth/reset-password", (req, res) => {
  const { identifier, newPassword, otpCode } = req.body;

  if (!identifier || !newPassword) {
    return res.status(400).json({ error: "Identifier and new password are required." });
  }

  const user = usersDatabase.find(
    (u) => u.email.toLowerCase() === identifier.toLowerCase() || u.mobile === identifier
  );

  if (!user) {
    return res.status(404).json({ error: "No account found matching the provided email or mobile number." });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: "Please create a stronger password." });
  }

  // Update password
  user.passwordHash = newPassword;

  // Invalidate all old sessions for this user for security
  for (const [token, session] of activeSessions.entries()) {
    if (session.userId === user.id) {
      activeSessions.delete(token);
    }
  }

  return res.json({ message: "Password updated successfully. Please log in with your new password." });
});

// Get Current Auth Profile
app.get("/api/auth/me", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthenticated" });
  }

  const token = authHeader.split(" ")[1];
  const session = activeSessions.get(token);

  if (!session || Date.now() > session.expiresAt) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: "Your session has expired." });
  }

  const user = usersDatabase.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: "User account not found." });
  }

  const { passwordHash, ...userWithoutPassword } = user;
  return res.json({ user: userWithoutPassword });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    activeSessions.delete(token);
  }
  return res.json({ message: "Logged out successfully" });
});

// ------------------- VITE MIDDLEWARE & SERVER LISTEN -------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Green India AI server running on http://localhost:${PORT}`);
  });
}

startServer();
