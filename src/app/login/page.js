'use client';

// 🛠️ useEffect ইমপোর্ট করা হয়েছে
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPublic from '@/hooks/useAxiosSecure';

export default function LoginPage() {
    const { signInWithGoogle } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const axiosPublic = useAxiosPublic();

    // 🛠️ ডেমো ইউজারের ডেটা অটো-ফিলের জন্য নতুন স্টেট ডিক্লেয়ার করা হলো
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 🛠️ ডেমো ইউজার ম্যাট্রিক্স থেকে ডেটা ক্যাচ করার জন্য useEffect হুক
    useEffect(() => {
        const demoEmail = localStorage.getItem('demo-login-email');
        const demoPass = localStorage.getItem('demo-login-pass');
        
        if (demoEmail && demoPass) {
            setEmail(demoEmail);
            setPassword(demoPass);
            
            toast.success('Matrix Credentials Synced Successfully! ⚡', { autoClose: 2000 });

            // একবারে কাজ শেষ হয়ে গেলে স্টোরেজ ক্লিন করে ফেলা হলো
            localStorage.removeItem('demo-login-email');
            localStorage.removeItem('demo-login-pass');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🛠️ স্টেট থেকে সরাসরি ভ্যালু নেওয়া হচ্ছে
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Access Granted! Welcome Back.');
            setEmail('');
            setPassword('');
            router.push('/'); 
        } catch (error) {
            toast.error(error.message || 'Authentication failed. Please verify credentials.');
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

            toast.success('Logged in securely with Google!');
            router.push('/');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-gradient-to-b from-[#0a0d14] to-[#0d111a] flex items-center justify-center p-6">
            <ToastContainer theme="dark" />
            <div className="bg-[#0f1423]/60 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] max-w-md w-full border border-slate-800/80">
                <div className="text-center mb-8">
                    <span className="text-xl">⚡</span>
                    <h2 className="text-2xl font-black tracking-tight text-white mt-2">Welcome Back</h2>
                    <p className="text-xs text-slate-400 mt-1">Access your engineering dashboard</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                        {/* 🛠️ value এবং onChange যুক্ত করা হয়েছে ডেমো ডেটা বাইন্ডিংয়ের জন্য */}
                        <input 
                            type="email" 
                            name="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" 
                            placeholder="name@example.com" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Password</label>
                        {/* 🛠️ value এবং onChange যুক্ত করা হয়েছে ডেমো ডেটা বাইন্ডিংয়ের জন্য */}
                        <input 
                            type="password" 
                            name="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            className="w-full px-4 py-2.5 rounded-xl bg-[#0a0d14] border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm" 
                            placeholder="••••••••" 
                        />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-90 text-white font-semibold py-2.5 rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.2)] transition-all text-sm mt-6">
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative flex py-6 items-center">
                    <div className="flex-grow border-t border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase tracking-widest font-bold">Or Secure Connect</span>
                    <div className="flex-grow border-t border-slate-800"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-800/40 text-slate-200 font-medium py-2.5 rounded-xl transition-all text-sm">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="text-center text-xs text-slate-400 mt-6">
                    New to the forge? <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4">Forge an account</Link>
                </p>
            </div>
        </div>
    );
}