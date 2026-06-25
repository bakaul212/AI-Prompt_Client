'use client';

import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState, useEffect } from 'react';
import useAxiosPublic from '@/hooks/useAxiosSecure';
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
  const [errorMessage, setErrorMessage] = useState('');

  // পেইজ লোড হওয়ার সাথে সাথে ব্যাক-এন্ড থেকে ক্লায়েন্ট সিক্রেট নিয়ে আসা
  useEffect(() => {
    if (price > 0) {
      axiosPublic.post('/create-payment-intent', { price }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` }
      })
      .then(res => {
        setClientSecret(res.data.clientSecret);
      })
      .catch(err => {
        setErrorMessage('Failed to initialize payment gateway.');
      });
    }
  }, [price, axiosPublic]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (card == null) return;

    setProcessing(true);
    setErrorMessage('');

    // কার্ড ভ্যালিডেশন চেক
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      setErrorMessage(error.message);
      setProcessing(false);
      return;
    }

    // পেমেন্ট কনফার্মেশন প্রসেস
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
      
      // ব্যাক-এন্ডে সফল পেমেন্ট ডাটা পাঠানো ও রোল আপগ্রেড করা
      try {
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
            router.back(); // আগের পেইজে ফেরত পাঠানো
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

      {errorMessage && (
        <p className="text-xs font-mono text-rose-500 bg-rose-500/5 p-3 rounded-lg border border-rose-500/10">
          ⚠️ {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || processing}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-black text-xs py-3.5 px-6 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
      >
        <IoShieldCheckmarkOutline size={16} />
        {processing ? 'Processing Cipher...' : `Authorize Payment ($${price}.00)`}
      </button>
    </form>
  );
}