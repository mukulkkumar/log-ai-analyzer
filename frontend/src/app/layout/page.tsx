"use client";

import { useEffect, useState } from "react";
import { getMe, logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({
	children,
}: {
	children?: React.ReactNode;
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
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-emerald-100">
				<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
					<h1 className="text-2xl font-bold text-center text-blue-600">
						Dashboard
					</h1>
					<p className="text-center text-red-500">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-emerald-100 text-gray-800">
			{/* Top Navigation Panel (static) */}
			<nav className="w-full flex items-center justify-between px-10 py-5 bg-white shadow-md z-20 border-b border-blue-100 flex-shrink-0 fixed top-0 left-0 right-0">
				<div className="flex items-center gap-3">
					<span className="ml-8 text-lg font-semibold text-gray-700">
						Welcome,{" "}
						<span className="text-blue-600">{user.email}</span>
					</span>
				</div>
				<button
					onClick={handleLogout}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
				>
					Logout
				</button>
			</nav>
			<div className="flex flex-1 min-h-0 pt-[84px]">
				{/* Sidebar (static) */}
				<aside className="w-64 bg-white shadow-xl flex flex-col py-8 px-6 min-h-screen border-r border-blue-100 flex-shrink-0 fixed left-0 top-[84px] bottom-0 z-10">
					<div className="mb-10 mt-2">
						<span className="text-xl font-bold text-blue-600 tracking-wide">
							Analyser
						</span>
					</div>
					<nav className="flex flex-col gap-2">
						<Link
							href="/dashboard/upload-file"
							className="text-left px-4 py-2 rounded-lg font-medium transition hover:bg-blue-50 text-gray-700"
						>
							Log File
						</Link>
						<Link
							href="/dashboard/upload-path"
							className="text-left px-4 py-2 rounded-lg font-medium transition hover:bg-blue-50 text-gray-700"
						>
							Log Project
						</Link>
					</nav>
				</aside>
				{/* Main Content with scroll */}
				<main className="flex-1 flex flex-col items-center pt-16 overflow-y-auto min-h-0 ml-64">
					<div className="w-full pb-16 px-6 md:px-12 lg:px-24">
						{children}
					</div>
				</main>
			</div>
			{/* Footer (static) */}
			<footer className="w-full bg-white border-t border-blue-100 py-4 px-8 text-center text-gray-500 text-sm shadow z-20 flex-shrink-0 fixed bottom-0 left-0 right-0">
				&copy; {new Date().getFullYear()} Analyser. All rights reserved.
			</footer>
		</div>
	);
}
