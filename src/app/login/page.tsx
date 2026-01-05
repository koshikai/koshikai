"use client";

import { useActionState } from "react";
import { login } from "@/app/actions";
import Link from "next/link";
import { Server, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="text-center">
          <Server className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Login to Koshikai</h2>
          <p className="mt-2 text-sm text-gray-400">
            Securely access your Proxmox dashboard
          </p>
        </div>

        <form action={action} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pl-11 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 py-2.5 pl-11 pr-3 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-red-400 text-sm text-center">{state.error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-all"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-400">Don't have an account? </span>
          <Link href="/register" className="font-medium text-blue-400 hover:text-blue-300">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
