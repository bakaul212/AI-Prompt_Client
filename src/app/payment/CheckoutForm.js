'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import useAxiosPublic from '@/hooks/useAxiosSecure'; // আপনার দেওয়া কাস্টম হুক
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { IoShieldCheckmarkOutline } from 'react-icons/io5';

export default function CheckoutForm({ price, userEmail }) {
  const stripe = useStripe();
  const elements = useElements();
  const axiosPublic = useAxiosPublic();
  const router = useRouter();

  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // নতুন স্টেট লোডিং ট্র্যাকিংয়ের জন্য
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (price > 0 && userEmail) {
      setInitialLoading(true);
      axiosPublic.post('/create-payment-intent', { price }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      })
      .then(res => {
        if (res.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setErrorMessage('');
        } else {
          setErrorMessage('Invalid handshaking from server endpoint.');
        }
        setInitialLoading(false);
      })
      .catch(err => {
        setErrorMessage('Failed to initialize payment gateway token.');
        setInitialLoading(false);
      });
    }
  }, [price, userEmail, axiosPublic]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment pipeline has not finished compilation.");
      return;
    }

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setProcessing(true);
    setErrorMessage('');

    // স্ট্রাইপ পেমেন্ট মেথড তৈরি
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
      return;
    }

    // পেমেন্ট কনফার্মেশন
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: card,
          billing_details: {
            email: userEmail || 'anonymous@forge.com',
          },
        },
      }
    );

    if (confirmError) {
      setErrorMessage(confirmError.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      toast.success(`Transaction Authorized! ID: ${paymentIntent.id}`);
      
      try {
        // ডাটাবেজে পেমেন্ট সাকসেস স্টেট পাঠানো
        const res = await axiosPublic.post('/payment-success', {
          transactionId: paymentIntent.id,
          email: userEmail,
          amount: price,
        }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
        });

        if (res.data.success) {
          toast.success("Subscription upgraded to Premium grid permanently.");
          setTimeout(() => {
            router.push('/dashboard'); // অথবা আপনার হোম রাউট
          }, 2000);
        }
      } catch (dbErr) {
        toast.error("Ledger sync failure. Contact administration core.");
      }
    }
    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* যদি ব্যাকএন্ড থেকে টোকেন লোড হতে থাকে */}
      {initialLoading ? (
        <div className="text-center py-6 text-xs text-amber-400 font-mono animate-pulse bg-[#07090e] border border-slate-800/50 rounded-xl">
          [CONNECTING]: Fetching secure authorization link from network node...
        </div>
      ) : (
        /* টোকেন চলে আসলে কার্ড ইনপুট ফিল্ড দেখাবে */
        <div className="p-4 bg-[#07090e] border border-slate-800 rounded-xl shadow-inner">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '14px',
                  color: '#f8fafc',
                  fontFamily: 'monospace, sans-serif',
                  '::placeholder': { color: '#64748b' },
                },
                invalid: { color: '#f43f5e' },
              },
            }}
          />
        </div>
      )}

      {errorMessage && (
        <div className="text-xs font-mono text-rose-500 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing || initialLoading}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xs py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
      >
        <IoShieldCheckmarkOutline size={16} />
        {processing ? 'Processing Cipher...' : `Authorize Payment ($${price}.00)`}
      </button>
    </form>
  );
}