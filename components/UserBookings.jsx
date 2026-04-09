"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Building, CalendarCheck2 } from 'lucide-react';
import Link from 'next/link';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="bg-primary/10 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarCheck2 className="w-10 h-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">You haven’t booked any house yet</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">
          Ready to find your next home ?
        </p>
        <Link href="/">
          <button className="bg-primary hover:bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20">
            Explore Properties
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Active Bookings</h2>
      
      <div className="space-y-4">
        {bookings.map((booking) => {
          // Add safe fallback for property details in case property was deleted
          const property = booking.propertyId || {};
          const title = property.title || "No Longer Available";
          const location = property.location || {};
          const imageUrl = (property.images && property.images.length > 0) ? property.images[0].url : 'https://placehold.co/200x200/1e293b/ffffff?text=No+Image';
          
          return (
            <div key={booking._id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="h-24 w-24 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 w-full text-center md:text-left">
                <Link href={`/property/${property._id || ''}`}>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white hover:text-primary transition-colors cursor-pointer inline-block mb-1">
                    {title}
                  </h3>
                </Link>
                <div className="flex items-center justify-center md:justify-start text-slate-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-1" /> {location.city || "Unknown City"}, {location.state || "Unknown State"}
                </div>
                
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold rounded-lg uppercase tracking-wider gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  {booking.status}
                </div>
              </div>
              
              <div className="border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 w-full md:w-auto pt-4 md:pt-0 md:pl-6 text-center md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                <div className="mb-0 md:mb-3">
                  <p className="text-slate-500 text-xs mb-0.5 uppercase tracking-wide font-medium">Agreement Value</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">₹{(booking.totalPrice || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs flex items-center gap-1 justify-center md:justify-end mb-0.5 uppercase tracking-wide font-medium">
                    <Calendar className="w-3 h-3" /> Start Date
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white text-[15px]">
                    {new Date(booking.startDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
