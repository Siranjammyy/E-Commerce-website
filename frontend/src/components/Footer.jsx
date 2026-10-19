import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#181816] text-[#FAF8F5] border-t border-[#2A2A26] mt-auto">
      {/* Editorial Value Strip */}
      <div className="border-b border-[#2A2A26] py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="w-10 h-10 rounded-full border border-[#3A3A35] flex items-center justify-center text-[#A4C3AA] shrink-0">
                <Truck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif text-lg font-normal tracking-wide text-[#FAF8F5]">
                  Complimentary Shipping
                </h4>
                <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">
                  Carefully packed and dispatched worldwide on all orders exceeding $100.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="w-10 h-10 rounded-full border border-[#3A3A35] flex items-center justify-center text-[#A4C3AA] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif text-lg font-normal tracking-wide text-[#FAF8F5]">
                  Verified Authenticity
                </h4>
                <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">
                  Every piece in our catalog is inspected for acoustic balance and build integrity.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <span className="w-10 h-10 rounded-full border border-[#3A3A35] flex items-center justify-center text-[#A4C3AA] shrink-0">
                <RotateCcw className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-serif text-lg font-normal tracking-wide text-[#FAF8F5]">
                  Seamless Returns
                </h4>
                <p className="text-xs text-[#9E9E96] mt-1 leading-relaxed">
                  Thoughtfully supported 14-day return privilege with verified customer tracking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Manifesto */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl tracking-[0.22em] uppercase text-[#FAF8F5] block font-medium">
              VERO
            </span>
            <p className="text-xs text-[#9E9E96] leading-relaxed max-w-sm font-light">
              A curated collection of modern sound instruments, optics, and everyday computing essentials. Designed for contemplative spaces and high-fidelity living.
            </p>
            <div className="pt-2 text-[11px] text-[#71716A] uppercase tracking-wider font-medium">
              GUVI Full Stack Project Submission &bull; MERN Architecture
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#FAF8F5]">
              The Collection
            </h5>
            <ul className="space-y-2 text-xs text-[#9E9E96] font-normal">
              <li>
                <Link to="/" className="hover:text-[#FAF8F5] transition-colors">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link to="/?category=Audio" className="hover:text-[#FAF8F5] transition-colors">
                  Acoustic Systems
                </Link>
              </li>
              <li>
                <Link to="/?category=Electronics" className="hover:text-[#FAF8F5] transition-colors">
                  Workspace Compute
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#FAF8F5] transition-colors">
                  Your Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Account */}
          <div className="md:col-span-4 space-y-3">
            <h5 className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#FAF8F5]">
              Client Services
            </h5>
            <ul className="space-y-2 text-xs text-[#9E9E96] font-normal">
              <li>
                <Link to="/profile" className="hover:text-[#FAF8F5] transition-colors">
                  Order Status & Receipts
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FAF8F5] transition-colors">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <span className="text-[#71716A] block pt-2 text-[11px] leading-relaxed font-light">
                  Simulated Payment Mode: Integrated zero-configuration instant checkout for viva evaluation.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#262622] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#71716A] gap-4">
          <p>&copy; {new Date().getFullYear()} VERO. Curated Tech & Modern Living. Crafted for GUVI Full-Stack Submission.</p>
          <div className="flex items-center space-x-6 font-medium">
            <span>React 18 &bull; Redux &bull; Node.js &bull; MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
