import BookingForm from "@/components/BookingForm";

export default function BookingsPage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 bg-slate-50">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
        <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          Reservations
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Book Your Studio Session
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Choose your package and secure your preferred date. Our studio team
          will reach out to confirm your slot details.
        </p>
      </div>

      {/* Booking Form Wrapper */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 transition-all">
        <BookingForm />
      </div>
    </div>
  );
}
