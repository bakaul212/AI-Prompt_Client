'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="bg-[#0a0d14] px-4 py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to Accelerate Your <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">AI Core Integration?</span>
          </h2>
          <p className="mt-4 text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Deploy production-ready configurations instantly or construct an engineering hub to syndicate custom solutions.
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link 
              href="/all-prompts"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs py-3 px-8 rounded-xl transition-transform hover:scale-105 shadow-lg shadow-indigo-500/20 uppercase tracking-widest"
            >
              Initialize Command Line
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;