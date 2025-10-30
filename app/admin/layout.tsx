"use client";

import React, { JSX, ReactNode, useEffect } from "react";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || (user.role !== "ADMIN" && user.role !== "DEV")) {
        router.push("/auth/admin");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user || (user.role !== "ADMIN" && user.role !== "DEV")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}
