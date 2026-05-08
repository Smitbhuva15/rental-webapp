"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Compass, UserCircle, LogOut, LayoutDashboard, Moon, Sun, Heart } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, logout, savedProperties } = useStore();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchUser() {
      if (user) return;
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }
    fetchUser();
  }, [setUser, user]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        logout();
        toast.success("Logged out successfully");
        router.push('/');
      }
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass border-b border-white/20 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <Home className="h-6 w-6" />
            </div>
            <Link href="/" className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              RentHub
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/browse" className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:-translate-y-0.5 duration-200">
              <Compass className="h-4 w-4" /> Browse
            </Link>
            <Link href="/pricing" className="font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors hover:-translate-y-0.5 duration-200">
              Pricing
            </Link>
            
            <div className="border-l border-slate-200 dark:border-slate-800 h-8 mx-2"></div>

            
            
            {user ? (
              <div className="flex items-center gap-6">
                <Link href="/saved" className="relative text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors group">
                  <Heart className="h-6 w-6 group-hover:fill-red-500 transition-all" />
                  {savedProperties?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                      {savedProperties.length}
                    </span>
                  )}
                </Link>
                <Link href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {/* {user.subscription?.status === 'active' ? (
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${new Date(user.subscription.expiryDate) > new Date() ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {new Date(user.subscription.expiryDate) > new Date() ? `${Math.ceil(Math.abs(new Date(user.subscription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left` : 'Expired'}
                    </div>
                  ) : null} */}
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-full transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                  <UserCircle className="h-5 w-5" /> Login
                </Link>
                <Link href="/signup" className="bg-slate-900 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-slate-500/20 transition-all hover:-translate-y-0.5 active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
            
          </div>
          <div className="md:hidden flex items-center gap-4">
            {/* {mounted && (
              <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )} */}
            <button onClick={() => setIsOpen(true)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-screen bg-white dark:bg-slate-950 shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="p-4 flex justify-end border-b border-slate-100 dark:border-slate-800">
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-2">
                <Link onClick={() => setIsOpen(false)} href="/browse" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                  <Compass className="h-5 w-5" /> Browse
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/pricing" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                  <Home className="h-5 w-5" /> Pricing
                </Link>
                
                {user ? (
                  <>
                    <div className="my-4 border-t border-slate-100 dark:border-slate-800"></div>
                    <Link onClick={() => setIsOpen(false)} href="/saved" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                      <Heart className="h-5 w-5" /> Saved Properties
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                      <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 mt-auto text-red-600 px-4 py-4 rounded-xl font-bold bg-red-50 dark:bg-red-500/10">
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-3">
                    <Link onClick={() => setIsOpen(false)} href="/login" className="flex justify-center items-center gap-2 text-slate-800 dark:text-white font-bold bg-slate-100 dark:bg-slate-800 px-4 py-3.5 rounded-xl">
                      <UserCircle className="h-5 w-5" /> Login
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/signup" className="bg-blue-600 text-white flex justify-center text-center px-4 py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30">
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
