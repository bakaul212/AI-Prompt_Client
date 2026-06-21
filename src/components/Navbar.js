// client/src/components/Navbar.js
'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);

    return (
        <nav className="bg-gray-900 text-white p-4 shadow-md">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo & Website Name */}
                <Link href="/" className="text-xl font-bold tracking-wider text-cyan-400">
                    💡 PromptMarket
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="hover:text-cyan-400 transition">Home</Link>
                    <Link href="/all-prompts" className="hover:text-cyan-400 transition">All Prompts</Link>

                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-cyan-400 transition">Dashboard</Link>
                            <button 
                                onClick={logOut} 
                                className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded transition text-sm font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-cyan-400 transition">Login</Link>
                            <Link href="/register" className="bg-cyan-500 hover:bg-cyan-600 px-4 py-1.5 rounded text-gray-900 font-medium transition">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;