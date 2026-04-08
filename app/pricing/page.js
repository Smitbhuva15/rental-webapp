"use client";

import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Pricing() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Choose the perfect plan for your real estate needs. Whether you're a casual renter or a professional property manager, we have you covered without any broker fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-transform hover:-translate-y-2 duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Basic Renter</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">Perfect for individuals looking for their next home.</p>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
              ₹0 <span className="text-lg font-medium text-slate-500">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Browse properties</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Filter & Search</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Basic email support</li>
              <li className="flex gap-3 text-slate-400 dark:text-slate-600"><XCircle className="h-6 w-6 flex-shrink-0" /> Post properties</li>
            </ul>
            
            <Link href="/register" className="w-full text-center py-4 rounded-xl font-bold border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-primary hover:text-primary transition-colors">
              Get Started
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-b from-primary to-blue-700 rounded-3xl p-8 shadow-xl shadow-blue-900/20 border-0 flex flex-col relative transform scale-100 md:scale-105 z-10">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-300" /> Premium Owner</h3>
            <p className="text-blue-100 mb-6 min-h-[48px]">For property owners wanting to bypass broker networks.</p>
            <div className="text-4xl font-black text-white mb-8">
              ₹1,999 <span className="text-lg font-medium text-blue-200">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 text-white">
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0" /> Everything in Basic</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0" /> Post up to 5 properties</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0" /> Highlighted listings</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0" /> Direct renter messaging</li>
              <li className="flex gap-3"><CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0" /> Priority 24/7 support</li>
            </ul>
            
            <Link href="/dashboard" className="w-full text-center py-4 rounded-xl font-bold bg-white text-primary hover:bg-slate-50 transition-colors shadow-lg shadow-black/10">
              Upgrade to Premium
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col transition-transform hover:-translate-y-2 duration-300">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-purple-500" /> Enterprise</h3>
            <p className="text-slate-500 mb-6 min-h-[48px]">For professional property managers and agencies.</p>
            <div className="text-4xl font-black text-slate-900 dark:text-white mb-8">
              ₹9,999 <span className="text-lg font-medium text-slate-500">/mo</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Everything in Premium</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Unlimited property listings</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Custom branding</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Advanced analytics dashboard</li>
              <li className="flex gap-3 text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" /> Dedicated account manager</li>
            </ul>
            
            <button className="w-full py-4 rounded-xl font-bold bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors">
              Contact Sales
            </button>
          </div>
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
