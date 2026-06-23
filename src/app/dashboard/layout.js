'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logOut } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'My Prompts', path: '/dashboard/my-prompts', icon: '📝' },
        { name: 'Add New Prompt', path: '/dashboard/add-prompt', icon: '➕' },
    ];

    const handleLogOut = () => {
        logOut()
            .then(() => {
                router.push('/');
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-slate-800 font-sans">
            
            {/* ========================================== */}
            {/* SIDEBAR FOR DESKTOP & TABLET               */}
            {/* ========================================== */}
            <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 hidden md:flex flex-col justify-between shrink-0">
                <div>
                    {/* Header */}
                    <div className="p-6 border-b border-slate-800">
                        <h2 className="text-xl font-black text-cyan-400 tracking-wider">User Panel</h2>
                        <p className="text-xs text-slate-400 mt-1">Manage your AI configurations</p>
                    </div>
                    
                    {/* Navigation */}
                    <nav className="mt-6 px-4 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                                        isActive 
                                            ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30' 
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Profile & Footer Section (Requirement Met: User Profile Section) */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-3 mb-4">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="User" className="w-10 h-10 rounded-full ring-2 ring-cyan-500 object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-cyan-700 flex items-center justify-center font-bold text-white ring-2 ring-cyan-500">
                                {user?.displayName?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <h4 className="text-sm font-bold text-slate-100 truncate">{user?.displayName || 'Active User'}</h4>
                            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                        <Link href="/" className="flex items-center justify-center gap-1 bg-slate-800 text-slate-300 py-2 rounded-lg hover:bg-slate-700 transition">
                            🏠 Home
                        </Link>
                        <button onClick={handleLogOut} className="bg-rose-950/40 text-rose-400 py-2 rounded-lg hover:bg-rose-900/40 border border-rose-900/30 transition">
                            🚪 Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* ========================================== */}
            {/* MOBILE SIDEBAR ( স্লাইডিং ড্রয়ার রেস্পনসিভ ) */}
            {/* ========================================== */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-slate-950/60 z-50 md:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
            )}
            <aside className={`fixed top-0 bottom-0 left-0 w-64 bg-slate-900 text-white z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div>
                    <div className="p-5 border-b border-slate-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-cyan-400">User Panel</h2>
                            <p className="text-[10px] text-slate-400">Workspace Control</p>
                        </div>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white text-xl p-1">
                            ✕
                        </button>
                    </div>
                    <nav className="mt-4 px-3 space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                                        isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                                >
                                    <span>{item.icon}</span>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                    <div className="flex items-center gap-3 mb-4">
                        <img src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="Profile" className="w-9 h-9 rounded-full ring-2 ring-cyan-500 object-cover" />
                        <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-slate-100 truncate">{user?.displayName || 'User'}</h4>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                        <Link href="/" className="bg-slate-800 text-slate-300 py-2 rounded-lg">🏠 Home</Link>
                        <button onClick={handleLogOut} className="bg-rose-900/30 text-rose-400 py-2 rounded-lg">🚪 Exit</button>
                    </div>
                </div>
            </aside>

            {/* ========================================== */}
            {/* MAIN CONTAINER AREA                        */}
            {/* ========================================== */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* Mobile Top Navbar with Responsive Toggle */}
                <header className="md:hidden flex items-center justify-between bg-slate-900 text-white p-4 shadow-md sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 hover:bg-slate-800 rounded-lg text-cyan-400 focus:outline-none"
                        >
                            <span className="text-xl">☰</span>
                        </button>
                        <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                            DASHBOARD
                        </span>
                    </div>
                    <img src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="User" className="w-8 h-8 rounded-full border border-cyan-500" />
                </header>

                {/* Content Viewport */}
                <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>

        </div>
    );
}