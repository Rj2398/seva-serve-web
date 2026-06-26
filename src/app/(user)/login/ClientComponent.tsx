"use client";

import React, { useState, useTransition } from "react";
import { ServerActionResponse } from "@/types/auth";

interface ClientComponentProps {
  loginData: (email: string, password: string) => Promise<ServerActionResponse>;
}

export default function ClientComponent({ loginData }: ClientComponentProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // useTransition tracks the async pending state of the Server Action automatically
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill out all fields.");
      return;
    }

    // Trigger the Server Action inside a transition
    startTransition(async () => {
      const response = await loginData(email, password);

      if (!response.success) {
        // TypeScript safely knows 'error' exists here because success is false
        setErrorMsg(response.error);
      } else {
        // TypeScript safely knows 'data' exists here because success is true
        console.log("Login successful! Data:", response.data);
        // Handle client-side routing redirect or context updates here
      }
    });
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 dark:bg-red-950/50 dark:text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="space-y-1">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1">
          <label
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className="w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:focus:border-zinc-400"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-zinc-900 py-2 text-sm font-medium text-zinc-50 shadow transition hover:bg-zinc-800 focus:outline-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {isPending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
