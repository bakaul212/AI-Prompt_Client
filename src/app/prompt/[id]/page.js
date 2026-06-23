'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Link from 'next/link';
import { useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '@/providers/AuthProvider';
import { IoBookmark, IoBookmarkOutline, IoCopyOutline, IoAlertCircleOutline, IoStar, IoLockClosedOutline } from 'react-icons/io5';

export default function PromptDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const axiosPublic = useAxiosPublic();
  const queryClient = useQueryClient();
  
  // গ্লোবাল সেশন থেকে রিয়েল ইউজার ডাটা ইন্টিগ্রেশন
  const { user } = useContext(AuthContext);

  const [copied, setCopied] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDesc, setReportDesc] = useState('');
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  // ডাটা ফেচিং
  const { data: serverPayload = {}, isLoading } = useQuery({
    queryKey: ['promptDetails', id, user?.email],
    queryFn: async () => {
      const res = await axiosPublic.get(`/prompt/${id}?email=${user?.email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    },
    enabled: !!id && !!user?.email
  });

  const { prompt = {}, isPremiumUser = false, isBookmarked = false, reviews = [] } = serverPayload;

  // রিকোয়ারমেন্টের মূল শর্ত: পাবলিক নাকি প্রিমিয়াম ভিউ অ্যাক্সেস
  const hasAccess = prompt.visibility === 'Public' || isPremiumUser;

  // বুকমার্ক টগল মিউটেশন
  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosPublic.post('/prompt/bookmark', { promptId: id, userEmail: user?.email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['promptDetails', id, user?.email]);
      if (data.action === 'added') toast.success('Prompt successfully bookmarked.');
      else toast.info('Bookmark removed from your profile.');
    }
  });

  // কপি প্রম্পট ও ডাটাবেজ কাউন্টার ট্রিগার
  const handleCopy = async () => {
    if (!hasAccess) {
      toast.error("Execution blocked: Subscription required.");
      return;
    }
    if (prompt.promptContent || prompt.description) {
      const targetText = prompt.promptContent || prompt.description;
      navigator.clipboard.writeText(targetText);
      setCopied(true);
      toast.success("Prompt syntax successfully copied!");
      setTimeout(() => setCopied(false), 2000);

      await axiosPublic.patch(`/prompt/copy-count/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });
      queryClient.invalidateQueries(['promptDetails', id, user?.email]);
    }
  };

  // রিভিউ সাবমিশন
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    try {
      await axiosPublic.post('/prompt/review', {
        promptId: id,
        name: user?.displayName || "Anonymous Engineer",
        email: user?.email,
        rating: reviewRating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });

      toast.success("Review protocol logged into ledger.");
      setReviewComment('');
      queryClient.invalidateQueries(['promptDetails', id, user?.email]);
    } catch (err) {
      toast.error("Failed to authenticate review node.");
    }
  };

  // রিপোর্ট সাবমিশন
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPublic.post('/prompt/report', {
        promptId: id,
        userEmail: user?.email,
        reason: reportReason,
        description: reportDesc
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      });

      toast.warn("Incident filed. Moderation team notified.");
      setReportModal(false);
      setReportDesc('');
    } catch (err) {
      toast.error("Report execution failed.");
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
      <ToastContainer theme="dark" />
      
      {/* গ্লো ইফেক্টস */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* টপ মেটা বার */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/prompts" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-400 transition-colors">
            ← Central Hub
          </Link>
          
          <div className="flex gap-4">
            <button onClick={() => bookmarkMutation.mutate()} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-indigo-500/40 text-slate-400 transition-all">
              {isBookmarked ? <IoBookmark size={18} className="text-indigo-400" /> : <IoBookmarkOutline size={18} />}
            </button>
            <button onClick={() => setReportModal(true)} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl hover:border-rose-500/40 text-slate-400 transition-all">
              <IoAlertCircleOutline size={18} className="hover:text-rose-400" />
            </button>
          </div>
        </div>

        {/* মেইন ডাটা প্যানেল */}
        <div className="backdrop-blur-md bg-[#0f1423]/30 border border-slate-800/80 rounded-2xl p-6 md:p-10 shadow-2xl mb-10">
          
          {/* রিকোয়ারমেন্টের সমস্ত ব্যাজ ও লেভেলসমূহ */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-mono uppercase px-2.5 py-1 rounded-md">🤖 System: {prompt.aiTool || 'Generic'}</span>
            <span className="bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-mono uppercase px-2.5 py-1 rounded-md">📁 Class: {prompt.category || 'Standard'}</span>
            <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono px-2.5 py-1 rounded-md">📊 Difficulty: {prompt.difficultyLevel || 'Intermediate'}</span>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono px-2.5 py-1 rounded-md">📋 Copies Run: {prompt.copyCount || 0}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white mb-4 leading-tight">{prompt.title}</h1>
          <p className="text-sm text-slate-400 font-normal leading-relaxed mb-6">{prompt.description}</p>

          {/* রিকোয়ারমেন্ট অনুযায়ী কাস্টম ট্যাগ্স */}
          {prompt.tags && (
            <div className="flex flex-wrap gap-1.5 mb-8">
              {prompt.tags.split(',').map((tag, i) => (
                <span key={i} className="text-[10px] bg-slate-900/80 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">#{tag.trim()}</span>
              ))}
            </div>
          )}

          {/* ইউজার কন্টেন্ট সিকিউরিটি টার্মিনাল */}
          <div className="relative rounded-xl border border-slate-800/90 bg-[#07090e] p-6 md:p-8 overflow-hidden min-h-[160px] flex flex-col justify-center mb-8">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>
            
            {hasAccess ? (
              <>
                <button onClick={handleCopy} className="absolute top-4 right-4 bg-slate-900 text-slate-400 border border-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg hover:text-white flex items-center gap-1.5 transition-all">
                  <IoCopyOutline /> {copied ? 'Copied!' : 'Copy Core Script'}
                </button>
                <div className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap select-all pt-4">
                  <span className="text-emerald-400 block text-xs font-bold uppercase tracking-widest mb-2 font-sans">// Executable Content:</span>
                  {prompt.promptContent || "System template body execution ready."}
                </div>
              </>
            ) : (
              /* রিকোয়ারমেন্ট শর্ত: Private/Premium হলে কন্টেন্ট ব্লার হবে ও সাবস্ক্রিপশন ব্লক আসবে */
              <div className="text-center py-6 backdrop-blur-sm relative z-20">
                <div className="text-slate-600 font-mono text-xs select-none blur-[6px] mb-4">
                  CRITICAL CODE PROTOCOL BLOCKED SUB-SYSTEM INTERACTIVE SYNTRACT DATA ENCRYPTION EXPANSION...
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-4 rounded-xl">
                  <IoLockClosedOutline className="text-amber-400 mb-2" size={24} />
                  <p className="text-xs text-slate-300 max-w-xs mb-4">This high-tier asset syntax belongs to a Private Premium grid.</p>
                  <button onClick={() => router.push('/payment')} className="bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xs py-2.5 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform uppercase tracking-wider">
                    Subscribe to Premium
                  </button>
                </div> 
                </>
            )}
          </div>

          {/* রিকোয়ারমেন্ট: Usage Instructions & Creator Profile */}
          {hasAccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800/60 text-xs">
              <div>
                <h4 className="font-bold text-slate-200 uppercase tracking-wider mb-2 text-[11px] text-indigo-400">// Execution Guide</h4>
                <p className="text-slate-400 font-mono leading-relaxed">{prompt.usageInstructions || "Deploy this syntax into target LLM environment inputs directly."}</p>
              </div>
              <div className="flex items-start gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
                <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-md flex items-center justify-center text-xs font-black text-white">{prompt.creatorName ? prompt.creatorName[0].toUpperCase() : 'F'}</div>
                <div>
                  <h5 className="font-bold text-slate-200">Architect Contact</h5>
                  <p className="text-slate-400 text-[11px] mt-0.5">Name: {prompt.creatorName || 'Anonymous creator'}</p>
                  <p className="text-slate-500 text-[10px] font-mono mt-0.5">Email: {prompt.creatorEmail || 'Not declared'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* রিকোয়ারমেন্ট: রিভিউ ও রেটিং ডাইনামিক ফিড */}
        {hasAccess && (
          <div className="bg-[#0f1423]/20 border border-slate-800/60 rounded-2xl p-6 md:p-10 mb-10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">// User Evaluation Logs</h3>
            
            <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400">Assign Weight:</span>
                <select value={reviewRating} onChange={(e) => setReviewRating(e.target.value)} className="bg-slate-900 border border-slate-800 rounded-md text-xs p-1 text-amber-400 font-bold">
                  {[5,4,3,2,1].map(n => <option key={n} value={n}>⭐ {n}.0</option>)}
                </select>
              </div>
              <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Log operation logs, validation responses..." className="w-full bg-[#07090e] border border-slate-800/80 rounded-xl p-4 text-xs font-mono text-slate-300 focus:outline-none focus:border-indigo-500" rows={3} required />
              <button type="submit" className="bg-indigo-600 text-white font-bold text-xs py-2 px-5 rounded-lg hover:bg-indigo-500 transition-colors uppercase tracking-widest">Deploy Review</button>
            </form>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="bg-slate-900/40 border border-slate-800/50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">{rev.name} <span className="text-[10px] font-mono text-slate-500">({rev.email})</span></h5>
                        <span className="text-[9px] text-slate-500 font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => <IoStar key={i} size={11} />)}
                      </div>
                    </div>
                    <p className="text-xs font-normal text-slate-400 font-mono leading-relaxed">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 font-mono">// No execution feedback logged for this script block yet.</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* রিপোর্ট সাবমিশন মডাল ওভারলে */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0f1423] border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">File Security Incident Report</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Violation Type</label>
                <select value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2.5 text-slate-300 focus:outline-none">
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Spam">Spam Node Injection</option>
                  <option value="Copyright Violation">Copyright / Intellectual Property Breach</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1.5">Contextual Breakdown</label>
                <textarea value={reportDesc} onChange={(e) => setReportDesc(e.target.value)} placeholder="Provide specific error dumps or licensing violations..." className="w-full bg-[#07090e] border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none" rows={4} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setReportModal(false)} className="text-xs font-bold text-slate-500 hover:text-slate-400 uppercase">Cancel</button>
                <button type="submit" className="bg-rose-600 text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-rose-500 uppercase">Transmit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}