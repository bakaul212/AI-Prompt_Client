// client/src/app/dashboard/my-prompts/page.js
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import Link from 'next/link';

export default function MyPromptsPage() {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();

    const { data: myPrompts = [], isLoading } = useQuery({
        queryKey: ['myPrompts', user?.email],
        enabled: !!user?.email, // ইউজার ইমেইল পেলেই কেবল এপিআই কল হবে
        queryFn: async () => {
            const res = await axiosPublic.get(`/my-prompts?专email=${user?.email}`);
            return res.data;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Submitted Prompts</h2>
                        <p className="text-gray-500 text-sm mt-1">Track the approval status and configurations of your AI prompts.</p>
                    </div>
                    <Link href="/dashboard/add-prompt" className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition shadow-sm">
                        + Add New Prompt
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
                    </div>
                ) : myPrompts.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">AI Tool</th>
                                    <th className="px-6 py-4">Price Type</th>
                                    <th className="px-6 py-4">Visibility</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white text-gray-600 font-medium">
                                {myPrompts.map((prompt) => (
                                    <tr key={prompt._id} className="hover:bg-gray-50/70 transition">
                                        <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{prompt.title}</td>
                                        <td className="px-6 py-4">{prompt.aiTool}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${prompt.priceType === 'Premium' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                                                {prompt.priceType === 'Premium' ? `$${prompt.price}` : 'Free'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">{prompt.visibility}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${prompt.status === 'approved' ? 'bg-green-100 text-green-800' : prompt.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {prompt.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                        <p className="text-gray-400 font-medium">You haven't submitted any prompts yet.</p>
                        <p className="text-gray-400 text-xs mt-1">Click the button above to create your first asset!</p>
                    </div>
                )}
            </div>
        </div>
    );
}