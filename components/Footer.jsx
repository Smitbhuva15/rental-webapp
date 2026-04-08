import Link from 'next/link';
import { Home} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-6 w-6 text-primary" />
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
            <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">Explore</h3>
            <ul className="space-y-3">
              <li><Link href="/browse?category=Apartment" className="hover:text-primary transition-colors text-sm">Apartments</Link></li>
              <li><Link href="/browse?category=Villa" className="hover:text-primary transition-colors text-sm">Villas</Link></li>
              <li><Link href="/browse?category=House" className="hover:text-primary transition-colors text-sm">Houses</Link></li>
              <li><Link href="/browse?category=Commercial" className="hover:text-primary transition-colors text-sm">Commercial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors text-sm">Pricing</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4 tracking-wide uppercase text-sm">Resources</h3>
            <ul className="space-y-3">
              <li><Link href="/faq" className="hover:text-primary transition-colors text-sm">Help & FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} RentHub Inc. No brokers were harmed in the making of this site.</p>
        </div>
      </div>
    </footer>
  );
}
