'use client';

import { useState, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { AuthContext } from '@/providers/AuthProvider';

export default function EditPromptPage() {
    const axiosPublic = useAxiosPublic();
    const router = useRouter();
    const { id } = useParams(); 
    const { user } = useContext(AuthContext);

    // ১. ডাটাবেজ থেকে নির্দিষ্ট প্রম্পটের ডেটা আনা (টোকেন হেডার সহ)
    const { data: prompt, isLoading } = useQuery({
        queryKey: ['prompt', id],
        queryFn: async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
            const res = await axiosPublic.get(`/prompt/${id}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            return res.data;
        }
    });

    // ফর্ম স্টেট
    const [userChanges, setUserChanges] = useState({});

    // ২. রিঅ্যাক্ট কোয়েরি মিউটেশন দিয়ে ডেটা আপডেট (টোকেন হেডার সহ)
    const updatePromptMutation = useMutation({
        mutationFn: async (updatedPrompt) => {
            const { _id, creatorEmail, creatorName, createdAt, status, ...cleanData } = updatedPrompt;
            const token = typeof window !== 'undefined' ? localStorage.getItem('access-token') : null;
            
            // রিকোয়েস্টের সাথে headers পাস করা হলো যাতে verifyToken সফল হয়
            const res = await axiosPublic.put(`/prompt/${id}`, cleanData, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            return res.data;
        },
        onSuccess: (data) => {
            if (data.modifiedCount > 0 || data.acknowledged) {
                alert('🚀 Prompt updated successfully! Pending admin re-approval.');
                router.push('/dashboard/my-prompts'); 
            } else {
                alert('⚠️ No changes were modified.');
                router.push('/dashboard/my-prompts');
            }
        },
        onError: (error) => {
            console.error('Update failed:', error);
            alert(`Failed to update prompt: ${error.response?.data?.message || error.message}`);
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserChanges(prev => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) || 0 : value
        }));
    };

    const currentFormData = {
        title: prompt?.title || '',
        description: prompt?.description || '',
        category: prompt?.category || 'Coding',
        aiTool: prompt?.aiTool || 'ChatGPT',
        priceType: prompt?.priceType || 'Free',
        price: prompt?.price || 0,
        visibility: prompt?.visibility || 'Public',
        ...userChanges 
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updatePromptMutation.mutate(currentFormData);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-xl my-6">
            <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-gray-950">✏️ Edit Your Prompt</h2>
                <p className="text-gray-400 text-sm mt-1">Modify your AI configuration settings below.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prompt Title</label>
                    <input
                        type="text"
                        name="title"
                        value={currentFormData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                        <select
                            name="category"
                            value={currentFormData.category}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="Coding">Coding</option>
                            <option value="Writing">Writing</option>
                            <option value="Design">Design</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">AI Tool</label>
                        <select
                            name="aiTool"
                            value={currentFormData.aiTool}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="ChatGPT">ChatGPT</option>
                            <option value="Midjourney">Midjourney</option>
                            <option value="Claude">Claude</option>
                            <option value="Stable Diffusion">Stable Diffusion</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Price Type</label>
                        <select
                            name="priceType"
                            value={currentFormData.priceType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="Free">Free</option>
                            <option value="Premium">Premium</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            disabled={currentFormData.priceType === 'Free'}
                            value={currentFormData.priceType === 'Free' ? 0 : currentFormData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Visibility</label>
                        <select
                            name="visibility"
                            value={currentFormData.visibility}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
                        >
                            <option value="Public">Public</option>
                            <option value="Private">Private</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Prompt Instruction / Description</label>
                    <textarea
                        name="description"
                        value={currentFormData.description}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-500 transition-all text-sm resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.push('/dashboard/my-prompts')}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updatePromptMutation.isPending}
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-md disabled:opacity-50"
                    >
                        {updatePromptMutation.isPending ? 'Saving Changes...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}