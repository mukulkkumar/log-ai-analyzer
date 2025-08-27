"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setMessage("✅ Logged in successfully.");
      router.push("/dashboard");
    } catch (err: any) {
      setMessage("❌ Invalid credentials");
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
          <FaUserCircle className="text-5xl text-green-600 mb-2" />
          <h1 className="text-2xl font-extrabold text-gray-800">
            Sign in to your account
          </h1>
        </div>
        <input
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">&nbsp;</span>
          <a
            href="#"
            className="text-green-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
      </form>
    </div>
  );
}
