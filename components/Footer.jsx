import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030711] border-t border-[#802BB1]/15 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-tr from-[#802BB1] to-[#bd6eff] p-2 rounded-2xl text-white shadow-[0_18px_50px_-35px_rgba(128,43,177,0.85)]">
                <Home className="h-5 w-5" />
              </div>

              <span className="font-bold text-2xl text-white tracking-tighter">
                RentHub
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Skip the middleman. Directly connect with property owners and
              find your perfect home without the hassle of broker fees.
            </p>

            <div className="flex space-x-4">
              {/* Social Icons */}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">
              Explore
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/browse?category=Apartment"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Apartments
                </Link>
              </li>

              <li>
                <Link
                  href="/browse?category=Villa"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Villas
                </Link>
              </li>

              <li>
                <Link
                  href="/browse?category=House"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Houses
                </Link>
              </li>

              <li>
                <Link
                  href="/browse?category=Commercial"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">
              Company
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">
              Resources
            </h3>

            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Help & FAQ
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="hover:text-[#802BB1] transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 pt-8 border-t border-[#802BB1]/15">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Copyright */}
            <p className="text-sm text-slate-500 text-center lg:text-left">
              &copy; {new Date().getFullYear()} RentHub Inc. No brokers were harmed in the making of this site.
            </p>

            {/* Developer Credit */}
            <div className="group relative overflow-hidden rounded-full border border-[#802BB1]/20 bg-white/[0.03] backdrop-blur-xl px-6 py-3 transition-all duration-500 hover:border-[#802BB1]/40 hover:shadow-[0_0_40px_rgba(128,43,177,0.18)]">
              
              {/* Glow Background */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-r from-[#802BB1]/10 via-[#a855f7]/10 to-[#c084fc]/10 blur-2xl"></div>

              {/* Text */}
              <p className="relative z-10 text-sm md:text-[15px] font-medium tracking-wide text-slate-300 text-center">
                Designed, Developed & Maintained By{" "}
                
                <span className="font-bold bg-linear-to-r from-[#802BB1] via-[#a855f7] to-[#d8b4fe] bg-clip-text text-transparent">
                  ❤️ Smit Bhuva
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}