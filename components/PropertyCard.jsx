"use client";
import Link from 'next/link';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';

export default function PropertyCard({ property }) {
  // If property is undefined for showcase purposes, mock it
  const data = property || {
    id: "1",
    title: "Luxury Modern Apartment",
    location: { city: "New York", state: "NY", address: "123 Central Ave" },
    price: 3500,
    category: "Apartment",
    images: [{ url: "https://placehold.co/600x400/1e293b/ffffff?text=Property+Image" }] // placeholder
  };

  const imageUrl = data.images && data.images[0] ? data.images[0].url : "https://placehold.co/600x400/1e293b/ffffff?text=No+Image";

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 block flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={imageUrl} 
          alt={data.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200">
          {data.category}
        </div>
        <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 backdrop-blur-md transition-all">
          <Heart className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/property/${data.id || data._id}`} className="hover:text-primary transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{data.title}</h3>
          </Link>
        </div>
        
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1 text-primary/70" />
          <span className="line-clamp-1">{data.location.city}, {data.location.state}</span>
        </div>

        <div className="flex gap-4 items-center text-sm text-slate-600 dark:text-slate-400 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 font-medium"><Bed className="h-4 w-4"/> 2 Beds</div>
          <div className="flex items-center gap-1.5 font-medium"><Bath className="h-4 w-4"/> 1 Bath</div>
          <div className="flex items-center gap-1.5 font-medium"><Square className="h-4 w-4"/> 1200 sqft</div>
        </div>
        
        <div className="flex justify-between items-center mt-auto">
          <div>
            <p className="text-sm text-slate-500">Price</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{data.price.toLocaleString()} <span className="text-sm font-medium text-slate-500">/mo</span>
            </p>
          </div>
          <Link 
            href={`/property/${data.id || data._id}`}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-900 dark:text-white rounded-xl font-semibold transition-colors"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
