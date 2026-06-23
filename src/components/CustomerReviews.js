'use client';

import { motion } from 'framer-motion';
import { IoStar } from 'react-icons/io5';

const CustomerReviews = () => {
  const reviews = [
    {
      name: "Evelyn Vance",
      handle: "@evelyn.dev",
      text: "The Midjourney prompt frameworks structural accuracy saved my pipeline over 12 engineering hours this week alone.",
      stars: 5
    },
    {
      name: "Marcus Brody",
      handle: "@marcus_ai",
      text: "Outstanding code execution templates. Clean, direct parameter injections that work perfectly on LLM contexts.",
      stars: 5
    },
    {
      name: "Srinivasan K.",
      handle: "@srini_ops",
      text: "Simple, optimized, and beautifully managed workspace variables. A premium repository for automated content scales.",
      stars: 5
    }
  ];

  return (
    <section className="bg-[#0a0d14] px-4 py-24 relative overflow-hidden border-b border-slate-900/60">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20">
            📊 Signal Feedback
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-4">
            User Validation Records
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#0f1423]/30 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(rev.stars)].map((_, i) => (
                    <IoStar key={i} className="text-amber-400" size={14} />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed font-normal italic">
                  "{rev.text}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-col">
                <span className="text-xs font-bold text-slate-200">{rev.name}</span>
                <span className="text-[10px] font-mono text-indigo-400 mt-0.5">{rev.handle}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;