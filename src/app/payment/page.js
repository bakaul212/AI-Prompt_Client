'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useContext } from 'react';
import { AuthContext } from '@/providers/AuthProvider';
import CheckoutForm from './CheckoutForm';
import { IoDiamondOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// আপনার স্ট্রাইপ পাবলিশেবল কী (Publishable Key) এখানে বসাবেন
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

export default function PaymentPage() {
  const { user } = useContext(AuthContext);

  const premiumBenefits = [
    "Instant decryption of all Private & Premium Prompts",
    "Unlimited copy execution rights on the system terminal",
    "Advanced engineering difficulty metrics unlocked",
    "Priority access to newly forged AI system scripts",
    "Verified VIP Architect tier badge on global reviews"
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 py-24 px-4 relative overflow-hidden">
      <ToastContainer theme="dark" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* বাম পাশ: প্ল্যান ডিটেইলস ও বেনিফিট */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 rounded-lg">
            <IoDiamondOutline className="animate-pulse" /> High-Tier Matrix Access
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Elevate to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300">Premium</span> Grid
          </h1>
          
          <p className="text-slate-400 text-sm leading-relaxed">
            Execute a one-time cryptographic authorization protocol to bypass all system network restrictions permanently. No monthly recurring loops.
          </p>

          <div className="bg-[#0f1423]/40 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="text-4xl font-black text-white font-mono flex items-baseline gap-1">
              $5.00 <span className="text-xs font-sans text-slate-500 font-bold uppercase tracking-wider">/ One-Time Terminal Fee</span>
            </div>
          </div>

          <ul className="space-y-3 pt-2">
            {premiumBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300 font-mono">
                <IoCheckmarkCircleOutline className="text-emerald-400 mt-0.5 flex-shrink-0" size={16} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ডান পাশ: স্ট্রাইপ পেমেন্ট ফরম */}
        <div className="backdrop-blur-md bg-[#0f1423]/30 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500"></div>
          
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 font-mono">/Payment Gateway Authentication</h3>
          
          {user ? (
            <Elements stripe={stripePromise}>
              <CheckoutForm price={5} userEmail={user?.email} />
            </Elements>
          ) : (
            <div className="text-center py-10 text-xs text-slate-500 font-mono">
              [CRITICAL ERROR]: Primary session missing. Please log in to authorize payment node.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}