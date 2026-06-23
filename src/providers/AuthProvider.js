'use client';

import { createContext, useEffect, useState } from 'react';
import { 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/firebase/firebase.config';
import useAxiosPublic from '@/hooks/useAxiosPublic';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosPublic = useAxiosPublic();

    // গুগল সোশাল লগইন (Requirement: Default Role assigns as 'User')
    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };

    // লগআউট
    const logOut = () => {
        setLoading(true);
        // লগআউট করার সাথে সাথে লোকাল স্টোরেজ থেকে টোকেন ক্লিন করা সেফ প্র্যাকটিস
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access-token');
        }
        return signOut(auth);
    };

    // ফায়ারবেস লগইন স্টেট পর্যবেক্ষণ
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userInfo = { email: currentUser.email };
                try {
                    // ১. রিকোয়ারমেন্ট অনুযায়ী ডাটাবেজে ইউজার ইনফো পাঠানো (ডিফল্ট রোল 'User' ব্যাকএন্ডে হ্যান্ডেল হচ্ছে)
                    await axiosPublic.post('/users', {
                        name: currentUser.displayName,
                        email: currentUser.email,
                        photoURL: currentUser.photoURL
                    });

                    // ২. সিকিউর সেশনের জন্য JWT টোকেন নেওয়া
                    const res = await axiosPublic.post('/jwt', userInfo);
                    if (res.data.token) {
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('access-token', res.data.token);
                        }
                    }
                } catch (error) {
                    console.error('Auth sync error during token fetch:', error);
                } finally {
                    // এপিআই কল সফল বা ব্যর্থ যাই হোক না কেন, টোকেন প্রসেস শেষে ইউজার এবং লোডিং স্টেট সেট হবে
                    setUser(currentUser);
                    setLoading(false);
                }
            } else {
                setUser(null);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access-token');
                }
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [axiosPublic]);

    const authInfo = {
        user,
        loading,
        signInWithGoogle,
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;