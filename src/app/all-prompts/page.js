'use client';

import { useState, useEffect } from 'react';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Link from 'next/link';
import { IoSearchOutline, IoFilterOutline, IoCopyOutline, IoEyeOutline, IoSparklesOutline } from 'react-icons/io5';

export default function AllPromptsPage() {
  const axiosPublic = useAxiosPublic();
  
  // State Management
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [aiTool, setAiTool] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // static options for filters
  const categories = ["Web Development", "Content Writing", "Data Science", "Design", "Marketing"];
  const aiTools = ["ChatGPT", "Midjourney", "Claude", "Gemini", "Stable Diffusion"];
  const difficulties = ["Beginner", "Intermediate", "Advanced", "Expert"];

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      try {
        // সার্ভার সাইড ফিল্টারিং কুয়েরি ইউআরএল জেনারেট করা
        const res = await axiosPublic.get(`/marketplace-prompts`, {
          params: {
            search,
            category,
            aiTool,
            difficulty,
            sort,
            page,
            limit: 6
          }
        });
        setPrompts(res.data.prompts || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (error) {
        console.error("Error connecting to matrix terminal:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debouncing or immediate fetch on change
    const delayDebounceFn = setTimeout(() => {
      fetchPrompts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, aiTool, difficulty, sort, page, axiosPublic]);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-20 px-4 md:px-8 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        
        {/* হেডার সেকশন */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-400">Prompt</span> Matrix
          </h1>
          <p className="text-slate-400 text-sm font-mono">// System Registry: Discover and execute vetted algorithmic blueprints.</p>
        </div>

        {/* সার্চ এবং ফিল্টারিং প্যানেল */}
        <div className="bg-[#0f1423]/40 border border-slate-800 p-6 rounded-2xl backdrop-blur-md grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* সার্চ ইনপুট */}
          <div className="md:col-span-4 relative">
            <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search title or tags..."
              className="w-full bg-[#07090e] border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* ক্যাটাগরি ফিল্টার */}
          <div className="md:col-span-2">
            <select
              className="w-full bg-[#07090e] border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono text-slate-400 focus:outline-none focus:border-blue-500"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* এআই টুল ফিল্টার */}
          <div className="md:col-span-2">
            <select
              className="w-full bg-[#07090e] border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono text-slate-400 focus:outline-none focus:border-blue-500"
              value={aiTool}
              onChange={(e) => { setAiTool(e.target.value); setPage(1); }}
            >
              <option value="">All AI Tools</option>
              {aiTools.map((tool) => <option key={tool} value={tool}>{tool}</option>)}
            </select>
          </div>

          {/* ডিফিকাল্টি ফিল্টার */}
          <div className="md:col-span-2">
            <select
              className="w-full bg-[#07090e] border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono text-slate-400 focus:outline-none focus:border-blue-500"
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            >
              <option value="">All Difficulty</option>
              {difficulties.map((diff) => <option key={diff} value={diff}>{diff}</option>)}
            </select>
          </div>

          {/* সর্টিং অপশন */}
          <div className="md:col-span-2">
            <select
              className="w-full bg-[#07090e] border border-slate-800 rounded-xl py-3 px-4 text-xs font-mono text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              <option value="latest">Sort: Latest</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="copied">Sort: Most Copied</option>
            </select>
          </div>

        </div>

        {/* প্রম্পটস গ্রিড সেকশন */}
        {loading ? (
          <div className="text-center py-24 font-mono text-xs text-slate-500 animate-pulse">[LOADING ARRAYS FROM CORE GRID...]</div>
        ) : prompts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl font-mono text-xs text-slate-500">
            [ZERO INDEX RESULTS]: No matches found for current query matrices.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <div key={prompt._id} className="group bg-[#0f1423]/20 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/[0.02]">
                
                <div className="space-y-4">
                  {/* ক্যাটাগরি ও এআই টুল ট্যাগ */}
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-wider uppercase">
                    <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">{prompt.category}</span>
                    <span className="text-slate-400 bg-slate-800 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <IoSparklesOutline className="text-amber-400" /> {prompt.aiTool}
                    </span>
                  </div>

                  {/* টাইটেল */}
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {prompt.title}
                  </h3>

                  {/* ডেসক্রিপশন স্নীপেট */}
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
                    {prompt.description || "No validation string metadata provided."}
                  </p>
                </div>

                {/* মেটাডাটা ও অ্যাকশন বাটন */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500">CREATOR</p>
                    <p className="text-slate-300 font-bold max-w-[120px] truncate">{prompt.creatorName || "Anonymous Node"}</p>
                  </div>

                  <div className="flex items-center gap-4 text-slate-400">
                    <span className="flex items-center gap-1 text-[11px]">
                      <IoCopyOutline size={14} className="text-slate-500" /> {prompt.copyCount || 0}
                    </span>
                    
                    <Link href={`/prompt/${prompt._id}`}>
                      <button className="bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 font-bold group-hover:scale-105">
                        <IoEyeOutline size={14} /> Details
                      </button>
                    </Link>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* পেজিনেশন কন্ট্রোল */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6 font-mono text-xs">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              &lt; PREV_NODE
            </button>
            <span className="text-slate-400">
              [ PAGE <span className="text-blue-400 font-bold">{page}</span> OF {totalPages} ]
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              NEXT_NODE &gt;
            </button>
          </div>
        )}

      </div>
    </div>
  );
}