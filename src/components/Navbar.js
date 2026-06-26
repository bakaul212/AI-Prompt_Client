'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

const Navbar = () => {
    const { user, userRole, logOut } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু স্টেট টগল করার জন্য

    return (
        <nav className="bg-[#0a0d14]/80 backdrop-blur-lg border-b border-slate-800/50 text-white p-4 sticky top-0 z-50 transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* ⚡ ব্র্যান্ড লোগো */}
                <Link href="/" className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-emerald-400 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                        ⚡
                    </div>
                    <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent group-hover:to-emerald-400 transition-all duration-300">
                        PromptForge
                    </span>
                </Link>

                {/* 📱 মোবাইল হ্যামবার্গার বাটন (ল্যাপটপে লুকানো থাকবে) */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="md:hidden text-slate-400 hover:text-white transition-colors focus:outline-none p-1 bg-slate-900/60 border border-slate-800 rounded-lg"
                >
                    {isOpen ? <IoCloseOutline size={22} /> : <IoMenuOutline size={22} />}
                </button>

                {/* 💻 ডেসকটপ নেভিগেশন লিংকসমূহ (মোবাইলে hidden থাকবে) */}
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link href="/" className="hover:text-indigo-400 transition-colors duration-200">Home</Link>
                    <Link href="/all-prompts" className="hover:text-indigo-400 transition-colors duration-200">Explore</Link>

                    {user ? (
                        <>
                            {(userRole === 'admin' || user?.email === 'admin25678@gmail.com') && (
                                <Link 
                                    href="/admin-dashboard" 
                                    className="text-xs font-mono text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 px-3 py-1.5 rounded-xl transition-all duration-200"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <Link href="/dashboard" className="hover:text-indigo-400 transition-colors duration-200">Dashboard</Link>
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
                            <Link href="/register" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-4 py-1.5 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all duration-300 text-xs">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* 📱 ড্রপডাউন মোবাইল মেনু প্যানেল (শুধুমাত্র মোবাইলের জন্য) */}
            {isOpen && (
                <div className="md:hidden mt-4 pt-4 border-t border-slate-800/60 flex flex-col gap-4 text-sm font-medium text-slate-300 animate-fadeIn">
                    <Link onClick={() => setIsOpen(false)} href="/" className="hover:text-indigo-400 px-2 py-1 transition-colors">Home</Link>
                    <Link onClick={() => setIsOpen(false)} href="/all-prompts" className="hover:text-indigo-400 px-2 py-1 transition-colors">Explore</Link>

                    {user ? (
                        <>
                            {(userRole === 'admin' || user?.email === 'admin25678@gmail.com') && (
                                <Link 
                                    onClick={() => setIsOpen(false)}
                                    href="/admin-dashboard" 
                                    className="text-center font-mono text-indigo-400 border border-indigo-500/30 bg-indigo-500/5 py-2 rounded-xl"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <Link onClick={() => setIsOpen(false)} href="/dashboard" className="hover:text-indigo-400 px-2 py-1 transition-colors">Dashboard</Link>
                            <button 
                                onClick={() => { logOut(); setIsOpen(false); }} 
                                className="w-full bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 py-2 rounded-xl transition-all text-xs font-semibold"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-800/40">
                            <Link onClick={() => setIsOpen(false)} href="/login" className="text-center text-slate-400 hover:text-white py-2 border border-slate-800 rounded-xl transition-colors">
                                Sign In
                            </Link>
                            <Link onClick={() => setIsOpen(false)} href="/register" className="text-center bg-indigo-600 text-white font-semibold py-2 rounded-xl transition-all">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;