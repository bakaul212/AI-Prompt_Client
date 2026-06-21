// client/src/app/all-prompts/page.js
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import PromptCard from '@/components/PromptCard';
import { IoSearchOutline, IoFilterOutline, IoArrowForwardOutline, IoArrowBackOutline } from 'react-icons/io5';

export default function AllPromptsPage() {
    const axiosPublic = useAxiosPublic();
    const searchParams = useSearchParams();
    const router = useRouter();

    // URL থেকে প্রাথমিক সার্চ ভ্যালু নেওয়া (যদি হোম পেজের ব্যানার থেকে সার্চ করে আসে)
    const initialSearch = searchParams.get('search') || '';

    // States for filtering & pagination
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState('');
    const [aiTool, setAiTool] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const limit = 6;

    // রিঅ্যাক্ট কোয়েরি দিয়ে ডাটা ফেচিং
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

    // ফিল্টার চেঞ্জ হলে পেজ ১-এ রিসেট করা
    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Top Heading */}
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">Explore All Prompts</h1>
                    <p className="text-gray-500 mt-1">Find the perfect configurations for your AI workflows.</p>
                </div>

                {/* Filter and Search Bar Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-4 lg:flex-row lg:items-center justify-between mb-8">
                    {/* Search Input */}
                    <div className="relative flex-grow max-w-xl">
                        <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                            placeholder="Search by title, tag, or keywords..."
                            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                        />
                    </div>

                    {/* Dropdown Filters */}
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-3 text-sm">
                        <select 
                            value={category} 
                            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
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
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <option value="">All AI Tools</option>
                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Midjourney">Midjourney</option>
                            <option value="Claude">Claude</option>
                            <option value="Stable Diffusion">Stable Diffusion</option>
                        </select>

                        <select 
                            value={sort} 
                            onChange={(e) => setSort(e.target.value)}
                            className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 col-span-2 sm:col-span-1"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Content Grid */}
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-24 gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        <p className="text-sm text-gray-400 font-medium">Loading prompts database...</p>
                    </div>
                ) : prompts.length > 0 ? (
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {prompts.map((prompt) => (
                                <PromptCard key={prompt._id} prompt={prompt} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-gray-200">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoArrowBackOutline size={18} />
                            </button>
                            
                            <span className="text-sm font-medium text-gray-700 mx-2">
                                Page {page} of {totalPages}
                            </span>

                            <button
                                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                                disabled={page === totalPages}
                                className="p-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <IoArrowForwardOutline size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <p className="text-gray-400 font-medium text-lg">No prompts matched your criteria.</p>
                        <p className="text-gray-400 text-sm mt-1">Try resetting filters or changing your search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
}