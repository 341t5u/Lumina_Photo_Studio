import "./globals.css"; // <--- Check that this line exists here
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Lumina Photo Studio Management",
  description: "Book sessions and manage client portfolios seamlessly.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-slate-900 text-white text-center py-4 text-sm">
          &copy; 2026 Lumina Photo Studio Capstone Project. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
