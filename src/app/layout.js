import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider"; 
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
  title: "PromptForge | Premium AI Prompt Marketplace",
  description: "Discover, adapt, and deploy industry-grade AI prompt engineering templates.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* #0a0d14 এবং #0f1423 এর একটি মিক্সড ডার্ক অবসিডিয়ান থিম, যা ডেমো থেকে আলাদা কিন্তু চরম মডার্ন */}
      <body className="min-h-full flex flex-col bg-gradient-to-br from-[#0a0d14] via-[#0d111a] to-[#121824] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}