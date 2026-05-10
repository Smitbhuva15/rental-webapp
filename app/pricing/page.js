"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '@/lib/store';
import { isSubscriptionActive } from '@/lib/subscription';
import { toast } from 'sonner';

export default function Pricing() {
  const router = useRouter();
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setAuthChecking(false);
      } catch (err) {
        router.push('/login');
      }
    }

    if (!user) {
      checkAuth();
    } else {
      setAuthChecking(false);
    }
  }, [user, router, setUser]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (planName) => {
    if (user && isSubscriptionActive(user)) {
      toast.error("You already have an active subscription plan");
      return;
    }

    setLoading(true);
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscription/create', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planName })
      });
      const data = await response.json();
      
      if (!response.ok || !data.order) {
        toast.error(data.message || "Server error. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key', 
        amount: data.order.amount,
        currency: data.order.currency,
        name: "RentHub",
        description: `${planName} Subscription`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyData = await fetch('/api/subscription/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionId: data.subscriptionId
              })
            }).then((t) => t.json());

            if (verifyData.message === 'Payment verified successfully') {
              toast.success("Subscription active!");
              router.push('/dashboard');
            } else {
              toast.error('Payment verification failed');
            }
          } catch(err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
           name: user?.name || "RentHub User",
           email: user?.email || "user@example.com",
           contact: "9999999999"
        },
        theme: {
          color: "#802BB1"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      toast.error('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <div className="w-12 h-12 border-4 border-[#802BB1] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#030711] min-h-screen py-32 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#802BB1]/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#9a5afb]/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#802BB1] to-[#bd6eff]">Pricing</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Choose the perfect plan for your real estate needs. Whether you're a casual renter or a professional property manager, we have you covered without any broker fees.
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-semibold ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-[#802BB1] rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-[#802BB1]/30 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
            >
              <motion.div 
                layout
                className="w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isYearly ? 32 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
              Yearly <span className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-[10px] px-2 py-0.5 rounded-full">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Basic Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800  backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border  flex flex-col hover:-translate-y-2 transition-transform duration-300"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Basic Renter</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">Perfect for individuals looking for their next home.</p>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
              ₹0 <span className="text-lg font-medium text-slate-500">/{isYearly ? 'yr' : 'mo'}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Browse & Search properties</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Save favorite properties</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Contact owners</li>
              <li className="flex gap-3 text-slate-400 dark:text-slate-600"><XCircle className="h-6 w-6 flex-shrink-0" /> No property listings</li>
            </ul>
            
            <button onClick={() => router.push('/browse')} className="w-full text-center py-4 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-[#802BB1] hover:text-[#802BB1] transition-colors">
              Start Browsing
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#802BB1] to-[#bd6eff] rounded-3xl p-8 shadow-2xl shadow-[#802BB1]/30 border-0 flex flex-col relative transform md:scale-105 z-10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#802BB1] to-[#bd6eff] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-300" /> Premium Owner</h3>
            <p className="text-[#bd6eff] mb-6 min-h-[48px]">For property owners wanting to bypass broker networks.</p>
            <div className="text-4xl font-black text-white mb-8">
              ₹{isYearly ? '4,790' : '499'} <span className="text-lg font-medium text-[#bd6eff]">/{isYearly ? 'yr' : 'mo'}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 text-white">
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-[#bd6eff] flex-shrink-0" /> Everything in Basic</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-[#bd6eff] flex-shrink-0" /> Add unlimited properties</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-[#bd6eff] flex-shrink-0" /> Edit & manage listings</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-[#bd6eff] flex-shrink-0" /> Priority 24/7 support</li>
            </ul>
            
            <button onClick={() => handlePayment(isYearly ? 'premium_yearly' : 'premium_monthly')} disabled={loading} className="w-full text-center py-4 rounded-xl font-bold bg-white text-[#802BB1] hover:bg-slate-50 transition-transform active:scale-95 shadow-xl disabled:opacity-80">
              {loading ? 'Processing...' : 'Upgrade to Premium'}
            </button>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col hover:-translate-y-2 transition-transform duration-300"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-[#802BB1]" /> Enterprise</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">For professional property managers and agencies.</p>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
              ₹{isYearly ? '95,990' : '9,999'} <span className="text-lg font-medium text-slate-500">/{isYearly ? 'yr' : 'mo'}</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Everything in Premium</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Custom branding & domain</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Advanced analytics dashboard</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-[#802BB1] flex-shrink-0" /> Dedicated account manager</li>
            </ul>
            
            <button className="w-full py-4 rounded-xl font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-transform active:scale-95 shadow-xl">
              Contact Sales
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple Helper Component
function XCircle({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
  );
}
