"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, Loader2 } from "lucide-react";
import { checkVaultStatus, setupVault, unlockVault } from "@/actions/auth.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ initialized: boolean; unlocked: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      const currentStatus = await checkVaultStatus();
      if (currentStatus.unlocked) {
        router.push("/");
      } else {
        setStatus(currentStatus);
      }
    }
    fetchStatus();
  }, [router]);

  if (!status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await setupVault(formData);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Something went wrong.");
      }
    });
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("password", password);

    startTransition(async () => {
      const res = await unlockVault(formData);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Something went wrong.");
      }
    });
  };

  // Password strength logic (simple)
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { label: "", color: "bg-transparent" };
    if (pwd.length < 8) return { label: "Weak", color: "bg-red-500" };
    if (pwd.length >= 8 && /\d/.test(pwd) && /[a-zA-Z]/.test(pwd)) return { label: "Strong", color: "bg-green-500" };
    return { label: "Fair", color: "bg-yellow-500" };
  };

  const strength = getPasswordStrength(password);

  if (!status.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                <Shield className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome to HealthVault</CardTitle>
            <CardDescription className="text-zinc-500">
              Create a master password to protect your family&apos;s health data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSetup} className="space-y-4">
              {error && <div className="text-sm text-red-500 text-center font-medium">{error}</div>}
              
              <div className="space-y-2">
                <Label htmlFor="password">Master Password</Label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                />
                {password.length > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`h-1.5 w-12 rounded-full ${strength.color}`} />
                    <span className="text-xs text-zinc-500">{strength.label}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isPending}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Vault
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md shadow-lg border-zinc-200 dark:border-zinc-800">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full">
              <Lock className="w-8 h-8 text-zinc-900 dark:text-zinc-100" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">HealthVault</CardTitle>
          <CardDescription className="text-zinc-500">
            Enter your master password to access your health records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUnlock} className="space-y-4">
            {error && <div className="text-sm text-red-500 text-center font-medium">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unlock Vault
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
