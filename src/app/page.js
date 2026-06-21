// client/src/app/page.js
'use client';

import Banner from "@/components/Banner";
import PromptCard from "@/components/PromptCard";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

export default function HomePage() {
  const axiosPublic = useAxiosPublic();

  // React Query দিয়ে ব্যাকএন্ড থেকে ফিচার্ড প্রম্পট ডাটা রিড করা
  const { data: featuredPrompts = [], isLoading } = useQuery({
    queryKey: ['featuredPrompts'],
    queryFn: async () => {
      const res = await axiosPublic.get('/featured-prompts');
      return res.data;
    }
  });

  return (
    <div className="w-full bg-gray-50/50 pb-16">
      {/* 1. Hero Banner Section */}
      <Banner />

      {/* 2. Featured Prompts Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Featured AI Prompts
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-lg text-gray-500 sm:mt-4">
            Explore the most popular, highly curated, and community-approved AI prompts.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
          </div>
        ) : featuredPrompts.length > 0 ? (
          // Responsive Grid Layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white max-w-md mx-auto">
            <p className="text-gray-400 font-medium">No featured prompts available right now.</p>
            <p className="text-gray-400 text-xs mt-1">Add prompts from dashboard and approve them to display here.</p>
          </div>
        )}
      </section>
    </div>
  );
}