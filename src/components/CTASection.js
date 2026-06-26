'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="bg-[#0a0d14] px-4 py-16 sm:py-20 md:py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[150px] sm:h-[300px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 text-center px-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
            Ready to Accelerate Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent block sm:inline mt-1 sm:mt-0">
              AI Core Integration?
            </span>
          </h2>
          <p className="mt-3 sm:mt-4 text-slate-400 text-[11px] sm:text-sm max-w-sm sm:max-w-md mx-auto leading-relaxed">
            Deploy production-ready configurations instantly or construct an engineering hub to syndicate custom solutions.
          </p>
          
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link 
              href="/all-prompts"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-[10px] sm:text-xs py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-transform hover:scale-105 shadow-lg shadow-indigo-500/20 uppercase tracking-widest"
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