"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const INITIAL_GALLERY_DATA = {
  All: [
    {
      id: 1,
      title: "Studio Portrait Session",
      category: "Portrait Standard",
      price: "$150",
      duration: "45 Mins Session",
      deliverables: "5 High-Res Retouched Edits + Full Raw Gallery",
      description:
        "A classic studio headshot session utilizing softbox studio lighting, professional backdrop setups, and high-resolution skin retouching.",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Corporate Leadership Shoot",
      category: "Commercial Pro",
      price: "$350",
      duration: "2 Hours Session",
      deliverables: "12 Retouched Branding Images + Commercial License",
      description:
        "Professional commercial branding photography designed for executive profiles, press releases, and corporate annual reports.",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Outdoor Wedding Ceremony",
      category: "Wedding & Editorial",
      price: "$1,200",
      duration: "Full-Day (8 Hours)",
      deliverables: "300+ Edited Color-Graded Photos + Print Album",
      description:
        "Full-day candid coverage capturing golden hour vows, emotional moments, and editorial wedding portraits in natural lighting.",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Gala Night Event Coverage",
      category: "Event Full-Day",
      price: "$800",
      duration: "6 Hours Event Coverage",
      deliverables: "All Event Photos Delivered in 48 Hours",
      description:
        "Dynamic event photography featuring stage lighting, keynote highlights, award presentations, and guest red-carpet arrivals.",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "High-Fashion Runway & Studio",
      category: "Fashion Lookbook",
      price: "$500",
      duration: "3 Hours Session",
      deliverables: "20 Magazine-Grade Retouched Portfolio Shots",
      description:
        "Avant-garde fashion and clothing brand lookbook shoots with dramatic lighting setups and specialized styling guidance.",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Newborn & Family Lifestyle",
      category: "Family & Newborn",
      price: "$250",
      duration: "1.5 Hours Session",
      deliverables: "15 Hand-Edited Family Portraits",
      description:
        "Gentle, warm-toned natural light photography designed for family milestones, maternity sessions, and newborn portraits.",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Portrait Standard": [
    {
      id: 1,
      title: "Studio Portrait Session",
      category: "Portrait Standard",
      price: "$150",
      duration: "45 Mins Session",
      deliverables: "5 High-Res Retouched Edits + Full Raw Gallery",
      description:
        "A classic studio headshot session utilizing softbox studio lighting, professional backdrop setups, and high-resolution skin retouching.",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Commercial Pro": [
    {
      id: 2,
      title: "Corporate Leadership Shoot",
      category: "Commercial Pro",
      price: "$350",
      duration: "2 Hours Session",
      deliverables: "12 Retouched Branding Images + Commercial License",
      description:
        "Professional commercial branding photography designed for executive profiles, press releases, and corporate annual reports.",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Wedding & Editorial": [
    {
      id: 3,
      title: "Outdoor Wedding Ceremony",
      category: "Wedding & Editorial",
      price: "$1,200",
      duration: "Full-Day (8 Hours)",
      deliverables: "300+ Edited Color-Graded Photos + Print Album",
      description:
        "Full-day candid coverage capturing golden hour vows, emotional moments, and editorial wedding portraits in natural lighting.",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Event Full-Day": [
    {
      id: 4,
      title: "Gala Night Event Coverage",
      category: "Event Full-Day",
      price: "$800",
      duration: "6 Hours Event Coverage",
      deliverables: "All Event Photos Delivered in 48 Hours",
      description:
        "Dynamic event photography featuring stage lighting, keynote highlights, award presentations, and guest red-carpet arrivals.",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Fashion Lookbook": [
    {
      id: 5,
      title: "High-Fashion Runway & Studio",
      category: "Fashion Lookbook",
      price: "$500",
      duration: "3 Hours Session",
      deliverables: "20 Magazine-Grade Retouched Portfolio Shots",
      description:
        "Avant-garde fashion and clothing brand lookbook shoots with dramatic lighting setups and specialized styling guidance.",
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
    },
  ],
  "Family & Newborn": [
    {
      id: 6,
      title: "Newborn & Family Lifestyle",
      category: "Family & Newborn",
      price: "$250",
      duration: "1.5 Hours Session",
      deliverables: "15 Hand-Edited Family Portraits",
      description:
        "Gentle, warm-toned natural light photography designed for family milestones, maternity sessions, and newborn portraits.",
      url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    },
  ],
};

export default function StudioGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [gallery, setGallery] = useState(INITIAL_GALLERY_DATA);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("customGallery");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure parsed gallery has valid items in 'All'
        if (parsed && parsed.All && parsed.All.length > 0) {
          setGallery(parsed);
        } else {
          // If empty/corrupted, reset to default
          localStorage.setItem(
            "customGallery",
            JSON.stringify(INITIAL_GALLERY_DATA),
          );
          setGallery(INITIAL_GALLERY_DATA);
        }
      } catch (err) {
        setGallery(INITIAL_GALLERY_DATA);
      }
    } else {
      localStorage.setItem(
        "customGallery",
        JSON.stringify(INITIAL_GALLERY_DATA),
      );
    }
  }, []);

  // Prevent blinking during initial SSR hydration
  if (!isMounted) {
    return (
      <div className="text-center py-12 text-slate-400 font-medium">
        Loading studio gallery...
      </div>
    );
  }

  const categories = Object.keys(gallery);
  const currentPhotos = gallery[activeCategory] || gallery["All"] || [];

  const handleBookNow = (photo) => {
    localStorage.setItem("selectedPackage", `${photo.title} (${photo.price})`);
    router.push("/bookings");
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Studio Portfolio & Pricing Options
        </h2>
        <p className="text-slate-500 text-sm">
          Browse through our extensive photography options and select any
          package for details.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 cursor-pointer hover:shadow-lg transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white font-extrabold text-xs px-3 py-1.5 rounded-full border border-white/20">
                  {photo.price}
                </span>
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition">
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {photo.description}
                </p>
              </div>
            </div>

            <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                {photo.duration}
              </span>
              <span className="text-xs font-bold text-indigo-600">
                View Specs & Book →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100"
          >
            <div className="max-h-[50vh] overflow-hidden bg-slate-900 relative">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
              <span className="absolute top-4 right-4 bg-indigo-600 text-white font-extrabold text-base px-4 py-1.5 rounded-full shadow-lg">
                {selectedPhoto.price}
              </span>
            </div>

            <div className="p-6 space-y-4 bg-white">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.category && (
                    <span className="inline-block text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full mt-1">
                      {selectedPhoto.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="text-sm font-semibold text-slate-500 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition"
                >
                  Close ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Session Duration
                  </span>
                  <span className="text-slate-800 font-bold">
                    {selectedPhoto.duration}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold uppercase">
                    Deliverables
                  </span>
                  <span className="text-slate-800 font-bold">
                    {selectedPhoto.deliverables}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Session Description
                </h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {selectedPhoto.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleBookNow(selectedPhoto)}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <span>Book This Session Now</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
