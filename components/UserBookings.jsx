"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, CalendarCheck2, Clock, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import { motion } from 'framer-motion';
import { format, differenceInMonths, differenceInDays } from 'date-fns';

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
    return <LoadingState />;
  }

  if (bookings.length === 0) {
    return (
      <EmptyState 
        icon={CalendarCheck2}
        title="You haven't booked any house yet"
        description="Ready to find your next home? Discover amazing properties and book your stay today."
        action={
          <Link href="/browse">
            <button className="bg-gradient-to-r from-[#802BB1] to-[#b56cf5] hover:from-[#9a4ae0] hover:to-[#802BB1] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[#802BB1]/20 active:scale-95">
              Explore Properties
            </button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="bg-white/50 dark:bg-[#08090f]/50 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 dark:border-[#12131f] p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
          <CalendarCheck2 className="h-8 w-8 text-[#802BB1]" />
          My Bookings
        </h2>
        <span className="bg-[#802BB1]/10 text-[#802BB1] px-4 py-1.5 rounded-full font-bold text-sm">
          {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
        </span>
      </div>
      
      <div className="space-y-6">
        {bookings.map((booking, index) => {
          const property = booking.propertyId;
          // Skip if property is deleted/null and we want to remove fallback
          if (!property) return null;

          const title = property.title;
          const location = property.location || {};
          const imageUrl = (property.images && property.images.length > 0) ? property.images[0].url : 'https://placehold.co/400x300/1e293b/ffffff?text=No+Image';
          
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.endDate);
          let durationMonths = differenceInMonths(endDate, startDate);
          const durationDays = differenceInDays(endDate, startDate);
          
          if (durationMonths === 0 && durationDays >= 28) {
             durationMonths = 1;
          }

          const displayDuration = durationMonths > 0 ? `${durationMonths} ${durationMonths === 1 ? 'Month' : 'Months'}` : `${durationDays} ${durationDays === 1 ? 'Day' : 'Days'}`;

          return (
            <motion.div 
              key={booking._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden bg-white dark:bg-[#0d0f1b] rounded-2xl border border-slate-200 dark:border-[#1c2143] hover:border-[#802BB1]/50 dark:hover:border-[#802BB1]/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-[#802BB1]/10"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden flex-shrink-0">
                  <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[#802BB1] text-xs font-bold rounded-lg uppercase tracking-wider gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <Link href={`/property/${property._id}`}>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white hover:text-[#802BB1] transition-colors cursor-pointer mb-2 group-hover:text-[#802BB1]">
                        {title}
                      </h3>
                    </Link>
                    <div className="flex items-center text-slate-500 text-sm mb-6 font-medium">
                      <MapPin className="w-4 h-4 mr-1.5 text-slate-400" /> 
                      {location.city}, {location.state}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Check-in
                      </p>
                      <p className="font-bold text-slate-900 dark:text-slate-200">
                        {format(startDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Check-out
                      </p>
                      <p className="font-bold text-slate-900 dark:text-slate-200">
                        {format(endDate, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Duration
                      </p>
                      <p className="font-bold text-slate-900 dark:text-slate-200">
                        {displayDuration}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" /> Total Amount
                      </p>
                      <p className="font-bold text-[#802BB1] text-lg">
                        ₹{(booking.totalPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center px-6 border-l border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
                  <Link href={`/property/${property._id}`}>
                    <button className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-[#802BB1] group-hover:text-white group-hover:border-[#802BB1] transition-all duration-300">
                      <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
