// client/src/components/TopCreators.js
'use client';

import { motion } from 'framer-motion';

const TopCreators = () => {
    // ডামি ক্রিয়েটর ডেটা (পরবর্তীতে ডাটাবেজ থেকে এগ্রিগেশন দিয়ে আনা যাবে)
    const creators = [
        { name: "Alex Mercer", role: "Midjourney Expert", prompts: 42, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" },
        { name: "Sarah Connor", role: "Prompt Engineer", prompts: 35, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop" },
        { name: "David Kim", role: "GPT Automation", prompts: 29, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                    Top Prompt Creators
                </h2>
                <p className="mt-3 text-lg text-gray-500 max-w-md mx-auto">
                    Meet the brilliant minds crafting high-performance instructions for modern AI systems.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {creators.map((creator, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm text-center flex flex-col items-center h-full"
                    >
                        <img 
                            src={creator.image} 
                            alt={creator.name} 
                            className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-cyan-500/10"
                        />
                        <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                        <p className="text-gray-500 text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full mt-1">
                            {creator.role}
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-100 w-full text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{creator.prompts}</span> Published Prompts
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TopCreators;