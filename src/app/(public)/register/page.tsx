"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterData } from "@/lib/validations";
import { Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterData) {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Registration failed");
        return;
      }

      router.push("/login?registered=true");
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-white/50 mt-1">Track your project and communicate with our team</p>
        </div>

        <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input tone="dark"
              label="Full Name"
              placeholder="Jane Smith"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input tone="dark"
              label="Email Address"
              type="email"
              placeholder="jane@company.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input tone="dark"
              label="Password"
              type="password"
              placeholder="Minimum 8 characters"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input tone="dark"
              label="Confirm Password"
              type="password"
              placeholder="Repeat your password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0" size="lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-400 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
