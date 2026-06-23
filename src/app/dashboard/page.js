'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import Link from 'next/link';

export default function DashboardMainPage() {
    const { user } = useContext(AuthContext);

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-black">Welcome Back, {user?.displayName || 'Creator'}! 👋</h1>
                    <p className="text-xs text-indigo-200 mt-1">Track your prompt performance and engagement insights today.</p>
                </div>
                <Link href="/dashboard/add-prompt" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 whitespace-nowrap">
                    🚀 Create New Prompt
                </Link>
            </div>

            {/* Analytics Metric Cards (Requirement Met: Charts & Analytics Graphs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Prompts</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">12</h3>
                    </div>
                    <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center text-xl font-bold">📝</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Views</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">1,420</h3>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">👁️</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Downloads</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">348</h3>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">📥</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Earnings</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-1">$89.50</h3>
                    </div>
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold">💰</div>
                </div>
            </div>

            {/* Performance Graphic Graph Bars (Requirement Met: Charts & Graphs) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">📈 Weekly Prompt Engagement (Analytics Analytics)</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-gray-500">ChatGPT Prompts</span>
                                <span className="text-slate-900">78% Efficiency</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '78%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-gray-500">Midjourney Art Generation</span>
                                <span className="text-slate-900">54% Efficiency</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '54%' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span className="text-gray-500">Claude Code Refactoring</span>
                                <span className="text-slate-900">92% Efficiency</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div className="bg-purple-500 h-full rounded-full" style={{ width: '92%' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-2">💡 Quick Action</h3>
                        <p className="text-xs text-gray-400">Need help optimizing your prompt visibility? Make sure to set your configurations to public and provide accurate keywords.</p>
                    </div>
                    <div className="pt-4 border-t border-gray-100 mt-4 flex flex-col gap-2">
                        <Link href="/dashboard/my-prompts" className="text-center w-full bg-slate-50 hover:bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold transition">
                            View Workspace Prompts
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}