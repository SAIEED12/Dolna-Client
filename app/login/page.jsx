"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!email.trim() || !password.trim()) {
    setError("Please enter both your email and password.");
    return;
  }

  setLoading(true);
  try {
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "/",
    });

    if (error) {
      if (error.status === 403) {
        setError("Please verify your email address before logging in.");
      } else {
        setError("Wrong email or password. Please try again.");
      }
      return;
    }
  } catch (err) {
    setError(err?.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleSocialLogin = async (provider) => {
    setError("");
    try {

    } catch (err) {
      setError(err?.message || "Couldn't sign in. Please try again.");
    }
  };

  return (
    <div className="flex w-full flex-col bg-[#F5F1E8] lg:min-h-screen lg:flex-row">
      {/* Left image panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <Image
          src="/login.png"
          alt="A handcrafted bamboo swing on a balcony"
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />

        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/60" />

        <div className="relative flex h-full flex-col items-center justify-center p-12">
          <blockquote className="max-w-md text-center">
            <span className="mx-auto mb-5 block h-px w-12 bg-[#E8956B]" />
            <p className="font-serif text-3xl leading-snug text-white drop-shadow-md">
              ঘরকে চলতে দিন আপনার ছন্দে।
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/85 drop-shadow-sm">
              হাতে তৈরি দোলনা, যা থামা, খেলা আর প্রিয়জনের জন্য জায়গা করে দেয়।
            </p>
          </blockquote>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full flex-col justify-start px-6 py-12 sm:px-10 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="mt-8 font-serif text-3xl text-[#2B1C14] lg:mt-0">
            Welcome back!
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#2B1C14]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D8CBB4] bg-white px-4 py-3 text-sm text-[#2B1C14] placeholder:text-[#A69783] focus:border-[#9C4E30] focus:outline-none focus:ring-2 focus:ring-[#9C4E30]/20"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#2B1C14]"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#9C4E30] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D8CBB4] bg-white px-4 py-3 text-sm text-[#2B1C14] placeholder:text-[#A69783] focus:border-[#9C4E30] focus:outline-none focus:ring-2 focus:ring-[#9C4E30]/20"
              />
            </div>

            {error && (
              <p className="text-sm text-[#B3261E]" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 cursor-pointer rounded-full bg-[#2B1C14] py-3 text-sm font-semibold text-[#F5F1E8] transition-colors hover:bg-[#1A100A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#6B5D50]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#9C4E30] hover:underline"
            >
              Sign up
            </Link>
          </p>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E4D9C8]" />
            <span className="text-xs uppercase tracking-widest text-[#A69783]">
              or
            </span>
            <div className="h-px flex-1 bg-[#E4D9C8]" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#D8CBB4] bg-white py-2.5 text-sm font-medium text-[#2B1C14] transition-colors hover:bg-[#1A100A] hover:text-[#F5F1E8]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}