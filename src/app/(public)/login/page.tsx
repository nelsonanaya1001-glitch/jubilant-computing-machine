"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginData } from "@/lib/validations";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginData) {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        // Redirect based on role — fetch session to check
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        if (session?.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/client/dashboard");
        }
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-violet-500 rounded-md rotate-12" />
            <span className="font-bold text-white text-xl">
              launch<span className="text-violet-400">boarding</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-white/50 mt-1">Sign in to access your client portal</p>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input tone="dark"
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <div>
              <Input tone="dark"
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
              />
              <div className="text-right mt-1">
                <a href="#" className="text-xs text-violet-400 hover:underline">Forgot password?</a>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0" size="lg" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            Don't have an account?{" "}
            <Link href="/register" className="text-violet-400 font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/30 mt-6">
          By signing in you agree to our{" "}
          <a href="#" className="hover:underline">Terms of Service</a> and{" "}
          <a href="#" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
