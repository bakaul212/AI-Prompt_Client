'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPublic from '@/hooks/useAxiosSecure';

export default function RegisterPage() {
    const { signInWithGoogle } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const name = form.name.value;
        const email = form.email.value;
        const photoURL = form.photoURL.value;
        const password = form.password.value;

        try {
            // ১. ফায়ারবেস দিয়ে ইউজার তৈরি
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            // ২. প্রোফাইল আপডেট
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photoURL
            });

            // ৩. মঙ্গোডিবি ব্যাকএন্ডে ডেটা সিঙ্ক করা
            const saveUser = { name, email, photoURL };
            const res = await axiosPublic.post('/users', saveUser);

            if (res.data.insertedId || res.data.message === 'User already exists') {
                toast.success('Account initialized successfully!');
                form.reset();
                router.push('/'); 
            }
        } catch (error) {
            toast.error(error.message || 'Initialization failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            
            const saveUser = {
                name: result?.user?.displayName || "Forge User",
                email: result?.user?.email,
                photoURL: result?.user?.photoURL || ""
            };

            await axiosPublic.post('/users', saveUser);

            toast.success('Account forged via Google!');
            router.push('/');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0a0d14] to-[#0d111a] flex items-center justify-center p-6 py-12">
            <ToastContainer theme="dark" />
            <div className="bg-[#0f1423]/60 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-md w-full border border-slate-800/80">
                <div className="text-center mb-6">
                    <span className="text-xl">✨</span>
                    <h2 className="text-2xl font-black tracking-tight text-white mt-2">Create Account</h2>
                    <p className="text-xs text-slate-400 mt-1">Join the premier prompt engineering ecosystem</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" placeholder="name@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Photo URL</label>
                        <input type="url" name="photoURL" required className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" placeholder="https://example.com/photo.jpg" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
                        <input type="password" name="password" required className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" placeholder="••••••••" />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.2)] transition-all text-sm mt-6">
                        {loading ? 'Initializing Profile...' : 'Sign Up'}
                    </button>
                </form>

                <div className="relative flex py-5 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">Or Connect with</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-800/40 text-slate-200 font-medium py-2.5 rounded-xl transition-all text-sm">
                    🌐 Google Sync
                </button>

                <p className="text-center text-xs text-slate-400 mt-6">
                    Already part of the network? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Login</Link>
                </p>
            </div>
        </div>
    );
}