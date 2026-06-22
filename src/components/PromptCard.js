// client/src/components/PromptCard.js
'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/providers/AuthProvider'; 

export default function PromptCard({ prompt }) {
  const { _id, title, description, category, aiTool, priceType, price, creatorName } = prompt;
  const router = useRouter();
  
  // গ্লোবাল স্টেট থেকে ইউজার ও লোডিং আনা হলো
  const { user, loading } = useContext(AuthContext);

  const handleViewDetails = (e) => {
    if (loading) {
      e.preventDefault();
      return;
    }

    // লগইন ছাড়া ক্লিক করলেই কোনো অ্যালার্ট ছাড়াই সরাসরি রিডাইরেক্ট হবে
    if (!user) {
      e.preventDefault();
      router.push('/login');
    }
  };

  // AI Tool অনুযায়ী ব্যাকগ্রাউন্ড কালার
  const getToolBadgeColor = (tool) => {
    switch (tool?.toLowerCase()) {
      case 'midjourney': return 'bg-purple-50 text-purple-700 border-purple-250';
      case 'chatgpt': return 'bg-emerald-50 text-emerald-700 border-emerald-250';
      case 'claude': return 'bg-amber-50 text-amber-700 border-amber-250';
      default: return 'bg-cyan-50 text-cyan-700 border-cyan-250';
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Badges */}
        <div className="flex justify-between items-center gap-2 mb-5">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border uppercase tracking-wider shadow-sm ${getToolBadgeColor(aiTool)}`}>
            🚀 {aiTool || 'AI Tool'}
          </span>
          <span className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border shadow-sm ${
            priceType === 'Premium' ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent' : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {priceType === 'Premium' ? `💎 $${price}` : '🎉 Free'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-extrabold text-gray-950 mb-2 tracking-tight group-hover:text-cyan-600 transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
          {description}
        </p>
      </div>

      <div>
        {/* Footer info */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400 mb-5">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <span className="w-6 h-6 bg-gradient-to-tr from-cyan-500 to-purple-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
              {creatorName ? creatorName[0].toUpperCase() : 'U'}
            </span>
            By {creatorName || 'Anonymous'}
          </span>
          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide text-[10px]">
            {category}
          </span>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link 
            href={`/prompt/${_id}`} 
            onClick={handleViewDetails}
            className="flex-1 bg-slate-950 hover:bg-gradient-to-r hover:from-cyan-600 hover:to-indigo-600 text-white font-bold text-sm py-3 px-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-cyan-200 flex items-center justify-center gap-2"
          >
            View Details
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}