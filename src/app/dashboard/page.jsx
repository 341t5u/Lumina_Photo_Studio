"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_GALLERY_DATA } from "@/components/StudioGallery";

export default function DashboardPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [gallery, setGallery] = useState(INITIAL_GALLERY_DATA);
  const [editingId, setEditingId] = useState(null);

  // Form input states
  const [categoryName, setCategoryName] = useState("Portrait Standard");
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoPrice, setPhotoPrice] = useState("$150");
  const [photoDuration, setPhotoDuration] = useState("1 Hour Session");
  const [photoDeliverables, setPhotoDeliverables] = useState(
    "10 High-Res Edited Images",
  );
  const [photoDesc, setPhotoDesc] = useState("");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      alert("Access Denied: Admin privileges required.");
      router.push("/login");
      return;
    }

    const saved = localStorage.getItem("customGallery");
    if (saved) {
      try {
        setGallery(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading gallery:", e);
      }
    } else {
      localStorage.setItem(
        "customGallery",
        JSON.stringify(INITIAL_GALLERY_DATA),
      );
    }

    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBookings(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const saveGallery = (newGallery) => {
    setGallery(newGallery);
    localStorage.setItem("customGallery", JSON.stringify(newGallery));
    // Trigger custom window event so client components update instantly
    window.dispatchEvent(new Event("galleryUpdated"));
  };

  const rebuildGalleryFromList = (allPhotosList) => {
    const newGallery = { All: allPhotosList };
    allPhotosList.forEach((photo) => {
      const cat = photo.category || "General";
      if (!newGallery[cat]) {
        newGallery[cat] = [photo];
      } else {
        newGallery[cat].push(photo);
      }
    });
    return newGallery;
  };

  const handleSubmitPhoto = (e) => {
    e.preventDefault();

    if (!categoryName.trim() || !photoTitle.trim() || !photoUrl.trim()) {
      alert("Please enter a Category, Photo Title, and Image URL!");
      return;
    }

    const currentAllPhotos = gallery.All || [];

    if (editingId) {
      const updatedList = currentAllPhotos.map((p) =>
        p.id === editingId
          ? {
              ...p,
              title: photoTitle.trim(),
              category: categoryName.trim(),
              price: photoPrice.trim() || "$150",
              duration: photoDuration.trim() || "1 Hour Session",
              deliverables: photoDeliverables.trim() || "Edited Photos",
              description: photoDesc.trim() || "Professional studio session.",
              url: photoUrl.trim(),
            }
          : p,
      );

      const updatedGallery = rebuildGalleryFromList(updatedList);
      saveGallery(updatedGallery);
      alert(`Updated details for "${photoTitle.trim()}" successfully!`);
      setEditingId(null);
    } else {
      const newPhoto = {
        id: Date.now(),
        title: photoTitle.trim(),
        category: categoryName.trim(),
        price: photoPrice.trim() || "$150",
        duration: photoDuration.trim() || "1 Hour Session",
        deliverables: photoDeliverables.trim() || "Edited Photos",
        description: photoDesc.trim() || "Professional studio session.",
        url: photoUrl.trim(),
      };

      const updatedList = [newPhoto, ...currentAllPhotos];
      const updatedGallery = rebuildGalleryFromList(updatedList);
      saveGallery(updatedGallery);
      alert(`Successfully published "${newPhoto.title}"!`);
    }

    resetForm();
  };

  const handleStartEdit = (photo) => {
    setEditingId(photo.id);
    setCategoryName(photo.category || "Portrait Standard");
    setPhotoTitle(photo.title || "");
    setPhotoUrl(photo.url || "");
    setPhotoPrice(photo.price || "$150");
    setPhotoDuration(photo.duration || "1 Hour Session");
    setPhotoDeliverables(photo.deliverables || "10 High-Res Edited Images");
    setPhotoDesc(photo.description || "");

    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleDeletePhoto = (photoId) => {
    if (
      confirm("Are you sure you want to remove this package from the gallery?")
    ) {
      const currentAllPhotos = gallery.All || [];
      const updatedList = currentAllPhotos.filter((p) => p.id !== photoId);
      const updatedGallery = rebuildGalleryFromList(updatedList);
      saveGallery(updatedGallery);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setCategoryName("Portrait Standard");
    setPhotoTitle("");
    setPhotoUrl("");
    setPhotoPrice("$150");
    setPhotoDuration("1 Hour Session");
    setPhotoDeliverables("10 High-Res Edited Images");
    setPhotoDesc("");
  };

  const allPhotos = gallery.All || [];

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage client reservations and modify any portfolio gallery option
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            {bookings.length} Total Bookings
          </span>
        </div>
      </div>

      {/* SECTION 1: Client Reservations */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            Client Reservations
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading bookings data...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No client bookings submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4">Session Date</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-indigo-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {b.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{b.phone}</td>
                    <td className="px-6 py-4 text-slate-600">{b.date}</td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-md text-xs border border-indigo-100">
                        {b.package}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(b.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: Form to Create/Edit Photo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingId
                ? "✏️ Modify Gallery Photo & Pricing"
                : "➕ Upload New Gallery Photo & Pricing"}
            </h2>
            <p className="text-sm text-slate-500">
              {editingId
                ? "Update the fields below to modify this package in the main gallery"
                : "Fill in the details to publish a new photo package for clients"}
            </p>
          </div>
          {editingId && (
            <button
              onClick={resetForm}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded-lg border border-slate-300"
            >
              Cancel Editing
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmitPhoto}
          className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gallery Category
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Portrait Standard, Commercial Pro, Fashion"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Photo Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Executive Editorial Portrait"
                value={photoTitle}
                onChange={(e) => setPhotoTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Package Price
              </label>
              <input
                type="text"
                required
                placeholder="e.g. $250"
                value={photoPrice}
                onChange={(e) => setPhotoPrice(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Session Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 1 Hour Session"
                value={photoDuration}
                onChange={(e) => setPhotoDuration(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Deliverables & Included Services
            </label>
            <input
              type="text"
              placeholder="e.g. 8 High-Res Retouched Edits + Full Raw Gallery"
              value={photoDeliverables}
              onChange={(e) => setPhotoDeliverables(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Session Description
            </label>
            <textarea
              rows="3"
              placeholder="Explain studio lighting setups, backdrops, styling notes, and photo details..."
              value={photoDesc}
              onChange={(e) => setPhotoDesc(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
          >
            {editingId ? "Save Modifications" : "Upload & Publish to Gallery"}
          </button>
        </form>
      </div>

      {/* SECTION 3: Manage All 6 Default + Custom Packages */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Active Gallery Options ({allPhotos.length} Items)
          </h2>
          <p className="text-sm text-slate-500">
            Click "Edit Details" on any package below to change its price,
            description, title, or category.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPhotos.map((photo) => (
            <div
              key={photo.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-indigo-600 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow">
                    {photo.price}
                  </span>
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded">
                    {photo.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base pt-1">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {photo.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => handleStartEdit(photo)}
                  className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold py-2 rounded-lg border border-indigo-100 transition"
                >
                  Edit Details ✏️
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold px-3 py-2 rounded-lg border border-rose-100 transition"
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
