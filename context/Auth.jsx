"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [app, setApp] = useState(false);

  const getMe = async () => {
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

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setApp(false);
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails on server, clear local state
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

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
