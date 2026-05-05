"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
                <Link href="/add-property" className="hidden lg:flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-blue-600 transition-colors bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md">
                  List Property
                </Link>
                <Link href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-blue-600 transition-colors">
                  <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin' : 'Dashboard'}
                </Link>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-lg shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  {user.subscription?.status === 'active' ? (
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${new Date(user.subscription.expiryDate) > new Date() ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}`}>
                      {new Date(user.subscription.expiryDate) > new Date() ? `${Math.ceil(Math.abs(new Date(user.subscription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days left` : 'Expired'}
                    </div>
                  ) : null}
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
            
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-blue-600 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass animate-in slide-in-from-top-2 absolute w-full left-0 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="px-4 pt-4 pb-8 flex flex-col gap-3 items-center">
            <Link onClick={() => setIsOpen(false)} href="/browse" className="w-full text-center block px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">Browse</Link>
            <Link onClick={() => setIsOpen(false)} href="/pricing" className="w-full text-center block px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">Pricing</Link>
            
            {user ? (
              <>
                <Link onClick={() => setIsOpen(false)} href="/saved" className="w-full text-center block px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                  Saved Properties
                </Link>
                <Link onClick={() => setIsOpen(false)} href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="w-full text-center block px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors">
                  {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-600 w-[90%] px-5 py-3 rounded-xl font-bold border border-red-200 bg-red-50 dark:bg-red-500/10 dark:border-red-500/20 mt-2">Logout</button>
              </>
            ) : (
              <>
                <Link onClick={() => setIsOpen(false)} href="/login" className="w-full text-center block px-4 py-3 text-lg font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors mt-2">Login</Link>
                <Link onClick={() => setIsOpen(false)} href="/signup" className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white text-center w-[90%] px-5 py-3.5 rounded-xl font-bold mt-2 shadow-lg">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
