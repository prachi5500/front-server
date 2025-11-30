import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/services/api";

type AuthUser = {
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
  signOut: () => Promise<void>;
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
        const res = await apiFetch("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
        localStorage.setItem("token", res.token);
        const u = res.user as AuthUser;
setUser(u);
setProfile(u);

        return { error: null };
      } catch (e: any) {
        return { error: e.message ?? "Login failed" };
      }
    },
    signOut: async () => {
      localStorage.removeItem("token");
      setUser(null);
      setProfile(null);
    },
  }), [user, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
