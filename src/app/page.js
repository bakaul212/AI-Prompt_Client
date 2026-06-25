'use client';

import Banner from "@/components/Banner";
import PromptCard from "@/components/PromptCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TopCreators from "@/components/TopCreators";
import CustomerReviews from "@/components/CustomerReviews";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import useAxiosPublic from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const axiosPublic = useAxiosPublic();

  // React Query দিয়ে ব্যাকএন্ড থেকে ফিচার্ড প্রম্পট ডাটা রিড করা
  const { data: featuredPrompts = [], isLoading } = useQuery({
    queryKey: ['featuredPrompts'],
    queryFn: async () => {
      const res = await axiosPublic.get('/featured-prompts');
      return res.data;
    }
  });

  return (
    <div className="w-full bg-[#0a0d14] pb-12">
      {/* ১. অ্যানিমেটেড হিরো ব্যানার সেকশন */}
      <Banner />

      {/* ২. ফিচার্ড প্রম্পটস সেকশন (সর্বোচ্চ ৬টি) */}
      <section className="max-w-7xl mx-auto px-4 py-24 relative">
        {/* ব্যাকগ্রাউন্ড লাইটিং এক্সেন্ট */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-sm">
            ✨ Curated Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mt-4">
            Engineered AI Templates
          </h2>
          <p className="max-w-md mx-auto mt-3 text-sm text-slate-400 leading-relaxed">
            Deploy production-ready prompt architecture vetted by our top engineering community.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">Syncing catalog data...</p>
          </div>
        ) : featuredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          /* ইউনিক ডার্ক এম্পটি স্টেট ডিজাইন */
          <div className="text-center py-16 px-6 border border-slate-800/80 rounded-2xl bg-[#0f1423]/40 max-w-2xl mx-auto shadow-xl relative z-10">
            <div className="w-14 h-14 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-5 border border-slate-800 shadow-inner text-xl">
              📂
            </div>
            <h4 className="text-lg font-bold text-slate-200 mb-2 tracking-tight">Ecosystem Initializing</h4>
            <p className="text-slate-400 text-xs max-w-sm mx-auto leading-relaxed">
              No public prompts have cleared the verification gate yet. Submissions by creators will appear on this shelf once authorized.
            </p>
            <div className="mt-6 flex justify-center">
              <span className="text-[10px] bg-slate-900 text-slate-500 px-3 py-1.5 rounded-lg font-mono border border-slate-800/60">
                pipeline status: awaiting submissions
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ৩. ইনফর্মেティブ Why Choose Us সেকশন */}
      <WhyChooseUs />

      {/* ৪. টপ প্রম্পট ক্রিয়েটরস সেকশন */}
      <TopCreators />

      {/* ৫. কাস্টমার রিভিউ সেকশন (অ্যানিমেটেড) */}
      <CustomerReviews />

      {/* ৬. প্ল্যাটফর্ম স্ট্যাটস/মেট্রিক্স সেকশন (এক্সট্রা সেকশন ১) */}
      <StatsSection />

      {/* ৭. কল-টু-অ্যাকশন টার্মিনাল সেকশন (এক্সট্রা সেকশন ২) */}
      <CTASection />
    </div>
  );
}