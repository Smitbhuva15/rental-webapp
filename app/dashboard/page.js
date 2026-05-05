"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CalendarCheck, Home, PlusSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import UserProperties from '@/components/UserProperties';
import UserBookings from '@/components/UserBookings';
import { isSubscriptionActive, getDaysRemaining } from '@/lib/subscription';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null; // Will redirect in useEffect

  const isPremiumOrAdmin = user.role === 'Admin' || (user?.subscription?.plan && user.subscription.plan !== 'free' && user.subscription.status === 'active');

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sticky top-24">
              <div className="mb-8 p-4 text-center">
                <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 text-3xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-bold text-slate-900 dark:text-white text-lg">{user.name}</h2>
                <p className="text-sm text-slate-500 capitalize">{user.subscription?.plan || 'Free'} Member</p>
              </div>

              <div className="space-y-1">
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'bookings' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <CalendarCheck className="h-5 w-5" /> My Bookings
                </button>
                <button 
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'subscription' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <CreditCard className="h-5 w-5" /> Subscription
                </button>
                {isPremiumOrAdmin && (
                  <button 
                    onClick={() => setActiveTab('properties')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'properties' ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                    <PlusSquare className="h-5 w-5" /> My Properties
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'bookings' && (
               <UserBookings />
            )}

            {activeTab === 'subscription' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                  <CreditCard className="h-8 w-8 text-blue-600" /> Subscription Plan
                </h2>
                
                {user?.subscription?.plan && user.subscription.plan !== 'free' ? (
                  <div className="space-y-6">
                    <div className={`relative overflow-hidden rounded-3xl p-8 border ${
                      isSubscriptionActive(user) 
                        ? 'bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 border-blue-800/50 text-white shadow-2xl shadow-blue-900/20' 
                        : 'bg-slate-50 dark:bg-slate-800/50 border-red-200 dark:border-red-900/50 text-slate-900 dark:text-white'
                    }`}>
                      {!isSubscriptionActive(user) && (
                        <div className="absolute top-6 right-6 bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 px-4 py-1.5 rounded-full text-sm font-bold border border-red-200 dark:border-red-800/30">
                          Expired
                        </div>
                      )}
                      
                      {isSubscriptionActive(user) && (
                        <div className="absolute top-6 right-6 bg-green-500/20 text-green-300 px-4 py-1.5 rounded-full text-sm font-bold border border-green-500/30">
                          Active
                        </div>
                      )}

                      <div className="mb-10">
                        <p className={`text-sm font-bold tracking-wider uppercase mb-2 ${isSubscriptionActive(user) ? 'text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>
                          Current Plan
                        </p>
                        <h3 className="text-5xl font-black capitalize flex items-baseline gap-2">
                          {user.subscription.plan}
                          <span className={`text-xl font-medium ${isSubscriptionActive(user) ? 'text-blue-200' : 'text-slate-500'}`}>
                            {user.subscription.planType === 'yearly' ? 'Yearly' : 'Monthly'}
                          </span>
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className={`p-4 rounded-2xl ${isSubscriptionActive(user) ? 'bg-white/10 backdrop-blur-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                           <p className={`text-sm mb-1 ${isSubscriptionActive(user) ? 'text-blue-200' : 'text-slate-500'}`}>Start Date</p>
                           <p className="font-bold text-lg">
                             {new Date(user.subscription.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </p>
                         </div>
                         <div className={`p-4 rounded-2xl ${isSubscriptionActive(user) ? 'bg-white/10 backdrop-blur-md' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}`}>
                           <p className={`text-sm mb-1 ${isSubscriptionActive(user) ? 'text-blue-200' : 'text-slate-500'}`}>Expiry Date</p>
                           <p className="font-bold text-lg">
                             {new Date(user.subscription.expiryDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </p>
                         </div>
                         <div className={`p-4 rounded-2xl ${isSubscriptionActive(user) ? 'bg-blue-600/50 backdrop-blur-md border border-blue-400/30' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30'}`}>
                           <p className={`text-sm mb-1 ${isSubscriptionActive(user) ? 'text-blue-100' : 'text-red-500 dark:text-red-400'}`}>Remaining</p>
                           <p className={`font-black text-2xl ${!isSubscriptionActive(user) && 'text-red-600 dark:text-red-400'}`}>
                             {isSubscriptionActive(user) ? `${getDaysRemaining(user)} Days` : '0 Days'}
                           </p>
                         </div>
                      </div>
                    </div>

                    {!isSubscriptionActive(user) && (
                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                          <h4 className="font-bold text-amber-800 dark:text-amber-400 text-lg mb-1">Your plan has expired</h4>
                          <p className="text-amber-700/80 dark:text-amber-500/80">You can no longer list properties, edit, or delete them. Please renew your subscription to unlock these features.</p>
                        </div>
                        <button 
                          onClick={() => router.push('/pricing')}
                          className="flex-shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-amber-500/20"
                        >
                          Renew Plan
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-3xl text-center border border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CreditCard className="h-10 w-10" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Upgrade Your Experience</h3>
                    <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto">You're currently on the Free plan. Upgrade to Premium to list your own properties and access advanced features.</p>
                    <button 
                      onClick={() => router.push('/pricing')}
                      className="bg-blue-600 text-white font-bold px-10 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:-translate-y-1 hover:bg-blue-700 transition-all active:scale-95 text-lg"
                    >
                      View Pricing Plans
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'properties' && isPremiumOrAdmin && (
              <UserProperties user={user} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
