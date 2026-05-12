"use client";

import { use, useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Calendar, User, ShieldCheck, CheckCircle2, Heart, MessageCircle, AlertCircle, Info, Zap, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import LoadingState from '@/components/LoadingState';
import ImageCarousel from '@/components/ImageCarousel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addMonths, startOfDay, isWithinInterval, format } from 'date-fns';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';


export default function PropertyDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState('1'); // Number of months
  const [guestCount, setGuestCount] = useState(1);
  const [endDate, setEndDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [isDateUnavailable, setIsDateUnavailable] = useState(false);

  const { user, savedProperties, toggleSaveProperty } = useStore();
  const isSaved = savedProperties?.includes(id);

  const handleSave = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    toggleSaveProperty(id);
    if (!isSaved) toast.success("Property saved!");
  };

  const isOwner = property?.ownerId?._id === user?.id || property?.ownerId === user?.id;

  useEffect(() => {
    async function fetchPropertyAndBookings() {
      try {
        const [propRes, bookRes] = await Promise.all([
          fetch(`/api/properties/${id}`),
          fetch(`/api/properties/${id}/bookings`)
        ]);
        
        if (!propRes.ok) throw new Error('Failed to fetch property details');
        const data = await propRes.json();
        setProperty(data);
        
        if (bookRes.ok) {
          const bData = await bookRes.json();
          setBookedDates(bData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPropertyAndBookings();
  }, [id]);

  useEffect(() => {
    if (startDate) {
      const end = addMonths(startDate, parseInt(duration));
      setEndDate(end);

      // Check for overlap
      const hasOverlap = bookedDates.some(booking => {
        const bStart = new Date(booking.startDate);
        const bEnd = new Date(booking.endDate);
        return (startDate < bEnd && end > bStart);
      });
      setIsDateUnavailable(hasOverlap);
    } else {
      setEndDate(null);
      setIsDateUnavailable(false);
    }
  }, [startDate, duration, bookedDates]);

  const disabledDateRanges = bookedDates.map(b => ({
    start: new Date(b.startDate),
    end: new Date(b.endDate)
  }));

  const isDateDisabled = (date) => {
    return disabledDateRanges.some(range => {
      return isWithinInterval(date, { start: startOfDay(range.start), end: startOfDay(range.end) });
    });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBook = async () => {
    if (!startDate) {
      toast.error('Please select a check-in date');
      return;
    }
    if (isDateUnavailable) {
      toast.error('Selected dates are unavailable');
      return;
    }

    setBookingStatus('loading');
    const res = await loadRazorpay();

    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setBookingStatus('idle');
      return;
    }

    try {
      const response = await fetch('/api/bookings/create', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: id, months: duration })
      });
      const data = await response.json();
      
      if (!response.ok || !data.order) {
        toast.error(data.message || "Server error. Please try again.");
        setBookingStatus('idle');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key', 
        amount: data.order.amount,
        currency: data.order.currency,
        name: "RentHub Booking",
        description: `Booking for ${duration} Months`,
        order_id: data.order.id,
        handler: async function (response) {
          const verifyData = await fetch('/api/bookings/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              propertyId: id,
              startDate: startDate ? startDate.toISOString() : null,
              months: duration,
              amount: data.amount
            })
          }).then((t) => t.json());

          if (verifyData.message === 'Payment verified successfully') {
            setBookingStatus('success');
            toast.success("Reserved Successfully!");
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } else {
            toast.error('Payment verification failed');
            setBookingStatus('idle');
          }
        },
        prefill: {
           name: user?.name || "RentHub User",
           email: user?.email || "user@example.com",
           contact: "9999999999"
        },
        theme: {
          color: "#3b82f6"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // Reset loading state if modal is manually closed
      paymentObject.on('payment.failed', function () {
        toast.error("Your house cannot be booked");
        setBookingStatus('idle');
      });

    } catch (err) {
      console.error(err);
      toast.error('Booking request failed');
      setBookingStatus('idle');
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error || !property) {
    return (
      <div className="py-20">
        <EmptyState 
          title="Property Not Found" 
          description={error || "The property you are looking for doesn't exist or has been removed."} 
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#030711] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Gallery */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[#802BB1]  px-3 py-1 rounded-full text-sm font-bold">{property.category}</span>
                <span className="flex items-center text-slate-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" /> 
                  {property.location?.city || "Unknown City"}, {property.location?.state || "Unknown State"}
                </span>
              </div>
              <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{property.title}</h1>
            </div>

            <div className="text-right hidden md:block">
              <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">₹{property.price?.toLocaleString() || property.price}</p>
            </div>
          </div>
          <div className="mb-8">
            <ImageCarousel images={property.images} altText={property.title} />
          </div>
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 py-8 border-y border-slate-200 dark:border-slate-800/50">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                <Bed className="h-8 w-8 text-[#802BB1] mb-2"/>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{property.bedrooms || 1}</p>
                <p className="text-sm text-slate-500 font-medium">Bedrooms</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                <Bath className="h-8 w-8 text-[#802BB1] mb-2"/>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{property.bathrooms || 1}</p>
                <p className="text-sm text-slate-500 font-medium">Bathrooms</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl">
                <Square className="h-8 w-8 text-[#802BB1] mb-2"/>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{property.area || 0}</p>
                <p className="text-sm text-slate-500 font-medium">Square Ft</p>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">About the Property</h2>
               <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="pt-4">
                 <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Amenities</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                   {property.amenities.map((item, index) => (
                     <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#802BB1]">
                         <CheckCircle2 className="h-5 w-5" />
                       </div>
                       <span className="font-medium text-slate-700 dark:text-slate-300">{item}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800 rounded-[2rem] p-6 shadow-2xl sticky top-24"
            >
               {/* Mobile price duplicate */}
               <div className="md:hidden flex justify-between items-end pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                 <p className="text-3xl font-black text-slate-900 dark:text-white">₹{property.price?.toLocaleString() || property.price}</p>
                 <p className="text-sm text-slate-500">/ month</p>
               </div>

               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                   Book Now
                 </h3>
                 <div className="flex gap-2">
                   <button 
                     onClick={handleSave}
                     className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
                     title="Save Property"
                   >
                     <Heart className={`h-5 w-5 ${isSaved ? 'text-red-500 fill-red-500' : ''}`} />
                   </button>
                 </div>
               </div>
               
               {isOwner ? (
                 <div className="space-y-5 text-center py-6">
                   <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Home className="h-8 w-8 text-[#802BB1]" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">You own this property</h3>
                   <p className="text-slate-500 text-sm">You cannot book your own property. Would you like to edit it instead?</p>
                   <button 
                     onClick={() => router.push(`/dashboard/edit-property/${id}`)}
                     className="w-full mt-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold py-3.5 rounded-xl transition-all"
                   >
                     Edit Property
                   </button>
                 </div>
               ) : (
                 <>
                   <div className="space-y-5 mb-6">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Check-in Date</label>
                     <div className="relative">
                       <DatePicker
                         selected={startDate}
                         onChange={(date) => setStartDate(date)}
                         minDate={new Date()}
                         filterDate={(date) => !isDateDisabled(date)}
                         placeholderText="Select start date"
                         className="w-full pl-10 pr-3 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white transition-all font-medium"
                         wrapperClassName="w-full"
                       />
                       <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
                     </div>
                   </div>

                   <div className="col-span-1">
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                     <select 
                       value={duration}
                       onChange={(e) => setDuration(e.target.value)}
                       className="w-full px-3 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white font-medium appearance-none transition-all"
                     >
                       <option value="1">1 Month</option>
                       <option value="2">2 Months</option>
                       <option value="3">3 Months</option>
                       <option value="6">6 Months</option>
                       <option value="12">12+ Months</option>
                     </select>
                   </div>

                   <div className="col-span-1">
                     <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Guests</label>
                     <select 
                       value={guestCount}
                       onChange={(e) => setGuestCount(Number(e.target.value))}
                       className="w-full px-3 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white font-medium appearance-none transition-all"
                     >
                       {[1,2,3,4,5,6].map(num => (
                         <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                       ))}
                     </select>
                   </div>
                 </div>

                 {isDateUnavailable && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-start gap-2 text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20 text-sm font-medium">
                     <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                     <p>If you cannot select dates, this house is already booked by another user.</p>
                   </motion.div>
                 )}

                 {startDate && !isDateUnavailable && endDate && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 p-3 rounded-xl border border-green-100 dark:border-green-500/20 text-sm font-medium">
                     <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                     <p>Available! Checkout on {format(endDate, 'MMM dd, yyyy')}</p>
                   </motion.div>
                 )}

                 <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 space-y-3">
                   <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-sm">
                     <span>₹{property.price?.toLocaleString()} x {duration} {duration === '1' ? 'month' : 'months'}</span>
                     <span className="font-medium text-slate-900 dark:text-white">₹{((property.price || 0) * parseInt(duration)).toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 text-sm">
                     <span className="flex items-center gap-1 underline decoration-dashed underline-offset-4 cursor-help" title="Standard cleaning and processing fee">Service fee <Info className="h-3 w-3"/></span>
                     <span className="font-medium text-slate-900 dark:text-white">₹{parseInt(duration) * 0}</span>
                   </div>
                   <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                     <span className="font-bold text-slate-900 dark:text-white">Total Amount</span>
                     <span className="font-black text-xl text-[#802BB1]">
                       ₹{((property.price || 0) * parseInt(duration) + (parseInt(duration) * 0)).toLocaleString()}
                     </span>
                   </div>
                 </div>
               </div>

               <button 
                onClick={handleBook}
                disabled={bookingStatus === 'loading' || bookingStatus === 'success' || isDateUnavailable}
                className="w-full  disabled:from-slate-400 disabled:to-slate-500 text-white font-bold py-4 rounded-2xl transition-all flex bg-gradient-to-r from-[#802BB1] to-[#b56cf5] hover:from-[#9a4ae0] hover:to-[#802BB1] justify-center items-center gap-2 shadow-xl shadow-primary/30 transform hover:scale-[1.02] active:scale-[0.98]"
               >
                 {bookingStatus === 'idle' && "Reserve Booking"}
                 {bookingStatus === 'loading' && <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                 {bookingStatus === 'success' && "Reserved Successfully!"}
               </button>
               
               <p className="text-center text-xs text-slate-500 mt-4 font-medium">You won&apos;t be charged yet</p>
                 </>
               )}

               <div className="mt-8 space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                   <div className="flex items-center gap-3">
                     <div className="h-12 w-12 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-sm">
                       <User className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                     </div>
                     <div>
                       <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                         {property.ownerId?.name || 'Owner'} 
                         <ShieldCheck className="h-4 w-4 text-green-500" title="Verified Owner"/>
                       </p>
                       <p className="text-xs text-slate-500">Joined recently</p>
                     </div>
                   </div>
                  
                 </div>
                 
                
               </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
