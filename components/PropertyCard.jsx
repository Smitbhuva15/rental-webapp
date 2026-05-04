"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart, Loader2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function PropertyCard({ property }) {
  const router = useRouter();
  const { user, savedProperties, toggleSaveProperty } = useStore();
  const [isSaving, setIsSaving] = useState(false);

  // If property is undefined for showcase purposes, mock it
  const data = property || {
    _id: "1",
    title: "Luxury Modern Apartment",
    location: { city: "New York", state: "NY", address: "123 Central Ave" },
    price: 3500,
    category: "Apartment",
    images: [{ url: "https://placehold.co/600x400/1e293b/ffffff?text=Property+Image" }] // placeholder
  };

  const propertyId = data._id || data.id;
  const isSaved = savedProperties?.includes(propertyId);
  const imageUrl = data.images && data.images[0] ? data.images[0].url : "https://placehold.co/600x400/1e293b/ffffff?text=No+Image";

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to save properties");
      router.push('/login');
      return;
    }

    setIsSaving(true);
    // Optimistic UI update
    toggleSaveProperty(propertyId);

    try {
      const res = await fetch('/api/user/save-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId }),
      });

      if (!res.ok) {
        // Revert on failure
        toggleSaveProperty(propertyId);
        toast.error("Failed to save property");
      } else {
        const result = await res.json();
        toast.success(result.isSaved ? "Saved to wishlist" : "Removed from wishlist");
      }
    } catch (err) {
      // Revert on failure
      toggleSaveProperty(propertyId);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link href={`/property/${propertyId}`}>
          <img 
            src={imageUrl} 
            alt={data.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
          {data.category}
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-white/70 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md transition-all shadow-sm active:scale-90"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 text-slate-600 animate-spin" />
          ) : (
            <Heart className={`h-5 w-5 transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600 dark:text-slate-300'}`} />
          )}
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/property/${propertyId}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{data.title}</h3>
          </Link>
        </div>
        
        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1 text-blue-500/70" />
          <span className="line-clamp-1">{data.location?.city || 'Unknown'}, {data.location?.state || 'Unknown'}</span>
        </div>

        <div className="flex gap-4 items-center text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-medium"><Bed className="h-4 w-4 text-slate-400"/> {data.bedrooms || 2} Beds</div>
          <div className="flex items-center gap-1.5 font-medium"><Bath className="h-4 w-4 text-slate-400"/> {data.bathrooms || 1} Bath</div>
          <div className="flex items-center gap-1.5 font-medium"><Square className="h-4 w-4 text-slate-400"/> {data.area || 1200} sqft</div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-0.5">Price</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{data.price?.toLocaleString()} <span className="text-sm font-medium text-slate-500">/mo</span>
            </p>
          </div>
          <Link 
            href={`/property/${propertyId}`}
            className="px-5 py-2.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
