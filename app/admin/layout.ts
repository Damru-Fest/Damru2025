"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If user is null (401 error) or doesn't have admin/dev role
      if (!user || (user.role !== "ADMIN" && user.role !== "DEV")) {
        router.push("/auth/admin");
      }
    }
  }, [user, loading, router]);

  // Show loading while auth is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  // If no user or wrong role, show nothing (redirect is happening)
  if (!user || (user.role !== "ADMIN" && user.role !== "DEV")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-300">Redirecting...</div>
      </div>
    );
  }

  // Only render children if user is authenticated and has correct role
  return <>{children}</>;
}
