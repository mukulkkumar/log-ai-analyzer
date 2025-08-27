"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import { FaUserPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password);
      setMessage("✅ Registered successfully. Please login.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setMessage("❌ Error registering: " + (err.response?.data?.detail || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md space-y-6"
      >
        <div className="flex flex-col items-center mb-2">
          <FaUserPlus className="text-5xl text-blue-600 mb-2" />
          <h1 className="text-2xl font-extrabold text-gray-800">
            Create your account
          </h1>
        </div>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        {message && (
          <p
            className={`text-center font-medium ${
              message.startsWith("✅")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
        <div className="text-center text-sm text-gray-500 pt-2">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline"
          >
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
