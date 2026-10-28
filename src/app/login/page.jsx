"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();

    // Check for explicit Admin credentials
    if (
      email.trim().toLowerCase() === "admin@lumina.com" &&
      password === "admin123"
    ) {
      localStorage.setItem("userRole", "admin");
      router.push("/dashboard");
    } else {
      // Any other email/password combination logs in as a regular Client
      localStorage.setItem("userRole", "client");
      router.push("/bookings");
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-slate-900">Sign In</h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="e.g. client@example.com or admin@lumina.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md"
          >
            Sign In
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-400 space-y-1">
          <p>Clients can sign in with any email and password.</p>
          <p>
            Admin login:{" "}
            <span className="font-mono text-slate-600">admin@lumina.com</span> |{" "}
            <span className="font-mono text-slate-600">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
