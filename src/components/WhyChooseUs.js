'use client';

import { motion } from 'framer-motion';
import { IoShieldCheckmarkOutline, IoSparklesOutline, IoPeopleOutline } from 'react-icons/io5';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <IoShieldCheckmarkOutline size={26} className="text-indigo-400" />,
            title: "Verified Pipeline",
            description: "Every single prompt architecture clears strict admin evaluation grids to secure peak execution accuracy."
        },
        {
            icon: <IoSparklesOutline size={26} className="text-purple-400" />,
            title: "Cross-Model Synergy",
            description: "Engineered syntax nodes tailored explicitly for Midjourney, Claude, and GPT enterprise models."
        },
        {
            icon: <IoPeopleOutline size={26} className="text-emerald-400" />,
            title: "Creator Network",
            description: "Deploy unique prompt templates, expand your developer footprint, and unlock next-gen monetization."
        }
    ];

    return (
        <section className="bg-[#0a0d14] text-slate-100 py-24 px-4 border-b border-slate-900/60 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-sm">
                        ⚙️ System Values
                    </span>
                    <h2 className="text-3xl font-black tracking-tight text-white mt-4">
                        Why Deploy With Us?
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                        The definitive node for prompt engineers, architects, and automated content creators.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 25 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-[#0f1423]/40 backdrop-blur-md p-8 rounded-2xl border border-slate-800/80 flex flex-col items-center text-center h-full hover:border-indigo-500/30 transition-all duration-300 shadow-xl"
                        >
                            <div className="p-3.5 bg-slate-900 rounded-xl mb-5 border border-slate-800 shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-base font-bold text-slate-200 mb-2.5 tracking-tight">{item.title}</h3>
                            <p className="text-slate-400 text-xs leading-relaxed font-normal">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;