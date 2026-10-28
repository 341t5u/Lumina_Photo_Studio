"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_PACKAGES = [
  "Portrait Standard ($150)",
  "Commercial Pro ($350)",
  "Fashion Lookbook ($500)",
  "Event Full-Day ($800)",
  "Family & Newborn ($250)",
  "Outdoor Wedding Ceremony ($1,200)",
];

export default function BookingForm() {
  const [packageOptions, setPackageOptions] = useState(DEFAULT_PACKAGES);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    package: DEFAULT_PACKAGES[0],
  });
  const [phoneError, setPhoneError] = useState("");
  const [dateError, setDateError] = useState("");
  const [status, setStatus] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Get today's date formatted as YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const todayStr = getTodayString();

  useEffect(() => {
    // 1. Check if user is authenticated
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // 2. Sync dynamic packages published by Admin
    const savedGallery = localStorage.getItem("customGallery");
    let dynamicPackages = [...DEFAULT_PACKAGES];

    if (savedGallery) {
      try {
        const parsedGallery = JSON.parse(savedGallery);
        const allPhotos = parsedGallery.All || [];
        const customPackageList = allPhotos.map(
          (photo) => `${photo.title} (${photo.price})`,
        );
        dynamicPackages = Array.from(
          new Set([...dynamicPackages, ...customPackageList]),
        );
        setPackageOptions(dynamicPackages);
      } catch (err) {
        console.error("Error parsing packages:", err);
      }
    }

    // 3. Pre-select package from gallery choice
    const preselected = localStorage.getItem("selectedPackage");
    if (preselected) {
      const matched = dynamicPackages.find((opt) =>
        opt
          .toLowerCase()
          .includes(preselected.split("(")[0].trim().toLowerCase()),
      );
      setFormData((prev) => ({
        ...prev,
        package: matched || preselected,
      }));
      localStorage.removeItem("selectedPackage");
    }
  }, []);

  // Validate Ethiopian phone format (09 or 07 + 8 digits)
  const validateEthiopianPhone = (phone) => {
    const cleanPhone = phone.trim().replace(/\s+/g, "");
    const ethiopianRegex = /^(09|07)\d{8}$|^\+251(9|7)\d{8}$/;
    return ethiopianRegex.test(cleanPhone);
  };

  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setFormData({ ...formData, phone: inputPhone });

    if (inputPhone && !validateEthiopianPhone(inputPhone)) {
      setPhoneError(
        "Please enter a valid Ethiopian phone number starting with 09 or 07 (10 digits total, e.g., 0912345678).",
      );
    } else {
      setPhoneError("");
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setFormData({ ...formData, date: selectedDate });

    if (selectedDate && selectedDate < todayStr) {
      setDateError(
        "You cannot select a past date. Please pick today or a future date.",
      );
    } else {
      setDateError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("Please log in to submit your studio booking.");
      router.push("/login");
      return;
    }

    if (!validateEthiopianPhone(formData.phone)) {
      setPhoneError(
        "Invalid Ethiopian phone number. Must start with 09 or 07 followed by 8 digits.",
      );
      return;
    }

    if (formData.date < todayStr) {
      setDateError("Booking date cannot be in the past.");
      return;
    }

    setStatus("Submitting...");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setStatus("Booking confirmed successfully!");
      setFormData({
        name: "",
        phone: "",
        date: "",
        package: packageOptions[0] || DEFAULT_PACKAGES[0],
      });
      setPhoneError("");
      setDateError("");
    } else {
      setStatus("Failed to submit booking. Please try again.");
    }
  };

  return (
    <div className="relative max-w-lg mx-auto">
      {/* AUTHENTICATION REQUIRED PROMPT OVERLAY */}
      {!isLoggedIn && (
        <div className="absolute inset-0 z-20 backdrop-blur-sm bg-slate-900/70 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
            🔒
          </div>
          <h3 className="text-xl font-extrabold text-white">
            Client Login Required
          </h3>
          <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
            Please log in or create an account to reserve your photography
            session and lock in your preferred date.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/login")}
              className="bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              Log In Now
            </button>
          </div>
        </div>
      )}

      {/* BOOKING FORM */}
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm transition ${
          !isLoggedIn ? "opacity-30 pointer-events-none select-none" : ""
        }`}
      >
        <h2 className="text-2xl font-bold text-slate-800">
          Schedule Your Session
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Abebe Bikila"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone Number (Ethiopian Format)
          </label>
          <input
            type="tel"
            required
            placeholder="e.g. 0911234567 or 0712345678"
            value={formData.phone}
            onChange={handlePhoneChange}
            className={`w-full border rounded-lg p-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 outline-none transition ${
              phoneError
                ? "border-rose-400 focus:ring-rose-500"
                : "border-slate-300 focus:ring-indigo-500"
            }`}
          />
          {phoneError ? (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {phoneError}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-1">
              Format: Starts with 09 or 07 followed by 8 digits
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Preferred Session Date
          </label>
          <input
            type="date"
            required
            min={todayStr}
            value={formData.date}
            onChange={handleDateChange}
            className={`w-full border rounded-lg p-3 text-slate-900 focus:ring-2 outline-none transition ${
              dateError
                ? "border-rose-400 focus:ring-rose-500"
                : "border-slate-300 focus:ring-indigo-500"
            }`}
          />
          {dateError && (
            <p className="text-xs text-rose-600 mt-1.5 font-medium">
              {dateError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select Photography Package & Pricing
          </label>
          <select
            value={formData.package}
            onChange={(e) =>
              setFormData({ ...formData, package: e.target.value })
            }
            className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white font-medium"
          >
            {packageOptions.map((pkgOption, idx) => (
              <option key={idx} value={pkgOption}>
                {pkgOption}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
        >
          Confirm Booking
        </button>

        {status && (
          <p
            className={`text-center text-sm font-medium ${
              status.includes("successfully")
                ? "text-emerald-600"
                : "text-indigo-600"
            }`}
          >
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
