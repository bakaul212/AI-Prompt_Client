// client/src/components/Banner.js
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Banner = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    
    // রিকোয়ারমেন্ট অনুযায়ী র‍্যান্ডম ট্রেন্ডিং ট্যাগস [cite: 74]
    const trendingTags = ['ChatGPT', 'Midjourney', 'Stable Diffusion', 'Copywriting', 'Coding'];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/all-prompts?search=${searchQuery}`);
        }
    };

    return (
        <div className="relative bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 py-20 px-6 text-center text-white overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            {/* Framer Motion Animation for Title & Subtitle  */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto"
            >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Discover & Share the Best <span className="text-cyan-400">AI Prompts</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl mb-8">
                    Boost your productivity and creativity with hand-crafted prompts for ChatGPT, Midjourney, Claude, and more[cite: 13, 71].
                </p>
            </motion.div>

            {/* Search Bar [cite: 73] */}
            <motion.form 
                onSubmit={handleSearch}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 bg-gray-800/50 p-2 rounded-xl border border-gray-700 backdrop-blur-sm shadow-xl"
            >
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search prompts by title, tag, or AI tool... [cite: 160, 161, 162, 163]" 
                    className="w-full bg-transparent px-4 py-3 outline-none text-white placeholder-gray-400"
                />
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md whitespace-nowrap">
                    Search Prompt
                </button>
            </motion.form>

            {/* Trending Tags [cite: 74] */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 flex flex-wrap justify-center items-center gap-2 text-sm text-gray-400"
            >
                <span className="font-medium text-gray-300">Trending:</span>
                {trendingTags.map((tag, index) => (
                    <button 
                        key={index}
                        onClick={() => router.push(`/all-prompts?search=${tag}`)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full border border-gray-700/50 transition"
                    >
                        #{tag}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};

export default Banner;