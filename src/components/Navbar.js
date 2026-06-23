'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    return (
        <nav className="bg-[#0a0d14]/70 backdrop-blur-lg border-b border-slate-800/50 text-white p-4 sticky top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* ইউনিক ব্র্যান্ডিং: PromptForge */}
                <Link href="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      ⚡
                    </div>
                    <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent group-hover:to-emerald-400 transition-all duration-300">
                        PromptForge
                    </span>
                </Link>

                {/* নেভিগেশন লিংকসমূহ */}
                <div className="flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link>
                    {/* রাউট /prompts রিকোয়ারমেন্ট পূরণ করবে, কিন্তু ডিজাইন আলাদা */}
                    <Link href="/prompts" className="hover:text-indigo-400 transition-colors duration-200">Explore</Link>

                    {user ? (
                        <>
                            <Link href="/dashboard/profile" className="hover:text-indigo-400 transition-colors duration-200">Dashboard</Link>
                            <button 
                                onClick={logOut} 
                                className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 px-4 py-1.5 rounded-xl transition-all duration-300 text-xs font-semibold"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="hover:text-white text-slate-400 transition-colors duration-200 py-1.5 px-2">
                                Sign In
                            </Link>
                            {/* ইউনিক গ্লোয়িং বাটন (ইন্ডিগো থিম) */}
                            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-300 text-xs">
                                Join Free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;