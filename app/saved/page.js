"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { Heart, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export default function SavedProperties() {
  const router = useRouter();
  const { user, savedProperties } = useStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchSavedProperties() {
      if (!savedProperties || savedProperties.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch all properties and filter (or build a dedicated endpoint)
        // For now, we'll fetch all and filter client-side for simplicity,
        // but ideally we'd pass IDs to the backend.
        const res = await fetch('/api/properties');
        if (res.ok) {
          const allProps = await res.json();
          const saved = allProps.filter(p => savedProperties.includes(p._id || p.id));
          setProperties(saved);
        }
      } catch (err) {
        console.error("Failed to fetch saved properties", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedProperties();
  }, [user, router, savedProperties]);

  if (!user) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-32 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3"
          >
            <Heart className="h-8 w-8 text-red-500 fill-red-500" /> Saved Properties
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 dark:text-slate-400 mt-2 text-lg"
          >
            Your favorite listings, all in one place.
          </motion.p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800"></div>
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-xl max-w-2xl mx-auto"
          >
            <div className="w-24 h-24 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">No Saved Properties</h3>
            <p className="text-slate-500 text-lg mb-8">You haven't saved any properties yet. Start exploring and click the heart icon to save your favorites.</p>
            <Link 
              href="/browse"
              className="inline-flex items-center gap-2 font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-lg px-8 py-3.5 rounded-xl active:scale-95"
            >
              <Home className="h-5 w-5" /> Browse Properties
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop, idx) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
