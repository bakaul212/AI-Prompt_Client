// client/src/app/prompt/[id]/page.js
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

  // প্রম্পট টেক্সট কপি করার ফাংশন
  const handleCopy = () => {
    if (prompt.description) {
      navigator.clipboard.writeText(prompt.description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center gap-4">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-cyan-400"></div>
        <p className="text-cyan-400 font-medium tracking-widest animate-pulse">FETCHING PROMPT DETAILS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white py-16 px-4 relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড নিয়ন গ্লো ইফেক্টস */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* ব্যাক বাটন */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-cyan-400 transition-colors group mb-8">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Marketplace
        </Link>

        {/* মেইন গ্লাস-কার্ড কন্টেইনার */}
        <div className="backdrop-blur-xl bg-slate-900/40 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl shadow-black/50 animate-fade-in">
          
          {/* ব্যাজ এবং হেডার সেকশন */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-inner">
              🤖 {prompt.aiTool || 'AI Tool'}
            </span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl">
              📁 {prompt.category || 'Category'}
            </span>
            <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl uppercase border tracking-wider ml-auto ${
              prompt.priceType === 'Premium' 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              {prompt.priceType === 'Premium' ? `💎 Premium ($${prompt.price})` : '🎉 Free'}
            </span>
          </div>

          {/* টাইটেল */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4">
            {prompt.title}
          </h1>

          {/* ক্রিয়েটর ইনফো */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-slate-800/60 mb-8">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg">
              {prompt.creatorName ? prompt.creatorName[0].toUpperCase() : 'U'}
            </div>
            <p className="text-sm text-slate-400 font-medium">
              Curated by <span className="text-slate-200 font-bold">{prompt.creatorName || 'Anonymous'}</span>
            </p>
          </div>

          {/* প্রম্পট ডিসপ্লে এরিয়া (কোড ব্লক ডিজাইন) */}
          <div className="relative group/code rounded-2xl border border-slate-800 bg-slate-950/80 p-6 md:p-8 shadow-inner overflow-hidden mb-6">
            
            {/* কালারফুল টপ বার */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500"></div>
            
            {/* কপি বাটন */}
            <button 
              onClick={handleCopy}
              className={`absolute top-4 right-4 z-20 px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                copied 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy Prompt
                </>
              )}
            </button>

            {/* আসল প্রম্পট টেক্সট */}
            <div className="text-slate-200 font-mono text-sm md:text-base leading-relaxed whitespace-pre-wrap select-all selection:bg-cyan-500/30 pt-4">
              {prompt.description || "Prompt instructions or description text will appear here once connected."}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center tracking-wide font-mono">
            💡 Use the copy button above to quickly copy this prompt to your clipboard.
          </p>

        </div>
      </div>
    </div>
  );
}