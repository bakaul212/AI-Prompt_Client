'use client';

import { motion } from 'framer-motion';

const TopCreators = () => {
    const creators = [
        { name: "Alex Mercer", role: "Midjourney Expert", prompts: 42, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" },
        { name: "Sarah Connor", role: "Prompt Engineer", prompts: 35, image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&auto=format&fit=crop" },
        { name: "David Kim", role: "GPT Automation", prompts: 29, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" }
    ];

    return (
        <section className="bg-[#0a0d14] px-4 py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-sm">
                        ⚡ Network Core
                    </span>
                    <h2 className="text-3xl font-black text-white tracking-tight mt-4">
                        Top Prompt Engineers
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        Identify and collaborate with elite architects translating operational demands into high-tier AI directives.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {creators.map((creator, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#0f1423]/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl shadow-xl text-center flex flex-col items-center h-full hover:border-slate-700/60 transition-all duration-300"
                        >
                            <img 
                                src={creator.image} 
                                alt={creator.name} 
                                className="w-16 h-16 rounded-xl object-cover mb-4 ring-2 ring-indigo-500/20 shadow-md"
                            />
                            <h3 className="text-base font-bold text-slate-200 tracking-tight">{creator.name}</h3>
                            <p className="text-[10px] text-indigo-400 font-mono bg-indigo-500/5 border border-indigo-500/10 px-2.5 py-1 rounded-md mt-1.5 uppercase tracking-wider">
                                {creator.role}
                            </p>
                            <div className="mt-5 pt-4 border-t border-slate-800/80 w-full text-xs text-slate-400 font-normal">
                                Verified Repositories: <span className="font-bold text-slate-200">{creator.prompts}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopCreators;