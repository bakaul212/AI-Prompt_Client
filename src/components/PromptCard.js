'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider'; 

export default function PromptCard({ prompt }) {
  const { _id, title, description, category, aiTool, priceType, price, creatorName } = prompt;
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const handleViewDetails = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  const getToolBadgeColor = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'midjourney': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'chatgpt': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'claude': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    }
  };

  return (
    <div className="group relative bg-[#0f1423]/40 backdrop-blur-md rounded-2xl border border-slate-800/80 p-4 sm:p-5 md:p-6 shadow-xl hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)] hover:border-slate-700/80 md:hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden w-full">
      {/* top line neon */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Badges Container - মোবাইল ফ্রেন্ডলি টেক্সট সাইজ */}
        <div className="flex justify-between items-center gap-2 mb-4 sm:mb-5">
          <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-lg border uppercase tracking-widest truncate max-w-[120px] ${getToolBadgeColor(aiTool)}`}>
            🤖 {aiTool || 'AI Tool'}
          </span>
          <span className={`text-[9px] sm:text-[10px] font-black px-2 py-0.5 sm:py-1 rounded-lg border tracking-wider shrink-0 ${
            priceType === 'Premium' 
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {priceType === 'Premium' ? `💎 $${price}` : '⚡ Free'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base sm:text-lg font-bold text-slate-100 mb-1.5 sm:mb-2 tracking-tight group-hover:text-indigo-400 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed line-clamp-3 mb-4 sm:mb-6 font-normal">
          {description}
        </p>
      </div>

      <div>
        {/* Author & Core Info - মোবাইলে উইডথ ক্র্যাশ ঠেকাতে flex-wrap/truncate টিউনিং */}
        <div className="border-t border-slate-800/80 pt-3 sm:pt-4 flex justify-between items-center text-xs mb-4 sm:mb-5 gap-2">
          <span className="flex items-center gap-1.5 font-medium text-slate-300 min-w-0 flex-1">
            <span className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-md flex items-center justify-center text-[9px] sm:text-[10px] font-black shrink-0">
              {creatorName ? creatorName[0].toUpperCase() : 'F'}
            </span>
            <span className="truncate text-[11px] sm:text-xs">{creatorName || 'Forge Agent'}</span>
          </span>
          <span className="bg-slate-900 text-slate-400 font-mono text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded border border-slate-800 truncate max-w-[90px] sm:max-w-none">
            {category}
          </span>
        </div>

        {/* Action Call */}
        <div className="flex items-center gap-3">
          <Link 
            href={`/prompt/${_id}`} 
            onClick={handleViewDetails}
            className="w-full bg-slate-900 border border-slate-800 hover:border-indigo-500/50 md:group-hover:bg-gradient-to-r md:group-hover:from-indigo-600 md:group-hover:to-violet-600 text-slate-200 md:group-hover:text-white font-semibold text-[11px] sm:text-xs py-2 sm:py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 shadow-inner"
          >
            Inspect System
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}