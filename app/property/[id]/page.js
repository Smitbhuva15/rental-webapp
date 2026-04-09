"use client";

import { use, useState, useEffect } from 'react';
import { MapPin, Bed, Bath, Square, Calendar, User, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PropertyDetails({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const router = useRouter();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle');
  
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('11'); // Number of months

  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error('Failed to fetch property details');
        const data = await res.json();
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

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
      alert('Please select a start date');
      return;
    }

    setBookingStatus('loading');
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
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
        alert(data.message || "Server error. Please try again.");
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
              startDate,
              months: duration,
              amount: data.amount
            })
          }).then((t) => t.json());

          if (verifyData.message === 'Payment verified successfully') {
            setBookingStatus('success');
            setTimeout(() => {
              router.push('/dashboard');
            }, 1500);
          } else {
            alert('Payment verification failed');
            setBookingStatus('idle');
          }
        },
        prefill: {
           name: "RentHub User",
           email: "user@example.com",
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
        setBookingStatus('idle');
      });

    } catch (err) {
      console.error(err);
      alert('Booking request failed');
      setBookingStatus('idle');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 text-center text-red-500 font-bold">
        {error || 'Property not found'}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Gallery */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{property.category}</span>
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
          
          <div className="w-full rounded-3xl overflow-hidden aspect-[2/1] md:h-[500px]">
             <img 
               src={property.images && property.images.length > 0 ? property.images[0].url : 'https://placehold.co/1200x600/1e293b/ffffff?text=No+Image'} 
               alt="Main" 
               className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" 
             />
          </div>
        </div>

        {/* Content & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats - Using placeholders for demo as these aren't currently in data model */}
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
            {property.amenities && property.amenities.length > 0 && (
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Amenities</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
                   {property.amenities.map((item, index) => (
                     <div key={index} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                       <div className="h-2 w-2 rounded-full bg-primary" /> {item}
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Booking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl sticky top-24">
               {/* Mobile price duplicate */}
               <div className="md:hidden flex justify-between items-end pb-6 border-b border-slate-100 dark:border-slate-800 mb-6">
                 <p className="text-3xl font-black text-slate-900 dark:text-white">₹{property.price?.toLocaleString() || property.price}</p>
                 <p className="text-sm text-slate-500">/ month</p>
               </div>

               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Book Viewing / Rent</h3>
               
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                   <div className="relative">
                     <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                     <input 
                       type="date"
                       value={startDate}
                       onChange={(e) => setStartDate(e.target.value)}
                       className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" 
                     />
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                   <select 
                     value={duration}
                     onChange={(e) => setDuration(e.target.value)}
                     className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary text-slate-900 dark:text-white"
                   >
                     <option value="11">11 Months Agreement</option>
                     <option value="24">24 Months Agreement</option>
                   </select>
                 </div>
                 
                 <div className="pt-2 pb-4 flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">Total Amount:</span>
                    <span className="font-bold text-lg text-slate-900 dark:text-white">
                      ₹{((property.price || 0) * parseInt(duration)).toLocaleString()}
                    </span>
                 </div>
               </div>

               <button 
                onClick={handleBook}
                disabled={bookingStatus === 'loading' || bookingStatus === 'success'}
                className="w-full bg-primary hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
               >
                 {bookingStatus === 'idle' && "Book Now"}
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
                       <p className="font-bold text-slate-900 dark:text-white">{property.ownerId?.name || 'Unknown Owner'}</p>
                       <p className="text-sm text-slate-500">Property Owner</p>
                     </div>
                   </div>
                   <ShieldCheck className="h-6 w-6 text-green-500" title="Verified Owner"/>
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
