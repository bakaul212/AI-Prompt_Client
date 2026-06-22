'use client';

import { useState, useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebase.config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterPage() {
    const { signInWithGoogle } = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
            
            // ২. প্রোফাইল আপডেট (Name & Photo)
            await updateProfile(result.user, {
                displayName: name,
                photoURL: photoURL
            });

            // ৩. মঙ্গোডিবি ব্যাকএন্ডে ডেটা পাঠানো (যোগ করা হলো)
            const saveUser = { name, email, photoURL };
            const res = await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(saveUser)
            });
            const data = await res.json();

            if (data.insertedId || data.message === 'user already exists') {
                toast.success('Registration & Database Sync Successful!');
                form.reset();
                router.push('/'); // হোম পেজে রিডাইরেক্ট
            }
        } catch (error) {
            toast.error(error.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithGoogle();
            
            // গুগল লগইনের ডেটাও মঙ্গোডিবি ডাটাবেজে সিঙ্ক করা (যোগ করা হলো)
            const saveUser = {
                name: result?.user?.displayName || "Google User",
                email: result?.user?.email,
                photoURL: result?.user?.photoURL || ""
            };

            await fetch('http://localhost:5000/users', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(saveUser)
            });

            toast.success('Logged in with Google!');
            router.push('/');
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-6 tracking-tight">Create Account</h2>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input type="email" name="email" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="name@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Photo URL</label>
                        <input type="url" name="photoURL" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="https://example.com/photo.jpg" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input type="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-50" placeholder="••••••••" />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2.5 rounded-lg transition mt-4">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="relative flex py-4 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 rounded-lg transition">
                    🌐 Google
                </button>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <Link href="/login" className="text-cyan-600 hover:underline font-medium">Login</Link>
                </p>
            </div>
        </div>
    );
}