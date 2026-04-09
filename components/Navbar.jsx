"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Home, Compass, UserCircle, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
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
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <nav className="fixed w-full z-50 transition-all duration-300 glass border-b border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <Home className="h-6 w-6 text-primary" />
            <Link href="/" className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
              RentHub
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/browse" className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200">
              <Compass className="h-4 w-4" /> Browse
            </Link>
            <Link href="/pricing" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors hover:-translate-y-0.5 duration-200">
              Pricing
            </Link>
            
            <div className="border-l border-slate-300 h-6 mx-2"></div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-primary transition-colors hover:-translate-y-0.5 duration-200">
                  <LayoutDashboard className="h-5 w-5" /> {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors p-1" title="Logout">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/login" className="flex items-center gap-2 text-slate-800 dark:text-white font-medium hover:text-primary transition-colors">
                  <UserCircle className="h-5 w-5" /> Login
                </Link>
                <Link href="/register" className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-full font-medium shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-blue-500/50">
                  Sign Up
                </Link>
              </>
            )}
            
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 hover:text-primary focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass animate-in slide-in-from-top-2 absolute w-full left-0 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col gap-4 items-center">
            <Link href="/browse" className="w-full text-center block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Browse</Link>
            <Link href="/pricing" className="w-full text-center block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Pricing</Link>
            
            {user ? (
              <>
                <Link href={user.role === 'Admin' ? '/admin' : '/dashboard'} className="w-full text-center block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                  {user.role === 'Admin' ? 'Admin Panel' : 'Dashboard'}
                </Link>
                <button onClick={handleLogout} className="text-red-500 w-[90%] px-5 py-3 rounded-full font-medium border border-red-200 bg-red-50">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" className="w-full text-center block px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">Login</Link>
                <Link href="/register" className="bg-primary text-white text-center w-[90%] px-5 py-3 rounded-full font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
