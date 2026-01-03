/// <reference types="vite/client" />
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  avatar: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>(undefined as any);

const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || "";
const ADMIN_DISCORD_ID = import.meta.env.VITE_ADMIN_DISCORD_ID || "";
const DISCORD_SCOPES = "identify email";

// Redirect URI will be set dynamically in AuthProvider
let DISCORD_REDIRECT_URI = "";

// Backend API URL - uses relative URLs on production (Vercel), localhost for local dev
const getApiBaseUrl = () => {
  // In development (localhost), use the local backend
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:3001";
  }
  // In production (Vercel), use relative URLs (same domain)
  return "";
};

const API_BASE_URL = getApiBaseUrl();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(true);

  // Initialize redirect URI on mount
  useEffect(() => {
    DISCORD_REDIRECT_URI = `${window.location.origin}/auth/callback`; 
    console.log("Discord Redirect URI:", DISCORD_REDIRECT_URI);
    console.log("API Base URL:", API_BASE_URL);
  }, []);

  // Check for auth callback and verify user
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...");
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          console.log("User authenticated:", userData);
        } else {
          console.log("Not authenticated (status:", response.status, ")");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check for auth callback code in URL
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    
    if (code) {
      console.log("Auth code found, exchanging for token...");
      handleAuthCallback(code);
    } else {
      checkAuth();
    }
  }, []);

  const handleAuthCallback = async (code: string) => {
  try {
    console.log("Sending auth code to backend.. .");
    const response = await fetch(`${API_BASE_URL}/api/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      credentials: "include",
    });

    if (response.ok) {
      const userData = await response.json();
      setUser(userData. user);  // ← Use userData.user from API response
      console.log("✓ Authentication successful:", userData);
      toast.success(`Welcome, ${userData.user?. username}!`);
      
      // Clean URL and redirect home
      window.location.href = '/';
    } else {
      console.error("Auth failed:", response.status);
      toast.error("Authentication failed. Please try again.");
      setTimeout(() => window.location.href = '/', 2000);
    }
  } catch (error) {
    console.error("Auth callback error:", error);
    toast.error("Something went wrong. Please try again.");
    setTimeout(() => window.location.href = '/', 2000);
  } finally {
    setIsLoading(false);
  }
};

  const login = () => {
    if (!DISCORD_CLIENT_ID) {
      toast.error("Discord Client ID not configured", {
        description: "Please add VITE_DISCORD_CLIENT_ID to your .env file. Check DISCORD_AUTH_SETUP.md for details.",
      });
      return;
    }

    const authUrl = new URL("https://discord.com/api/oauth2/authorize");
    authUrl.searchParams.set("client_id", DISCORD_CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", DISCORD_REDIRECT_URI);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", DISCORD_SCOPES);
    
    window.location.href = authUrl.toString();
  };

  const logout = async () => {
    try {
      console.log("Logging out...");
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      console.log("✓ Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAdmin: user?.id === ADMIN_DISCORD_ID,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
