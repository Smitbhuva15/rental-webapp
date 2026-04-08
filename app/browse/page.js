"use client";

import { useState, useEffect } from 'react';
import PropertyCard from '@/components/PropertyCard';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';

export default function Browse() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', q: '' });

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

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 border-t border-slate-200 dark:border-slate-800">
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Browse Properties</h1>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input 
                type="text" 
                placeholder="Search by location or title..." 
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white transition-all outline-none"
              />
            </div>
            <select 
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full md:w-48 px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white appearance-none outline-none transition-all"
            >
              <option value="">All Types</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>
            </select>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Min ₹" 
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full md:w-32 px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white outline-none transition-all" 
              />
              <input 
                type="number" 
                placeholder="Max ₹" 
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full md:w-32 px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-primary/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white outline-none transition-all" 
              />
            </div>
            <button 
              onClick={fetchProperties}
              className="bg-primary hover:bg-blue-600 text-white px-6 py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-md hover:-translate-y-0.5"
            >
              <Search className="h-5 w-5" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-500 font-medium">
            {loading ? 'Searching...' : `${properties.length} results found`}
          </p>
          <button className="flex items-center gap-2 text-slate-600 dark:text-slate-400 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            <SlidersHorizontal className="h-5 w-5" /> Sort
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm mt-8">
             <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="h-8 w-8 text-slate-400" />
             </div>
             <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No Properties Found</h3>
             <p className="text-slate-500 max-w-md mx-auto">We couldn't find any properties matching your current filters. Try adjusting your search criteria or clearing filters to see more results.</p>
             <button 
               onClick={() => {
                 setFilters({ category: '', minPrice: '', maxPrice: '', q: '' });
                 // Set timeout to allow state to update before fetching
                 setTimeout(() => fetchProperties(), 0);
               }}
               className="mt-6 font-semibold text-primary hover:text-blue-600 transition-colors bg-blue-50 dark:bg-blue-900/30 px-6 py-2.5 rounded-full"
             >
               Clear Filters
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map(prop => (
              <PropertyCard key={prop._id} property={prop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
