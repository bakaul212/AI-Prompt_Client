// client/src/app/login/page.js
'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
    const { signInWithGoogle } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login Successful!');
            form.reset();
            router.push('/'); // লগইন সফল হলে হোমে যাবে
        } catch (error) {
            toast.error(error.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            toast.success('Logged in successfully!');
            router.push('/');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">Welcome Back</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="name@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="••••••••" />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition mt-4">
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or sign in with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition">
                    🌐 Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    New to the platform? <Link href="/register" className="text-cyan-600 hover:underline font-medium">Create an account</Link>
                </p>
            </div>
        </div>
    );
}