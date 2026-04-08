"use client";

import { use, useState } from 'react';
import { MapPin, Bed, Bath, Square, Calendar, User, ShieldCheck } from 'lucide-react';

export default function PropertyDetails({ params }) {
  // Extract id gracefully
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success

  // Mock property
  const property = {
    id,
    title: "Luxury Modern Apartment in Downtown",
    price: 45000,
    category: "Apartment",
    location: { address: "401 Palm Avenue", city: "Mumbai", state: "MH", zipCode: "400050" },
    description: "Experience luxury living in the heart of the city. This stunning apartment features floor-to-ceiling windows, premium appliances, and breathtaking skyline views. Enjoy the building's unparalleled amenities including a rooftop pool and fitness center. No broker fees attached.",
    amenities: ["WiFi", "Gym", "Pool", "Parking", "Security 24/7"],
    images: [
      { url: "https://placehold.co/1200x600/1e293b/ffffff?text=Main+Property+Image" },
      { url: "https://placehold.co/600x400/334155/ffffff?text=Living+Room" },
      { url: "https://placehold.co/600x400/0f172a/ffffff?text=Bedroom" }
    ],
    owner: { name: "Rajesh S.", rating: 4.8, verified: true }
  };

  const handleBook = () => {
    setBookingStatus('loading');
    setTimeout(() => setBookingStatus('success'), 1500);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Gallery */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{property.category}</span>
                <span className="flex items-center text-slate-500 text-sm"><MapPin className="h-4 w-4 mr-1" /> {property.location.city}, {property.location.state}</span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{property.title}</h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">₹{property.price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden aspect-[2/1] md:aspect-auto md:h-[500px]">
             <div className="md:col-span-2 h-full">
               <img src={property.images[0].url} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
             </div>
             <div className="hidden md:flex flex-col gap-4 h-full">
               <img src={property.images[1].url} alt="Living Room" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700" />
               <img src={property.images[2].url} alt="Bedroom" className="w-full h-1/2 object-cover hover:scale-105 transition-transform duration-700" />
             </div>
          </div>
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="flex gap-8 py-6 border-y border-slate-200 dark:border-slate-800">
              <div className="flex gap-3 items-center"><Bed className="h-6 w-6 text-slate-400"/> <div><p className="text-xl font-bold text-slate-900 dark:text-white">3</p><p className="text-sm text-slate-500">Bedrooms</p></div></div>
              <div className="flex gap-3 items-center"><Bath className="h-6 w-6 text-slate-400"/> <div><p className="text-xl font-bold text-slate-900 dark:text-white">2</p><p className="text-sm text-slate-500">Bathrooms</p></div></div>
              <div className="flex gap-3 items-center"><Square className="h-6 w-6 text-slate-400"/> <div><p className="text-xl font-bold text-slate-900 dark:text-white">1,450</p><p className="text-sm text-slate-500">Square Ft</p></div></div>
            </div>

            {/* Description */}
            <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About the Property</h2>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">{property.description}</p>
            </div>

            {/* Amenities */}
            <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Amenities</h2>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                 {property.amenities.map(item => (
                   <div key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                     <div className="h-2 w-2 rounded-full bg-primary" /> {item}
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
               {/* Mobile price duplicate */}
               <div className="md:hidden flex justify-between items-end pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                 <p className="text-3xl font-black text-slate-900 dark:text-white">₹{property.price.toLocaleString()}</p>
                 <p className="text-sm text-slate-500">/ month</p>
               </div>

               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Book Viewing / Rent</h3>
               
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                     <input type="date" className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                   <select className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white">
                     <option>11 Months Agreement</option>
                     <option>24 Months Agreement</option>
                   </select>
                 </div>
               </div>

               <button 
                onClick={handleBook}
                disabled={bookingStatus !== 'idle'}
                className="w-full bg-primary hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
               >
                 {bookingStatus === 'idle' && "Request Booking"}
                 {bookingStatus === 'loading' && <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                 {bookingStatus === 'success' && "Sent Successfully!"}
               </button>

               <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                       <User className="h-6 w-6 text-slate-500" />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900 dark:text-white">{property.owner.name}</p>
                       <p className="text-sm text-slate-500">Property Owner</p>
                     </div>
                   </div>
                   {property.owner.verified && <ShieldCheck className="h-6 w-6 text-green-500" title="Verified Owner"/>}
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
