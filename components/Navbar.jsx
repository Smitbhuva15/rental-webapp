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
    <nav className="fixed w-full z-50 transition-all duration-300 bg-[#030711]/95 border-b border-[#802BB1]/20 backdrop-blur-xl shadow-[0_35px_90px_-60px_rgba(128,43,177,0.45)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="shrink-0 flex items-center gap-3 cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="bg-linear-to-tr from-[#802BB1] to-[#bd6eff] p-2 rounded-2xl text-white shadow-[0_18px_50px_-35px_rgba(128,43,177,0.85)]">
              <Home className="h-6 w-6" />
            </div>
            <Link href="/" className="font-bold text-2xl tracking-tighter text-white">
              RentHub
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/browse" className="flex items-center gap-2 font-medium text-slate-200 hover:text-[#d6b5ff] transition-colors duration-200">
               Browse
            </Link>
            <Link href="/pricing" className="font-medium text-slate-200 hover:text-[#d6b5ff] transition-colors duration-200">
              Pricing
            </Link>

            <div className="h-8 w-px bg-[#802BB1]/20 mx-2" />

            {user ? (
              <div className="flex items-center gap-5">
                <Link href="/saved" className="relative text-slate-200 hover:text-[#d6b5ff] transition-colors group">
                  <Heart className="h-6 w-6" />
                  {savedProperties?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#802BB1] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-[0_0_0_4px_rgba(128,43,177,0.12)]">
                      {savedProperties.length}
                    </span>
                  )}
                </Link>
                <Link href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-slate-200 hover:text-[#d6b5ff] transition-colors">
                  <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#2f173d] border border-[#802BB1]/30 text-[#e7d8ff] flex items-center justify-center font-bold text-lg shadow-[0_15px_40px_-20px_rgba(128,43,177,0.45)]">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={handleLogout} className="text-slate-200 hover:text-white hover:bg-[#802BB1]/10 p-2 rounded-full transition-colors" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-slate-200 font-medium hover:text-[#d6b5ff] transition-colors px-3 py-2 rounded-lg hover:bg-[#ffffff]/5">
                  <UserCircle className="h-5 w-5 inline-block" /> Login
                </Link>
                <Link href="/signup" className="bg-[#802BB1] hover:bg-[#9e5af8] text-white px-6 py-2.5 rounded-full font-semibold shadow-[0_18px_50px_-35px_rgba(128,43,177,0.9)] transition-all active:scale-95">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(true)} className="text-slate-200 hover:text-[#d6b5ff] focus:outline-none">
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
              className="fixed inset-0 bg-[#030711]/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 w-[80%] max-w-sm h-screen bg-[#030711] shadow-[0_30px_80px_-40px_rgba(128,43,177,0.65)] z-50 md:hidden flex flex-col"
            >
              <div className="p-4 flex justify-end border-b border-[#802BB1]/20">
                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-200 hover:bg-[#ffffff]/10 rounded-full transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-2">
                <Link onClick={() => setIsOpen(false)} href="/browse" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-200 hover:text-[#d6b5ff] hover:bg-[#ffffff]/5 rounded-xl transition-colors">
                  <Compass className="h-5 w-5 " /> Browse
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/pricing" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-200 hover:text-[#d6b5ff] hover:bg-[#ffffff]/5 rounded-xl transition-colors">
                  <Home className="h-5 w-5 " /> Pricing
                </Link>

                {user ? (
                  <>
                    <div className="my-4 border-t border-[#802BB1]/20"></div>
                    <Link onClick={() => setIsOpen(false)} href="/saved" className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-200 hover:text-[#d6b5ff] hover:bg-[#ffffff]/5 rounded-xl transition-colors">
                      <Heart className="h-5 w-5" /> Saved Properties
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-4 py-3 text-lg font-medium text-slate-200 hover:text-[#d6b5ff] hover:bg-[#ffffff]/5 rounded-xl transition-colors">
                      <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center gap-3 mt-auto text-white px-4 py-4 rounded-xl font-bold bg-[#802BB1] hover:bg-[#9e5af8] transition-all">
                      <LogOut className="h-5 w-5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-3">
                    <Link onClick={() => setIsOpen(false)} href="/login" className="flex justify-center items-center gap-2 text-slate-200 font-bold bg-[#1a1323] px-4 py-3.5 rounded-xl hover:bg-[#2d163f] transition-colors">
                      <UserCircle className="h-5 w-5" /> Login
                    </Link>
                    <Link onClick={() => setIsOpen(false)} href="/signup" className="bg-[#802BB1] text-white flex justify-center px-4 py-3.5 rounded-xl font-bold shadow-[0_16px_40px_-20px_rgba(128,43,177,0.9)] hover:bg-[#9e5af8] transition-all">
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
