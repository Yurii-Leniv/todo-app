"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as api from "./api";
import { User } from "./api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // True while the token is being checked on first page load — avoids
  // flashing "not logged in" for a moment to users who actually are.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = api.getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setUser(await api.getMe());
      } catch {
        api.clearToken();
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await api.login(email, password);
    api.setToken(access_token);
    setUser(await api.getMe());
  }

  async function signup(email: string, password: string) {
    const { access_token } = await api.signup(email, password);
    api.setToken(access_token);
    setUser(await api.getMe());
  }

  function logout() {
    api.clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
