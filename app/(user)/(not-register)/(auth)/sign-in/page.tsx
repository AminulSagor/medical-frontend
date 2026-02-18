// app/(auth)/sign-in/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("dr.smith@tai.edu");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: call your sign-in API
    alert(`Signing in: ${email}`);
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <div className="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
        <h1 className="text-center text-3xl font-bold text-slate-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-slate-500">
          Access your institutional portal
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Institutional Email
            </label>

            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="dr.smith@tai.edu"
                className={[
                  "h-12 w-full rounded-2xl border bg-slate-50 pl-12 pr-4 text-sm text-slate-900 outline-none",
                  "border-slate-200 placeholder:text-slate-300",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>

            <div className="relative mt-2">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className={[
                  "h-12 w-full rounded-2xl border bg-slate-50 pl-12 pr-12 text-sm text-slate-900 outline-none",
                  "border-slate-200 placeholder:text-slate-300",
                  "focus:border-sky-300 focus:ring-4 focus:ring-sky-100",
                ].join(" ")}
              />

              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                aria-label={showPass ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 hover:bg-white/60 focus:outline-none focus:ring-4 focus:ring-sky-100"
              >
                {showPass ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* keep forget password AFTER password field */}
            <div className="mt-3 flex items-center justify-end">
              <Link
                href="/reset-password"
                className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Keep signed in */}
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
            <span
              className={[
                "grid h-4 w-4 place-items-center rounded-full border",
                keepSignedIn
                  ? "border-sky-500 bg-sky-500"
                  : "border-slate-300 bg-white",
              ].join(" ")}
            >
              <span className="h-2 w-2 rounded-full bg-white" />
            </span>

            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="sr-only"
            />
            Keep me signed in for 30 days
          </label>

          {/* Sign in button */}
          <button
            type="submit"
            className={[
              "mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl",
              "bg-sky-500 text-sm font-semibold text-white",
              "shadow-[0_14px_35px_rgba(2,132,199,0.28)] hover:bg-sky-600",
              "focus:outline-none focus:ring-4 focus:ring-sky-200",
            ].join(" ")}
          >
            Sign In <LogIn className="h-5 w-5" />
          </button>

          {/* Create account */}
          <div className="text-center text-sm text-slate-500">
            <Link href="/sign-up" className="text-sky-600 hover:underline">
              New to the Institute? Create a professional account
            </Link>
          </div>

          {/* Divider */}
          <div className="pt-2">
            <div className="h-px w-full bg-slate-200" />
          </div>

          {/* Footer note */}
          <p className="pt-2 text-center text-xs leading-5 text-slate-400">
            Authorized medical staff only. All activity is monitored for
            institutional security and compliance purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
