// client/src/app/dashboard/layout.js
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'My Prompts', path: '/dashboard/my-prompts', icon: '📝' },
        { name: 'Add New Prompt', path: '/dashboard/add-prompt', icon: '➕' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Desktop */}
            <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-cyan-400 tracking-wider">User Panel</h2>
                    <p className="text-xs text-slate-400 mt-1">Manage your AI configurations</p>
                </div>
                <nav className="mt-4 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition ${
                                    isActive 
                                        ? 'bg-cyan-600 text-white shadow-md' 
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10">
                {/* Mobile Top Navigation */}
                <div className="md:hidden flex gap-4 mb-6 bg-slate-900 p-4 rounded-xl shadow-sm overflow-x-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition ${
                                    isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 bg-slate-800'
                                }`}
                            >
                                {item.icon} {item.name}
                            </Link>
                        );
                    })}
                </div>
                
                {children}
            </main>
        </div>
    );
}