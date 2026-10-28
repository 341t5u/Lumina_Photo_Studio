import StudioGallery from "@/components/StudioGallery";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12 py-6">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Lumina Photography Studio
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Studio Gallery & Session Booking
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Explore our featured studio portfolios and secure your appointment
          slot online.
        </p>
        <div>
          <Link
            href="/bookings"
            className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
          >
            Book a Session Now
          </Link>
        </div>
      </div>

      {/* Featured Gallery */}
      <div className="pt-6 border-t border-slate-200/80">
        <StudioGallery />
      </div>
    </div>
  );
}
