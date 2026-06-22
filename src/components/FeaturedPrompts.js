// client/src/components/FeaturedPrompts.js বা আপনার হোমপেজের ভেতর
'use client';

import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FeaturedPrompts() {
    const axiosPublic = useAxiosPublic();

    const { data: featured = [], isLoading } = useQuery({
        queryKey: ['featuredPrompts'],
        queryFn: async () => {
            const res = await axiosPublic.get('/featured-prompts');
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Featured AI Prompts
                    </h2>
                    <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                        Explore top-rated, optimized prompts built by the community to supercharge your AI workflow.
                    </p>
                </div>

                {featured.length === 0 ? (
                    <p className="text-center text-gray-400 py-6">No approved public prompts available right now.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.slice(0, 6).map((prompt) => (
                            <div key={prompt._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start gap-2 mb-3">
                                        <span className="bg-cyan-50 text-cyan-700 text-xs font-bold px-2.5 py-1 rounded-lg">
                                            {prompt.aiTool}
                                        </span>
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${prompt.priceType === 'Premium' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                                            {prompt.priceType === 'Premium' ? `$${prompt.price}` : 'Free'}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{prompt.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-3 mb-4">{prompt.description}</p>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400">
                                    <span>By {prompt.creatorName || 'Anonymous'}</span>
                                    <span className="bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-md">{prompt.category}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}