'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import PromptCard from '@/components/PromptCard';
import { IoSearchOutline, IoArrowForwardOutline, IoArrowBackOutline } from 'react-icons/io5';

export default function AllPromptsPage() {
    const axiosPublic = useAxiosPublic();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get('search') || '';

    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState('');
    const [aiTool, setAiTool] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const limit = 6;

    const { data, isLoading } = useQuery({
        queryKey: ['allPrompts', search, category, aiTool, sort, page],
        queryFn: async () => {
            const res = await axiosPublic.get(`/all-prompts`, {
                params: { page, limit, search, category, aiTool, sort }
            });
            return res.data;
        }
    });

    const prompts = data?.prompts || [];
    const totalPages = data?.totalPages || 1;

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-[#0a0d14] py-16 px-4 sm:px-6 lg:px-8 text-white relative">
            <div className="absolute top-20 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-12 text-center sm:text-left">
                    <h1 className="text-3xl font-black text-white tracking-tight">Central Prompt Database</h1>
                    <p className="text-slate-400 text-xs mt-1 font-mono">Query production-ready blueprints across active AI units</p>
                </div>

                {/* Filters Row */}
                <div className="bg-[#0f1423]/40 p-4 rounded-xl border border-slate-800/80 backdrop-blur-md flex flex-col gap-4 lg:flex-row lg:items-center justify-between mb-10">
                    {/* Search Field */}
                    <div className="relative flex-grow max-w-xl">
                        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                            placeholder="Identify index by tag, tool name or parameter..."
                            className="w-full pl-11 pr-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-lg focus:outline-none focus:border-indigo-500/50 transition-all text-xs text-slate-200 placeholder-slate-500"
                        />
                    </div>

                    {/* Select Dropdowns */}
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-2.5 text-xs">
                        <select 
                            value={category} 
                            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
                            className="bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg outline-none text-slate-300 focus:border-indigo-500/40"
                        >
                            <option value="">All Categories</option>
                            <option value="Coding">Coding</option>
                            <option value="Writing">Writing</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                        </select>

                        <select 
                            value={aiTool} 
                            onChange={(e) => handleFilterChange(setAiTool, e.target.value)}
                            className="bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg outline-none text-slate-300 focus:border-indigo-500/40"
                        >
                            <option value="">All Systems</option>
                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Midjourney">Midjourney</option>
                            <option value="Claude">Claude</option>
                            <option value="Stable Diffusion">Stable Diffusion</option>
                        </select>

                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-slate-900 border border-slate-800 px-3 py-2.5 rounded-lg outline-none text-slate-300 focus:border-indigo-500/40 col-span-2 sm:col-span-1"
                        >
                            <option value="newest">Chronological Order</option>
                            <option value="price-low">Value: Low to High</option>
                            <option value="price-high">Value: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Content Logic */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-24 gap-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="text-xs text-slate-500 font-mono animate-pulse">Syncing datasets...</p>
                    </div>
                ) : prompts.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {prompts.map((prompt) => (
                                <PromptCard key={prompt._id} prompt={prompt} />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        <div className="flex justify-center items-center gap-2 mt-16 pt-6 border-t border-slate-900">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="p-2 border border-slate-800 bg-slate-900/50 rounded-lg hover:border-slate-700 hover:text-indigo-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <IoArrowBackOutline size={16} />
                            </button>
                            
                            <span className="text-xs font-mono text-slate-400 mx-3">
                                Block {page} / {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-2 border border-slate-800 bg-slate-900/50 rounded-lg hover:border-slate-700 hover:text-indigo-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <IoArrowForwardOutline size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#0f1423]/20 border border-slate-800 rounded-xl">
                        <p className="text-slate-400 font-medium text-sm">No query responses found matching filters.</p>
                        <p className="text-slate-600 text-xs mt-1">Refine parameters or fallback to active categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
}