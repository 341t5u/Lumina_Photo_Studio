"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [role, setRole] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const currentRole = localStorage.getItem("userRole");
    setRole(currentRole);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("userRole");
    setRole(null);
    router.push("/login");
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-extrabold text-xl text-slate-900 tracking-tight"
        >
          Lumina<span className="text-indigo-600">Studio</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition">
            Home
          </Link>
          <Link href="/bookings" className="hover:text-indigo-600 transition">
            Booking
          </Link>

          {role === "admin" && (
            <Link
              href="/dashboard"
              className="text-indigo-600 font-semibold hover:text-indigo-800 transition"
            >
              Admin Dashboard
            </Link>
          )}

          {role ? (
            <button
              onClick={handleSignOut}
              className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-lg hover:bg-rose-100 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
