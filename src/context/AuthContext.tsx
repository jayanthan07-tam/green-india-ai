import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, User, UserRole } from "../types";
import { fetchCurrentUserApi, loginApi, logoutApi, clearSessionToken, getStoredToken } from "../services/api";

interface AuthContextType extends AuthState {
  login: (identifier: string, password?: string, rememberMe?: boolean, isOtpLogin?: boolean, otpCode?: string) => Promise<User>;
  quickDemoLogin: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  currentPath: string;
  navigate: (path: string) => void;
  getRoleDashboard: (role: UserRole) => string;
  dismissSessionExpired: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || "/login");

  // Synchronize router location path
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRoleDashboard = (role: UserRole): string => {
    switch (role) {
      case "Citizen":
        return "/dashboard";
      case "Department Officer":
        return "/department";
      case "Reviewer":
        return "/review";
      case "Administrator":
      case "Super Administrator":
        return "/admin";
      default:
        return "/dashboard";
    }
  };

  // Verify auth session on initial load
  useEffect(() => {
    async function checkAuth() {
      setIsLoading(true);
      const storedToken = getStoredToken();
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await fetchCurrentUserApi();
        if (profile) {
          setUser(profile);
          setToken(storedToken);
        } else {
          setUser(null);
          setToken(null);
          setSessionExpired(true);
        }
      } catch (err) {
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // Enforce FIRST PAGE & PROTECTED ROUTE RULES
  useEffect(() => {
    if (isLoading) return;

    const publicRoutes = ["/login", "/register", "/forgot-password", "/verify-otp", "/verify-email"];
    const isPublic = publicRoutes.some((route) => currentPath.startsWith(route));

    // Rule: First page when unauthenticated MUST be /login
    if (!user && !isPublic) {
      navigate("/login");
    }
  }, [user, currentPath, isLoading]);

  const login = async (
    identifier: string,
    password?: string,
    rememberMe: boolean = false,
    isOtpLogin: boolean = false,
    otpCode?: string
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const { token: newToken, user: authenticatedUser } = await loginApi(
        identifier,
        password,
        rememberMe,
        isOtpLogin,
        otpCode
      );
      setUser(authenticatedUser);
      setToken(newToken);
      setSessionExpired(false);

      // Redirect based on role
      const targetDashboard = getRoleDashboard(authenticatedUser.role);
      navigate(targetDashboard);

      return authenticatedUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: UserRole): Promise<User> => {
    let email = "citizen@greenindia.gov.in";
    let pass = "Citizen@123";

    if (role === "Department Officer") {
      email = "officer@greenindia.gov.in";
      pass = "Officer@123";
    } else if (role === "Reviewer") {
      email = "reviewer@greenindia.gov.in";
      pass = "Reviewer@123";
    } else if (role === "Administrator") {
      email = "admin@greenindia.gov.in";
      pass = "Admin@123";
    } else if (role === "Super Administrator") {
      email = "superadmin@greenindia.gov.in";
      pass = "SuperAdmin@123";
    }

    return await login(email, pass, true);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await logoutApi();
    clearSessionToken();
    setUser(null);
    setToken(null);
    setIsLoading(false);
    navigate("/login");
  };

  const dismissSessionExpired = () => {
    setSessionExpired(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        sessionExpired,
        login,
        quickDemoLogin,
        logout,
        currentPath,
        navigate,
        getRoleDashboard,
        dismissSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
