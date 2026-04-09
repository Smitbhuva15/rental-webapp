import Link from 'next/link';
import Image from "next/image";
import { Search, MapPin, Building, ChevronRight, Star } from 'lucide-react';

const categories = [
  {
    name: "Apartments",
    image: "/appartment.jpg",
  },
  {
    name: "Villas",
    image: "/villa.jpg",
  },
  {
    name: "Houses",
    image: "/house.jpg",
  },
  {
    name: "Commercial",
    image: "/commercial.jpg",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 border-b border-white/10 pt-20 pb-32">
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900/90 z-10" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-float" />
          <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen opacity-50 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12 md:mt-24">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
            ✨ No Brokers. No Hidden Fees.
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
            Find Your Next Home <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Directly from Owners</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            RentHub eliminates the middleman. Interact directly with property owners, book instantly, and save thousands in broker commissions.
          </p>

          {/* Search Bar Widget */}
          {/* <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input type="text" placeholder="Location, City, or zip" className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            </div>
            <div className="flex-1 relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <select className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-slate-300 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            <button className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-95">
              <Search className="h-5 w-5" /> Search
            </button>
          </div> */}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Explore Categories</h2>
              <p className="text-slate-500">Browse properties by type to find exactly what you need.</p>
            </div>
            <Link href="/browse" className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item, i) => (
              <Link
                href={`/browse?category=${item.name}`}
                key={i}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                {/* Image */}
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-slate-800/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10 opacity-80" />

                {/* Text */}
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-white text-xl font-bold group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    Browse listings ➔
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-16">Why Choose RentHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-200 dark:border-blue-800/50">
                <span className="text-2xl font-bold">0%</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Zero Brokerage</h3>
              <p className="text-slate-500">Connect directly with verified owners. No agents, no middlemen, and absolutely zero broker commissions.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-green-200 dark:border-green-800/50">
                <Star className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Verified Listings</h3>
              <p className="text-slate-500">Every property and owner passes our rigorous verification process to ensure your safety and trust.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-purple-200 dark:border-purple-800/50">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Save Time</h3>
              <p className="text-slate-500">Instantly book properties, sign agreements digitally, and manage all your payments in one place.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
