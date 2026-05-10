import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#030711] border-t border-[#802BB1]/15 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
      
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-[#802BB1]" />
              <span className="font-bold text-2xl text-white tracking-tighter">RentHub</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Skip the middleman. Directly connect with property owners and find your perfect home without the hassle of broker fees.
            </p>
            <div className="flex space-x-4">
              {/* <a href="#" className="text-slate-400 hover:text-white transition-transform hover:scale-110"><Twitter className="h-5 w-5" /></a> */}
              {/* <a href="#" className="text-slate-400 hover:text-white transition-transform hover:scale-110"><Instagram className="h-5 w-5" /></a> */}
              {/* <a href="#" className="text-slate-400 hover:text-white transition-transform hover:scale-110"><Linkedin className="h-5 w-5" /></a> */}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">Explore</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/browse?category=Apartment" className="hover:text-[#802BB1] transition-colors">Apartments</Link></li>
              <li><Link href="/browse?category=Villa" className="hover:text-[#802BB1] transition-colors">Villas</Link></li>
              <li><Link href="/browse?category=House" className="hover:text-[#802BB1] transition-colors">Houses</Link></li>
              <li><Link href="/browse?category=Commercial" className="hover:text-[#802BB1] transition-colors">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-[#802BB1] transition-colors">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-[#802BB1] transition-colors">Pricing</Link></li>
              <li><Link href="/" className="hover:text-[#802BB1] transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 uppercase tracking-[0.16em] text-sm">Resources</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-[#802BB1] transition-colors">Help & FAQ</Link></li>
              <li><Link href="/" className="hover:text-[#802BB1] transition-colors">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-[#802BB1] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#802BB1]/15 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} RentHub Inc. No brokers were harmed in the making of this site.</p>
        </div>
      </div>
    </footer>
  );
}
