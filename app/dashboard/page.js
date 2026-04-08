"use client";
import { useState, useEffect } from 'react';
import { CreditCard, CalendarCheck, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

  const isPremium = user?.subscription?.plan && user.subscription.plan !== 'free';

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
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'bookings' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Active Bookings</h2>
                
                {/* Mock Booking logic since we don't have the real bookings API created in this request */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center">
                  <div className="h-24 w-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src="https://placehold.co/200x200/1e293b/ffffff" alt="Property" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Luxury Modern Apartment</h3>
                    <p className="text-slate-500 text-sm">Mumbai, MH</p>
                    <div className="mt-2 inline-block px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                      Confirmed
                    </div>
                  </div>
                  <div className="text-right w-full md:w-auto">
                    <p className="text-slate-500 text-sm">Move in Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">Oct 1, 2026</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Subscription Plan</h2>
                
                {isPremium ? (
                  <div className="bg-gradient-to-br from-slate-900 to-primary p-6 rounded-2xl text-white">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-blue-200 font-medium tracking-wider uppercase text-sm mb-1">Current Plan</p>
                        <h3 className="text-3xl font-bold capitalize">{user.subscription.plan}</h3>
                      </div>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm backdrop-blur-sm self-start">Active</span>
                    </div>
                    
                    <div className="flex justify-between items-end">
                       <div>
                         <p className="text-blue-200 text-sm mb-1">Status</p>
                         <p className="font-medium capitalize">{user.subscription.status}</p>
                       </div>
                       <button className="bg-white text-slate-900 font-bold px-5 py-2 rounded-xl text-sm transition-transform hover:scale-105 active:scale-95 shadow-lg">
                         Manage Plan
                       </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-2xl text-center border border-slate-200 dark:border-slate-700">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Upgrade Your Experience</h3>
                    <p className="text-slate-500 mb-6 max-w-md mx-auto">You're currently on the Free plan. Upgrade to Premium to list your own properties and access advanced features.</p>
                    <button 
                      onClick={() => router.push('/pricing')}
                      className="bg-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all"
                    >
                      View Pricing Plans
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
