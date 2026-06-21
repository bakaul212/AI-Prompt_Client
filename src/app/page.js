// client/src/app/page.js
'use client';

import Banner from "@/components/Banner";
import PromptCard from "@/components/PromptCard";
import WhyChooseUs from "@/components/WhyChooseUs";
import TopCreators from "@/components/TopCreators";
import useAxiosPublic from "@/hooks/useAxiosPublic";
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
    <div className="w-full bg-gray-50/50 pb-0">
      {/* ১. অ্যানিমেটেড হিরো ব্যানার সেকশন */}
      <Banner />

      {/* ২. ফিচার্ড প্রম্পটস সেকশন (সর্বোচ্চ ৬টি) */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-100 shadow-sm">
            🔥 Hot Picks
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-3">
            Featured AI Prompts
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-base text-gray-500">
            Explore the most popular, highly curated, and community-approved AI prompts.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p className="text-sm text-gray-400 font-medium animate-pulse">Loading amazing prompts...</p>
          </div>
        ) : featuredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          /* মডার্ন প্রিমিয়াম এম্পটি স্টেট ডিজাইন */
          <div className="text-center py-16 px-6 border border-dashed border-gray-300 rounded-2xl bg-gradient-to-b from-white to-gray-50 max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-cyan-50 text-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-cyan-100 shadow-sm text-2xl">
              ✨
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Marketplace is Getting Ready!</h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
              Currently, there are no approved public prompts available. Once creators submit prompts from their dashboard and admins approve them, they will shine right here!
            </p>
            <div className="mt-6 flex justify-center">
              <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-md font-medium border border-gray-200 shadow-sm">
                💡 Tip: Check back after adding prompts from Dashboard
              </span>
            </div>
          </div>
        )}
      </section>

      {/* ৩. ইনফর্মেটিভ Why Choose Us সেকশন */}
      <WhyChooseUs />

      {/* ৪. টপ প্রম্পট ক্রিয়েটরস সেকশন */}
      <TopCreators />
    </div>
  );
}