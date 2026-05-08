"use client";

import Link from 'next/link';
import Image from "next/image";
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
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-white/10 pt-32 pb-40">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900/90 z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-8 shadow-sm">
              <SparklesIcon className="h-4 w-4" /> No Brokers. No Hidden Fees.
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
              Find Your Next Home <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Directly from Owners</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-12 leading-relaxed">
              RentHub eliminates the middleman. Interact directly with property owners, book instantly, and save thousands in broker commissions.
            </p>
          </motion.div>

          {/* Search Bar Widget */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row gap-3 relative z-30"
          >
            <div className="flex-1 relative group">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
              <input type="text" placeholder="Location, City, or zip" className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium" />
            </div>
            <div className="flex-1 relative group">
              <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
              <select className="w-full pl-14 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white/10 transition-all font-medium cursor-pointer">
                <option value="" className="text-slate-900">Property Type</option>
                <option value="Apartment" className="text-slate-900">Apartment</option>
                <option value="House" className="text-slate-900">House</option>
                <option value="Villa" className="text-slate-900">Villa</option>
              </select>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 active:scale-95">
              <Search className="h-5 w-5" /> Search
            </button>
          </motion.div>
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
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Explore by Category</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Find exactly what you need from our wide range of property categories.</p>
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
                  className="group relative rounded-3xl overflow-hidden aspect-[4/5] block shadow-lg"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80" />
                  
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h3 className="text-white text-2xl font-bold mb-1">{item.name}</h3>
                    <p className="text-slate-300 font-medium mb-4">{item.count} properties</p>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <ChevronRight className="text-white h-5 w-5" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">Benefits</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white">Why Choose RentHub?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: Zap, title: "Zero Brokerage", desc: "Connect directly with verified owners. No agents, no middlemen, and absolutely zero broker commissions.", color: "blue" },
              { icon: ShieldCheck, title: "Verified Listings", desc: "Every property and owner passes our rigorous verification process to ensure your safety and trust.", color: "green" },
              { icon: CheckCircle2, title: "Instant Booking", desc: "Instantly book properties, sign agreements digitally, and manage all your payments in one secure place.", color: "purple" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300"
              >
                <div className={`h-16 w-16 bg-${feature.color}-100 dark:bg-${feature.color}-500/10 text-${feature.color}-600 dark:text-${feature.color}-400 rounded-2xl flex items-center justify-center mb-8`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4">What Our Users Say</h2>
            <p className="text-slate-500 text-lg">Thousands of happy tenants and owners.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl relative border border-slate-100 dark:border-slate-800">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-blue-500/10" />
              <div className="flex items-center gap-2 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current h-5 w-5" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-lg italic mb-8">"I saved over ₹50,000 in broker fees. The process was seamless, and the owner was very professional. Highly recommend RentHub!"</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700">AK</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Aman Kumar</h4>
                  <p className="text-slate-500 text-sm">Tenant in Bangalore</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl relative border border-slate-100 dark:border-slate-800">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-purple-500/10" />
              <div className="flex items-center gap-2 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => <Star key={i} className="fill-current h-5 w-5" />)}
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-lg italic mb-8">"Listing my property was incredibly easy. I found a verified tenant within 3 days without dealing with any annoying real estate agents."</p>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-700">SJ</div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Sneha Joshi</h4>
                  <p className="text-slate-500 text-sm">Property Owner</p>
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
