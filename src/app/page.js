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
    <div className="w-full bg-[#0a0d14] pb-8 sm:pb-12 overflow-x-hidden">
      {/* ১. অ্যানিমেটেড হিরো ব্যানার সেকশন */}
      <Banner />

      {/* ২. ফিচার্ড প্রম্পটস সেকশন (সর্বোচ্চ ৬টি) - রেসপনসিভ প্যাডিং সহ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 relative">
        
        {/* ব্যাকগ্রাউন্ড লাইটিং এক্সেন্ট - মোবাইলের জন্য উইডথ সামঞ্জস্য করা হয়েছে */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 sm:w-72 md:w-80 h-48 sm:h-72 md:h-80 bg-indigo-500/5 rounded-full blur-[60px] sm:blur-[100px] pointer-events-none"></div>

        {/* সেকশন হেডার - রেসপনসিভ মার্জিন ও টেক্সট সাইজ */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 relative z-10 max-w-2xl mx-auto px-2">
          <span className="inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20 shadow-sm">
            ✨ Curated Collections
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight mt-3 sm:mt-4">
            Engineered AI Templates
          </h2>
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
            Deploy production-ready prompt architecture vetted by our top engineering community.
          </p>
        </div>

        {/* ডাটা লোডিং স্টেট */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 sm:py-20 gap-3 sm:gap-4">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">Syncing catalog data...</p>
          </div>
        ) : featuredPrompts.length > 0 ? (
          /* 📦 আল্ট্রা-রেসপনসিভ গ্রিড: মোবাইল: ১টি | ট্যাবলেট: ২টি | ল্যাপটপ ও ডেসকটপ: ৩টি কার্ড পাশাপাশি বসবে */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 relative z-10">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          /* ইউনিক ডার্ক এম্পটি স্টেট ডিজাইন - মোবাইলে স্ক্রিন ফিট প্যাডিং */
          <div className="text-center py-12 sm:py-16 px-4 sm:px-6 border border-slate-800/80 rounded-2xl bg-[#0f1423]/40 max-w-2xl mx-auto shadow-xl relative z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900 text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-slate-800 shadow-inner text-lg sm:text-xl">
              📂
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-200 mb-2 tracking-tight">Ecosystem Initializing</h4>
            <p className="text-slate-400 text-[11px] sm:text-xs max-w-sm mx-auto leading-relaxed">
              No public prompts have cleared the verification gate yet. Submissions by creators will appear on this shelf once authorized.
            </p>
            <div className="mt-5 sm:mt-6 flex justify-center">
              <span className="text-[9px] sm:text-[10px] bg-slate-900 text-slate-500 px-2.5 py-1.5 rounded-lg font-mono border border-slate-800/60">
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

      {/* ৬. প্ল্যাটফর্ম স্ট্যাটস/মেট্রিক্স সেকশন */}
      <StatsSection />

      {/* ৭. কল-টু-অ্যাকশন টার্মিনাল সেকশন */}
      <CTASection />
    </div>
  );
}