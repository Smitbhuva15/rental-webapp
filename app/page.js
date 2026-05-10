"use client";

import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ChevronRight, Star, Quote, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';

const categories = [
  { name: "Apartments", image: "/appartment.jpg", count: "1,200+" },
  { name: "Villas", image: "/villa.jpg", count: "450+" },
  { name: "Houses", image: "/house.jpg", count: "800+" },
  { name: "Commercial", image: "/commercial.jpg", count: "250+" },
];

const mockProperties = [
  {
    _id: "p1",
    title: "Luxury Penthouse with City View",
    location: { city: "Mumbai", state: "MH" },
    price: 45000,
    category: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area: 2100,
      images: [{ url: "/apar10.jpeg" }]
  },
  {
    _id: "p2",
    title: "Cozy Suburban House",
    location: { city: "Bangalore", state: "KA" },
    price: 25000,
    category: "House",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
        images: [{ url: "/house.jpeg" }]

  },
  {
    _id: "p3",
    title: "Modern Sea-facing Villa",
    location: { city: "Goa", state: "GA" },
    price: 85000,
    category: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
        images: [{ url: "/villa2.jpeg" }]

  }
];

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('q', location);
    if (category) params.append('category', category);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#030711] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#030711] border-b border-[#802BB1]/25 pt-32 pb-40">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br bg-[#030711] z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#802BB1]/30 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#9a5afb]/20 rounded-full blur-[100px] mix-blend-screen opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#802BB1]/15 border border-[#802BB1]/25 text-[#e4d4ff] text-sm font-semibold mb-8 shadow-sm shadow-[#802BB1]/20">
              <SparklesIcon className="h-4 w-4" /> No Brokers. No Hidden Fees.
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Find Your Next Home <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c892ff] to-[#802BB1]">Directly from Owners</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-200/90 mb-12 leading-relaxed">
              RentHub eliminates the middleman. Interact directly with property owners, book instantly, and save thousands in broker commissions.
            </p>
          </motion.div>

          {/* Search Bar Widget */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-[#802BB1]/20 p-3 rounded-3xl shadow-[0_35px_120px_-80px_rgba(128,43,177,0.45)] flex flex-col md:flex-row gap-3 relative z-30"
          >
            <div className="flex-1 relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#802BB1] transition-colors" />
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location, City, or zip" 
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/5 border border-[#802BB1]/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#802BB1]/30 focus:bg-white/10 transition-all font-medium" 
              />
            </div>
            <div className="flex-1 relative group">
              <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-[#802BB1] transition-colors" />
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/5 border border-[#802BB1]/20 text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-[#802BB1]/30 focus:bg-white/10 transition-all font-medium cursor-pointer"
              >
                <option value="" className="text-white bg-[#190e1f]">Property Type</option>
                <option value="Apartment" className="text-white bg-[#190e1f]">Apartment</option>
                <option value="House" className="text-white bg-[#190e1f]">House</option>
                <option value="Villa" className="text-white bg-[#190e1f]">Villa</option>
              </select>
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#802BB1] to-[#b56cf5] hover:from-[#9a4ae0] hover:to-[#802BB1] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#802BB1]/30 active:scale-95">
              <Search className="h-5 w-5" /> Search
            </button>
          </motion.form>
        </div>
      </section>

      {/* Featured Properties */}
      {/* <section className="py-24 bg-slate-50 dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-3">Featured Properties</h2>
              <p className="text-slate-500 text-lg">Handpicked properties directly from verified owners.</p>
            </motion.div>
            <Link href="/browse" className="hidden md:flex text-blue-600 dark:text-blue-400 font-bold items-center gap-1 hover:gap-2 transition-all">
              View all listings <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProperties.map((property, index) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
            <Link href="/browse" className="inline-flex items-center gap-2 font-bold text-blue-600">
              View all listings <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section> */}

      {/* Featured Categories */}
      <section className="py-24 border-b border-[#802BB1]/25  ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 mb-4">Explore by Category</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Find exactly what you need from our wide range of property categories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/browse?category=${item.name}`}
                  className="group relative rounded-3xl overflow-hidden aspect-[6/5] block shadow-[0_20px_80px_-35px_rgba(128,43,177,0.35)]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#030711] via-[#451d62]/65 to-transparent opacity-90" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h3 className="text-slate-100 text-2xl font-bold mb-1">{item.name}</h3>
                    <p className="text-slate-300 font-medium mb-4">{item.count} properties</p>
                    <div className="w-10 h-10 rounded-full bg-[#802BB1]/20 backdrop-blur-md flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-[#802BB1]/20">
                      <ChevronRight className="text-[#f3e8ff] h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-[#040711] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#802BB1]/12 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-[#c8a7ff] font-bold tracking-wider uppercase text-sm mb-2 block">Benefits</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-100">Why Choose RentHub?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Zero Brokerage", desc: "Connect directly with verified owners. No agents, no middlemen, and absolutely zero broker commissions." },
              { icon: ShieldCheck, title: "Verified Listings", desc: "Every property and owner passes our rigorous verification process to ensure your safety and trust." },
              { icon: CheckCircle2, title: "Instant Booking", desc: "Instantly book properties, sign agreements digitally, and manage all your payments in one secure place." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white/5 p-8 rounded-3xl shadow-[0_25px_60px_-30px_rgba(128,43,177,0.35)] border border-[#802BB1]/20 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="h-16 w-16 bg-[#802BB1]/15 text-[#e9d4ff] rounded-2xl flex items-center justify-center mb-8 shadow-[0_15px_30px_rgba(128,43,177,0.25)]">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-100 mb-4">{feature.title}</h3>
                <p className="text-slate-300 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#030711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-100 mb-4">What Our Users Say</h2>
            <p className="text-slate-400 text-lg">Thousands of happy tenants and owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 p-8 rounded-3xl relative border border-[#802BB1]/20 shadow-[0_25px_60px_-40px_rgba(128,43,177,0.35)]">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-[#802BB1]/20" />
              <div className="flex items-center gap-2 text-[#d7b3ff] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current h-5 w-5" />)}
              </div>
              <p className="text-slate-200 text-lg italic mb-8">"I saved over ₹50,000 in broker fees. The process was seamless, and the owner was very professional. Highly recommend RentHub!"</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-[#802BB1]/15 rounded-full flex items-center justify-center font-bold text-[#f5e8ff]">AK</div>
                <div>
                  <h4 className="font-bold text-slate-100">Aman Kumar</h4>
                  <p className="text-slate-400 text-sm">Tenant in Bangalore</p>
                </div>
              </div>
            </div>
            <div className="bg-white/5 p-8 rounded-3xl relative border border-[#802BB1]/20 shadow-[0_25px_60px_-40px_rgba(128,43,177,0.35)]">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-[#802BB1]/20" />
              <div className="flex items-center gap-2 text-[#d7b3ff] mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current h-5 w-5" />)}
              </div>
              <p className="text-slate-200 text-lg italic mb-8">"Listing my property was incredibly easy. I found a verified tenant within 3 days without dealing with any annoying real estate agents."</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-[#802BB1]/15 rounded-full flex items-center justify-center font-bold text-[#f5e8ff]">SJ</div>
                <div>
                  <h4 className="font-bold text-slate-100">Sneha Joshi</h4>
                  <p className="text-slate-400 text-sm">Property Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}
