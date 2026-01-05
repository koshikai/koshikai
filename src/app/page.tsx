import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <main className="flex flex-col items-center gap-8 text-center bg-gray-900 border border-gray-800 p-10 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Koshikai<span className="text-white">.PMX</span>
        </h1>
        <p className="max-w-[600px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Secure, Self-Hosted Task Management for your Proxmox Homelab.
        </p>
        <div className="flex gap-4">
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-semibold text-white shadow transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-700 bg-transparent px-8 text-sm font-semibold text-white transition-all hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

