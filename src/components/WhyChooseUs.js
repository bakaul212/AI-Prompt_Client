// client/src/components/WhyChooseUs.js
'use client';

import { motion } from 'framer-motion';
import { IoShieldCheckmarkOutline, IoSparklesOutline, IoPeopleOutline } from 'react-icons/io5';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <IoShieldCheckmarkOutline size={32} className="text-cyan-500" />,
            title: "Verified Quality",
            description: "Every single prompt goes through strict admin moderation to ensure maximum efficiency and exact desired outputs."
        },
        {
            icon: <IoSparklesOutline size={32} className="text-purple-500" />,
            title: "Multi-AI Support",
            description: "Whether it's ChatGPT, Midjourney, Claude, or Stable Diffusion—find specialized prompts for all top-tier AI tools."
        },
        {
            icon: <IoPeopleOutline size={32} className="text-amber-500" />,
            title: "Creator Ecosystem",
            description: "Publish your innovative prompts, grow your profile, build a following, and explore upcoming premium monetization features."
        }
    ];

    return (
        <section className="bg-gray-900 text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Why Choose <span className="text-cyan-400">PromptMarket</span>?
                    </h2>
                    <p className="mt-3 text-gray-400 max-w-xl mx-auto">
                        The ultimate destination for AI enthusiasts, creators, and professionals to exchange optimized prompt logic.
                    </p>
                </div>

                {/* Equal Card Size Responsive Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700/50 flex flex-col items-center text-center h-full hover:border-cyan-500/30 transition-all duration-300"
                        >
                            <div className="p-4 bg-gray-800 rounded-xl mb-4 border border-gray-700 shadow-inner">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;