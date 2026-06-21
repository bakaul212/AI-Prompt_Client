// client/src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Prompt Sharing & Marketplace Platform",
  description: "Discover, create, and share high-quality AI prompts.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <AuthProvider>
          {/* Global Header/Navbar */}
          <Navbar />
          
          {/* Dynamic Main Content */}
          <main className="flex-grow">
            {children}
          </main>
          
          {/* Global Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}