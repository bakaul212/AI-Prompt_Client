'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Link from 'next/link';
import { useState } from 'react';

export default function PromptDetailsPage() {
  const { id } = useParams();
  const axiosPublic = useAxiosPublic();
  const [copied, setCopied] = useState(false);

  const { data: prompt = {}, isLoading } = useQuery({
    queryKey: ['promptDetails', id],
    queryFn: async () => {
      const res = await axiosPublic.get(`/prompt/${id}`);
      return res.data;
    },
    enabled: !!id
  });

  const handleCopy = () => {
    if (prompt.description) {
      navigator.clipboard.writeText(prompt.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="text-xs text-slate-500 font-mono tracking-widest uppercase animate-pulse">Decompiling Architecture...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-20 px-4 relative overflow-hidden">
      {/* গ্লো ইফেক্টস */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ব্যাক লিংক */}
        <Link href="/prompts" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-400 transition-colors group mb-8">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Hub
        </Link>

        {/* মেইন প্রিমিয়াম ডার্ক কার্ড */}
        <div className="backdrop-blur-md bg-[#0f1423]/30 border border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-2xl">
          {/* ব্যাজ কালেকশন */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
              🤖 {prompt.aiTool || 'AI Tool'}
            </span>
            <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
              📁 {prompt.category || 'Category'}
            </span>
            <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase border tracking-widest ml-auto ${
              prompt.priceType === 'Premium' 
                ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-400 border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              {prompt.priceType === 'Premium' ? `💎 Premium ($${prompt.price})` : '⚡ Public'}
            </span>
          </div>

          {/* টাইটেল */}
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">
            {prompt.title}
          </h1>

          {/* ক্রিয়েটর মেটা */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-slate-800/60 mb-8">
            <div className="w-7 h-7 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-xs font-black text-white">
              {prompt.creatorName ? prompt.creatorName[0].toUpperCase() : 'F'}
            </div>
            <p className="text-xs text-slate-400">
              Engineered by <span className="text-slate-200 font-semibold">{prompt.creatorName || 'Forge User'}</span>
            </p>
          </div>

          {/* প্রম্পট কপি টার্মিনাল এরিয়া */}
          <div className="relative rounded-xl border border-slate-800/90 bg-[#07090e] p-6 md:p-8 shadow-inner overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
            
            <button 
              onClick={handleCopy}
              className={`absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 ${
                copied 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Prompt'}
            </button>

            <div className="text-slate-300 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap select-all pt-4">
              {prompt.description || "System syntax core is empty."}
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center tracking-wide font-mono">
            Execute action via terminal control block triggers above
          </p>
        </div>
      </div>
    </div>
  );
}