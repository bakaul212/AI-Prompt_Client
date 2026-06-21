// client/src/app/dashboard/add-prompt/page.js
'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import useAxiosPublic from '@/hooks/useAxiosPublic';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddPromptPage() {
    const { user } = useContext(AuthContext);
    const axiosPublic = useAxiosPublic();
    const router = useRouter();
    const [priceType, setPriceType] = useState('Free');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login first.');
            return;
        }

        setLoading(true);
        const form = e.target;
        
        const promptInfo = {
            title: form.title.value,
            description: form.description.value,
            category: form.category.value,
            aiTool: form.aiTool.value,
            priceType: priceType,
            price: priceType === 'Premium' ? form.price.value : 0,
            visibility: form.visibility.value,
            creatorEmail: user?.email,
            creatorName: user?.displayName
        };

        try {
            const res = await axiosPublic.post('/add-prompt', promptInfo);
            if (res.data.insertedId) {
                toast.success('Prompt submitted successfully! Waiting for admin approval.');
                form.reset();
                setPriceType('Free');
                setTimeout(() => router.push('/all-prompts'), 2000);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Submit New AI Prompt</h2>
                    <p className="text-gray-500 mt-1.5 text-sm">Share your optimized instructions with the marketplace ecosystem.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prompt Title</label>
                        <input type="text" name="title" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition" placeholder="e.g., Ultra-Realistic Portrait Generator" />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Prompt Instructions & Description</label>
                        <textarea name="description" rows="5" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition resize-none" placeholder="Paste the exact prompt syntax and explain how to use it..."></textarea>
                    </div>

                    {/* Category & AI Tool Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select name="category" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition text-sm">
                                <option value="Coding">Coding</option>
                                <option value="Writing">Writing</option>
                                <option value="Design">Design</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target AI Tool</label>
                            <select name="aiTool" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition text-sm">
                                <option value="ChatGPT">ChatGPT</option>
                                <option value="Midjourney">Midjourney</option>
                                <option value="Claude">Claude</option>
                                <option value="Stable Diffusion">Stable Diffusion</option>
                            </select>
                        </div>
                    </div>

                    {/* Price Type & Price input conditional rendering */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price Type</label>
                            <select 
                                value={priceType} 
                                onChange={(e) => setPriceType(e.target.value)}
                                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition text-sm"
                            >
                                <option value="Free">Free</option>
                                <option value="Premium">Premium</option>
                            </select>
                        </div>

                        {/* ডায়নামিক ফিল্ড: শুধুমাত্র Premium সিলেক্ট করলে ওপেন হবে */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Price (USD)</label>
                            <input 
                                type="number" 
                                name="price" 
                                step="0.01"
                                disabled={priceType === 'Free'}
                                required={priceType === 'Premium'}
                                className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition disabled:bg-gray-200 disabled:cursor-not-allowed" 
                                placeholder={priceType === 'Free' ? '0.00 (Locked)' : 'e.g., 4.99'} 
                            />
                        </div>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Visibility</label>
                        <select name="visibility" required className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-cyan-500 bg-gray-50/50 outline-none transition text-sm">
                            <option value="Public">Public (Show on Marketplace)</option>
                            <option value="Private">Private (Personal Use Only)</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-xl transition shadow-md mt-4 disabled:opacity-50">
                        {loading ? 'Submitting configurations...' : 'Publish to Marketplace'}
                    </button>
                </form>
            </div>
        </div>
    );
}