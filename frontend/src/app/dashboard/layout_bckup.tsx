"use client";

import { useEffect, useState } from "react";
import { getMe, logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setError("❌ Unauthorized. Please login again."));
  }, []);

  function handleLogout() {
    const refreshToken =
      user?.refresh_token || localStorage.getItem("refresh_token");
    if (refreshToken) {
      logout(refreshToken).finally(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
      });
    } else {
      router.push("/login");
    }
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300">
        <div className="bg-slate-100 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-center text-slate-700">
            Dashboard
          </h1>
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 text-slate-800">
      {/* Top Navigation Panel (shady, flush with sidebar) */}
      <nav className="w-full flex items-center justify-between px-10 py-5 bg-slate-800 shadow-md z-30 border-b border-slate-700 flex-shrink-0 fixed top-0 left-0 right-0">
        <div className="flex items-center gap-3">
          <span className="ml-8 text-lg font-semibold text-slate-100">
            Welcome,{" "}
            <span className="text-emerald-300">{user.email}</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
        >
          Logout
        </button>
      </nav>
      <div className="flex flex-1 min-h-0 pt-[72px]">
        {/* Sidebar (shady, flush with top nav, no gap) */}
        <aside className="w-64 bg-slate-900 shadow-xl flex flex-col py-8 px-6 min-h-screen border-r border-slate-700 flex-shrink-0 fixed left-0 top-0 bottom-0 z-20">
          <div className="mb-10 mt-2 pt-[72px]">
            {/* pt-[72px] to push content below the fixed top nav */}
            <span className="text-xl font-bold text-emerald-300 tracking-wide">
              Log Analyzer
            </span>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/log-file"
              className="text-left px-4 py-2 rounded-lg font-medium transition hover:bg-slate-800 text-slate-100"
            >
              Log File
            </Link>
            <div className="my-2 border-t border-slate-700" />
            <Link
              href="/dashboard/upload-path"
              className="text-left px-4 py-2 rounded-lg font-medium transition hover:bg-slate-800 text-slate-100"
            >
              Log Project
            </Link>
            <div className="my-2 border-t border-slate-700" />
            <Link
              href="/dashboard/log-chat"
              className="text-left px-4 py-2 rounded-lg font-medium transition hover:bg-slate-800 text-slate-100"
            >
              Log Chat
            </Link>
            <div className="my-2 border-t border-slate-700" />
          </nav>
        </aside>
        {/* Main Content with scroll */}
        <main className="flex-1 flex flex-col items-center pt-16 overflow-y-auto min-h-0 ml-64">
          <div className="w-full pb-16 px-6 md:px-12 lg:px-24">
            {children}
          </div>
        </main>
      </div>
      {/* Footer (shady, flush with sidebar) */}
      <footer className="w-full bg-slate-800 border-t border-slate-700 py-4 px-8 text-center text-slate-300 text-sm shadow z-30 flex-shrink-0 fixed bottom-0 left-0 right-0">
        &copy; {new Date().getFullYear()} Analyser. All rights reserved.
      </footer>
    </div>
  );
}
