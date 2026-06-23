'use client';

import { motion } from 'framer-motion';

const StatsSection = () => {
  const metrics = [
    { value: "140K+", label: "Indexed Blueprints", color: "text-indigo-400" },
    { value: "99.8%", label: "Execution Success Rate", color: "text-emerald-400" },
    { value: "2.4M", label: "Automated Triggers", color: "text-purple-400" }
  ];

  return (
    <section className="bg-[#0a0d14] px-4 py-20 border-b border-slate-900/60">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 bg-[#0f1423]/20 border border-slate-800/80 rounded-2xl p-10 backdrop-blur-md text-center">
          {metrics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <span className={`text-4xl font-black tracking-tight ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-2 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;