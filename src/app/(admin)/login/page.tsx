"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (formData: FormData): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await login(formData);

      if (result?.status) {
        switch (result.status) {
          case 200:
            if (result.redirectTo) {
              window.location.href = result.redirectTo;
            }
            break;
          case 400:
            setError("No account found with this email. Please contact an administrator.");
            break;
          case 401:
            setError("Invalid email or password. Please try again.");
            break;
          case 500:
            setError(
              result.message || "Something went wrong. Please try again later.",
            );
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
        }
        return;
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        error.message === "NEXT_REDIRECT"
      ) {
        // Ignore redirect errors
        return;
      }
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Netpoleon</h1>
          <p className="text-muted-foreground">Admin Portal</p>
      </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              await handleLogin(formData);
            }} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    className="pl-10"
                    placeholder="admin@netpoleon.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure connection • Protected by Supabase</span>
          </div>
          <p className="text-xs text-muted-foreground">
              © 2024 Netpoleon. All rights reserved.
            </p>
        </div>
      </div>
    </div>
  );
} 