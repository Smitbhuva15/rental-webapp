"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Building, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  
  const initialCategory = searchParams.get('category') || '';
  const initialQ = searchParams.get('q') || '';

  const [filters, setFilters] = useState({ category: initialCategory, minPrice: '', maxPrice: '', q: initialQ });

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
        fetchProperties();
      } catch (err) {
        router.push('/login');
      }
    }

    if (!user) {
      checkAuth();
    } else {
      setAuthChecking(false);
      fetchProperties();
    }
  }, [user, router, setUser]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.q) params.append('q', filters.q);

      const res = await fetch(`/api/properties?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data);
      }
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', q: '' });
    setTimeout(() => {
      // Use the reset filters directly since state update is async
      const params = new URLSearchParams();
      fetch(`/api/properties?${params.toString()}`)
        .then(res => res.json())
        .then(data => setProperties(data));
    }, 0);
  };

  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030711]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#802BB1] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#030711] min-h-screen pb-24 border-t border-[#802BB1]/15 pt-20">
      {/* Search Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-[#802BB1]/15 pt-8 pb-8 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Browse Properties</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find your perfect home from our verified listings.</p>
          </motion.div>
          
          <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border shadow-[0_35px_120px_-80px_rgba(128,43,177,0.45)]  border-[#802BB1]/20   relative z-30">
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#802BB1] transition-colors" />
              <input 
                type="text" 
                placeholder="Search by location or title..." 
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border-none focus:ring-2 focus:ring-[#802BB1]/30 text-slate-900 dark:text-white shadow-sm transition-all outline-none"
              />
            </div>
            
            <div className="relative group md:w-48 flex-shrink-0">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#802BB1] transition-colors" />
              <select 
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border-none focus:ring-2 focus:ring-[#802BB1]/30 text-slate-900 dark:text-white appearance-none shadow-sm transition-all outline-none font-medium cursor-pointer"
              >
                <option value="" className="text-white bg-[#190e1f]">All Types</option>
                <option value="Apartment"className="text-white bg-[#190e1f]" > Apartment</option>
                <option value="House" className="text-white bg-[#190e1f]">House</option>
                <option value="Villa" className="text-white bg-[#190e1f]">Villa</option>
                <option value="Commercial" className="text-white bg-[#190e1f]">Commercial</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4 pointer-events-none" />
            </div>

            <div className="flex gap-2 md:w-64 flex-shrink-0">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full pl-7 pr-3 py-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border-none focus:ring-2 focus:ring-[#802BB1]/30 text-slate-900 dark:text-white shadow-sm outline-none transition-all" 
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full pl-7 pr-3 py-3.5 rounded-xl bg-white/50 dark:bg-slate-900/50 border-none focus:ring-2 focus:ring-[#802BB1]/30 text-slate-900 dark:text-white shadow-sm outline-none transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-gradient-to-r from-[#802BB1] to-[#b56cf5] hover:from-[#9a4ae0] hover:to-[#802BB1] text-white px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-[#802BB1]/20 active:scale-95"
            >
              <Search className="h-5 w-5" /> Filter
            </button>
          </form>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex justify-between items-center mb-8">
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            {loading ? (
              <span className="animate-pulse bg-slate-200 dark:bg-slate-800 h-5 w-32 rounded"></span>
            ) : (
              <><CheckCircle2 className="h-5 w-5 text-green-500" /> {properties.length} properties found</>
            )}
          </p>
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium px-4 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-900 shadow-sm transition-all"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>

        {loading ? (
          <LoadingState type="skeleton-grid" />
        ) : properties.length === 0 ? (
          <EmptyState 
            icon={Search}
            title="No Properties Found"
            description="We couldn't find any properties matching your current filters. Try adjusting your search criteria or clearing filters."
            action={
              <button 
                onClick={clearFilters}
                className="font-bold text-white bg-[#802BB1] hover:bg-[#6a1f9a] transition-colors shadow-lg shadow-[#802BB1]/30 px-8 py-3.5 rounded-xl active:scale-95"
              >
                Clear All Filters
              </button>
            }
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {properties.map((prop, idx) => (
                <motion.div
                  key={prop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <PropertyCard property={prop} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function Browse() {
  return (
    <Suspense fallback={<LoadingState type="spinner" />}>
      <BrowseContent />
    </Suspense>
  );
}
