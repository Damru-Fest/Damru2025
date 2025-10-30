"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "@/lib/axios";

interface User {
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  app: boolean;
  logout: () => Promise<boolean>;
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(false);

  const getMe = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data.data.user) {
        setUser(response.data.data.user);
      }
      return true;
    } catch (err) {
      console.log("caught");
      setUser(null);
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setApp(false);
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
      setApp(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getMe();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setLoading,
        app,
        logout,
        refreshAuth: getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
