"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  login as apiLogin,
  logout as apiLogout,
  type LoginPayload,
} from "@/lib/api/auth";
import type { AdminUser } from "@/lib/types";

interface AuthState {
  user: AdminUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_STORAGE_KEY = "viveo_admin_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      const token = localStorage.getItem("viveo_admin_token");
      if (stored && token) {
        setState({ user: JSON.parse(stored), loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { user } = await apiLogin(payload);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    localStorage.removeItem(USER_STORAGE_KEY);
    setState({ user: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
