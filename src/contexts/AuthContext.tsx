import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/services/api";

type AuthUser = {
  token: any;
  id: string;
  email: string | null;
  name?: string;
  phone?: string;
  role?: "user" | "admin";
};

type AuthContextType = {
  user: AuthUser | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  requestSignupOTP: (email: string, name: string, phone: string) => Promise<{ error: string | null }>;
  verifySignupOTP: (email: string, otp: string, password: string, name: string, phone: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: { name: string; phone: string }) => Promise<{ error: string | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const me = await apiFetch("/auth/me");
        const u = me.user as AuthUser;
        setUser(u);
        setProfile(u);
      } catch {
        // If token is invalid, clear it
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    profile,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const res = await apiFetch("/auth/login", { 
          method: "POST", 
          body: JSON.stringify({ email, password }) 
        });
        localStorage.setItem("token", res.token);
        const u = res.user as AuthUser;
        setUser(u);
        setProfile(u);
        return { error: null };
      } catch (e: any) {
        return { error: e.message ?? "Login failed" };
      }
    },
    
    requestSignupOTP: async (email: string, name: string, phone: string) => {
      try {
        await apiFetch("/auth/send-signup-otp", { 
          method: "POST", 
          body: JSON.stringify({ email, name, phone }) 
        });
        return { error: null };
      } catch (e: any) {
        return { error: e.message ?? "Failed to send OTP" };
      }
    },
    
    verifySignupOTP: async (email: string, otp: string, password: string, name: string, phone: string) => {
      try {
        const res = await apiFetch("/auth/verify-signup-otp", { 
          method: "POST", 
          body: JSON.stringify({ email, otp, password, name, phone }) 
        });
        localStorage.setItem("token", res.token);
        // mnjjkjk
        localStorage.setItem("user", JSON.stringify(res.user));
        // jnjkmkmk
        const u = res.user as AuthUser;
        setUser(u);
        setProfile(u);
        return { error: null };
      } catch (e: any) {
        return { error: e.message ?? "Verification failed" };
      }
    },
    
    updateProfile: async (profileData: { name: string; phone: string }): Promise<{ error: string | null }> => {
  try {
    const res = await apiFetch("/auth/update-profile", { 
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(profileData) 
    });
    
    if (!user) {
      return { error: "User not authenticated" };
    }
    
    // Update local user data
    const updatedUser = { ...user, ...res.user } as AuthUser;
    setUser(updatedUser);
    setProfile(updatedUser);
    
    // Update localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...currentUser, ...res.user }));
    
    return { error: null };
  } catch (e: any) {
    return { error: e.message ?? "Failed to update profile" };
  }
},
    
    signOut: async () => {
      try {
        await apiFetch("/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setProfile(null);
      }
    },
  }), [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};