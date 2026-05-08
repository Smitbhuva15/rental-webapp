"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { Search, SlidersHorizontal, MapPin, Building, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 border-t border-slate-200 dark:border-slate-800 pt-20">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-8 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Browse Properties</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Find your perfect home from our verified listings.</p>
          </motion.div>
          
          <form onSubmit={handleFilter} className="flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700/50">
            <div className="flex-1 relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search by location or title..." 
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white shadow-sm transition-all outline-none"
              />
            </div>
            
            <div className="relative group md:w-48 flex-shrink-0">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
              <select 
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white appearance-none shadow-sm transition-all outline-none font-medium cursor-pointer"
              >
                <option value="">All Types</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
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
                  className="w-full pl-7 pr-3 py-3.5 rounded-xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white shadow-sm outline-none transition-all" 
                />
              </div>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">₹</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full pl-7 pr-3 py-3.5 rounded-xl bg-white dark:bg-slate-900 border-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white shadow-sm outline-none transition-all" 
                />
              </div>
            </div>

            <button 
              type="submit"
              className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg active:scale-95"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl mt-8 max-w-2xl mx-auto"
          >
             <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="h-10 w-10 text-slate-400" />
             </div>
             <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">No Properties Found</h3>
             <p className="text-slate-500 text-lg mb-8">We couldn't find any properties matching your current filters. Try adjusting your search criteria or clearing filters.</p>
             <button 
               onClick={clearFilters}
               className="font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 px-8 py-3.5 rounded-xl active:scale-95"
             >
               Clear All Filters
             </button>
          </motion.div>
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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading...</p>
        </div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
