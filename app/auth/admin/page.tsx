"use client";

import { useState, useEffect, JSX } from "react";
import { useAuth } from "@/context/Auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Chrome } from "lucide-react";

interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export default function AdminAuthPage(): JSX.Element {
  const { user, loading } = useAuth() as {
    user: User | null;
    loading: boolean;
  };
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGoogleSignIn = (): void => {
    setIsLoading(true);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN" || user.role === "DEV") {
        router.push("/admin");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-3 text-slate-300">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Checking authentication...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-600 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Admin Portal
          </CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to access the administrative dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {user && user.role !== "ADMIN" && user.role !== "DEV" && (
            <Alert
              variant="destructive"
              className="bg-red-500/10 border-red-500/20"
            >
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-red-400">
                Access denied. You need admin privileges to access this area.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-100 transition-colors h-12 text-base font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Chrome className="mr-2 h-5 w-5" />
                Sign in with Google
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Only administrators and developers can access this area.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-500 text-center space-y-1">
              <p>Secure authentication powered by Google OAuth</p>
              <p>Role-based access control enabled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
