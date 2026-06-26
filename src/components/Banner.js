'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Banner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    
    // ট্রেন্ডিং ট্যাগস
    const trendingTags = ['ChatGPT', 'Midjourney', 'Stable Diffusion', 'Copywriting', 'Coding'];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/prompts?search=${searchQuery}`);
        }
    };

    return (
        <div className="relative bg-gradient-to-b from-[#0a0d14] via-[#0d111a] to-[#0a0d14] py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center text-white overflow-hidden border-b border-slate-900/60">
            {/* কাস্টম গ্লো ইফেক্ট - মোবাইল ফ্রেন্ডলি রেডিয়াস */}
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[200px] sm:h-[300px] bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>
            <div className="absolute top-20 right-10 w-48 sm:w-72 h-48 sm:h-72 bg-emerald-500/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none"></div>

            {/* Title & Subtitle */}
            <motion.div 
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4 sm:mb-5 leading-tight px-1">
                    Forge Your Ideas Into <br className="hidden sm:block"/>
                    Premium <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">AI Prompts</span>
                </h1>
                <p className="text-slate-400 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
                    Optimize your automated workflows and creative blocks with production-grade prompts engineered for Claude, Midjourney, and GPT ecosystems.
                </p>
            </motion.div>

            {/* Search Bar - মোবাইলে বাটন ও ইনপুট রেসপনসিভ */}
            <motion.form 
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-[#0f1423]/50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-2xl focus-within:border-indigo-500/50 transition-all duration-300 mx-2 sm:mx-auto"
            >
                <div className="flex-grow flex items-center px-2 sm:px-3">
                    <span className="text-slate-500 text-base sm:text-lg">🔍</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search prompts by keyword or model..." 
                        className="w-full bg-transparent px-2 sm:px-3 py-2.5 sm:py-3 outline-none text-slate-100 placeholder-slate-500 text-xs sm:text-sm"
                    />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-300 text-xs sm:text-sm whitespace-nowrap">
                    Search Engine
                </button>
            </motion.form>

            {/* Trending Tags */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 sm:mt-8 flex flex-wrap justify-center items-center gap-2 text-[11px] sm:text-xs text-slate-500 px-2"
            >
                <span className="font-bold uppercase tracking-wider text-slate-400 text-[9px] sm:text-[10px] block w-full sm:w-auto mb-1 sm:mb-0">Hot Templates:</span>
                {trendingTags.map((tag, index) => (
                    <button 
                        key={index}
                        onClick={() => router.push(`/prompts?search=${tag}`)}
                        className="bg-slate-900/60 hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-300 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-800/60 hover:border-indigo-500/30 transition-all duration-200 text-[10px] sm:text-xs"
                    >
                        #{tag}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default Banner;