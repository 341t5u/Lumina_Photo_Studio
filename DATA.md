# DATA.md — Data Fetching, Caching & State Synchronization

## 1. Overview & Data Source

The Lumina Photo Studio Management & Booking System utilizes a client-side state architecture built around browser `localStorage` combined with Next.js 16 (App Router) client components. Because the application requires real-time synchronization between the Admin Dashboard and the Client Gallery/Booking forms without an external backend server, local state is persisted and synchronized dynamically.

## 2. Data Fetching & Caching Strategy

- **Initial Hydration:** Gallery data (`INITIAL_GALLERY_DATA`) and registered client accounts are initialized directly from `localStorage` on component mount (`useEffect`). If no data exists, default packages and pricing tiers are seeded automatically.
- **Caching Mechanism:** `localStorage` acts as the primary local cache for portfolio packages, custom uploaded items, and user authentication tokens/roles. This ensures instant load times and offline accessibility during client browsing sessions.

## 3. Revalidation & Real-Time Sync

To ensure updates made by the admin (such as price changes, package modifications, or new uploads) reflect instantly across client views without requiring manual page reloads:

- **Custom Window Events:** When the admin modifies or adds a package in `DashboardPage`, a custom browser event (`window.dispatchEvent(new Event('galleryUpdated'))`) is fired alongside standard `storage` event listeners.
- **Event Listeners:** Both `StudioGallery` and `BookingForm` listen for these sync events, instantly re-reading `localStorage` and updating React component state in real time.
