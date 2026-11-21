'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Mail,
  Globe,
  ClipboardList,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Layers,
  Search,
  Cog,
  Disc,
  SlidersHorizontal,
  Cpu,
  Wind,
  Package,
  ShieldCheck,
  Building2,
  Phone
} from 'lucide-react';
import { useEnquiry } from '@/lib/enquiryContext';

interface HeaderProps {
  onOpenDrawer?: () => void;
}

export default function Header({ onOpenDrawer }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalCount } = useEnquiry();
  const pathname = usePathname();

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleOpenRfq = () => {
    if (onOpenDrawer) {
      onOpenDrawer();
    } else {
      const drawerEvent = new CustomEvent('open-rfq-drawer');
      window.dispatchEvent(drawerEvent);
    }
  };

  return (
    <>
      {/* 1. TOP EXPORT INFO BAR */}
      <div className="bg-[#0a203a] text-[#e8f0fa] text-xs border-b border-white/10 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5 opacity-90">
              <Globe className="w-3.5 h-3.5 text-brand-orange" />
              <span>Global Automotive Parts Trading &amp; Supply</span>
            </span>
            <a
              href="mailto:contect@hastinamotorparts.in"
              className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-white transition-opacity"
            >
              <Mail className="w-3.5 h-3.5 text-brand-orange" />
              <span>contect@hastinamotorparts.in</span>
            </a>
            <a
              href="tel:+919717829768"
              className="inline-flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-white transition-opacity"
            >
              <Phone className="w-3.5 h-3.5 text-brand-orange" />
              <span>+91 97178 29768</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-[11px]">Follow Us:</span>
            <div className="flex items-center gap-3 text-slate-300 font-bold text-xs">
              <a href="#" className="hover:text-brand-orange transition-colors">in</a>
              <a href="#" className="hover:text-brand-orange transition-colors">◎</a>
              <a href="#" className="hover:text-brand-orange transition-colors">▶</a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">

            {/* Brand Logo (Official Alisons Globe + Gear Emblem) */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 124 124"
                className="w-10 h-10 md:w-12 md:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105"
                aria-label="Alisons General Trading Logo"
              >
                <g transform="translate(2,2)">
                  <path
                    d="M106.5,53.3 L117.8,55.4 L117.8,64.6 L106.5,66.7 L103.7,77.4 L112.3,85.0 L107.8,92.9 L96.9,89.1 L89.1,96.9 L92.9,107.8 L85.0,112.3 L77.4,103.7 L66.7,106.5 L64.6,117.8 L55.4,117.8 L53.3,106.5 L42.6,103.7 L35.0,112.3 L27.1,107.8 L30.9,96.9 L23.1,89.1 L12.2,92.9 L7.7,85.0 L16.3,77.4 L13.5,66.7 L2.2,64.6 L2.2,55.4 L13.5,53.3 L16.3,42.6 L7.7,35.0 L12.2,27.1 L23.1,30.9 L30.9,23.1 L27.1,12.2 L35.0,7.7 L42.6,16.3 L53.3,13.5 L55.4,2.2 L64.6,2.2 L66.7,13.5 L77.4,16.3 L85.0,7.7 L92.9,12.2 L89.1,23.1 L96.9,30.9 L107.8,27.1 L112.3,35.0 L103.7,42.6 Z M94,60 A34,34 0 1,0 26,60 A34,34 0 1,0 94,60 Z"
                    fill="#0B2545"
                    fillRule="evenodd"
                  />
                  <circle cx="60" cy="62" r="26" fill="#0B2545" />
                  <ellipse cx="60" cy="62" rx="14" ry="26" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="60" y1="36" x2="60" y2="88" stroke="#FFFFFF" strokeWidth="2" />
                  <line x1="34" y1="62" x2="86" y2="62" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M38,49 Q60,56 82,49 M38,75 Q60,68 82,75" fill="none" stroke="#FFFFFF" strokeWidth="2" />
                  <path d="M62,84 L104,26" stroke="#F26B1D" strokeWidth="9" strokeLinecap="round" fill="none" />
                  <path d="M88,24 L108,20 L104,40 Z" fill="#F26B1D" stroke="#F26B1D" strokeWidth="4" strokeLinejoin="round" />
                </g>
              </svg>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg md:text-xl font-black tracking-tight text-navy-900">HASTINA</span>
                  <span className="text-lg md:text-xl font-extrabold tracking-tight text-brand-orange">MOTOR PARTS</span>
                </div>
                <div className="text-[10px] md:text-[11px] font-semibold tracking-wider text-brand-slate uppercase">
                  Alisons General Trading LLP
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[13px] xl:text-sm font-semibold text-slate-700">
              
              {/* HOME */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname === '/' ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                HOME
              </Link>

              {/* PRODUCTS (Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/products"
                  className={`px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1 ${
                    pathname.startsWith('/products') || pathname.startsWith('/part') ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                  }`}
                >
                  <span>PRODUCTS</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {activeDropdown === 'products' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 animate-fade-in z-50">
                    <Link
                      href="/products"
                      className="block p-2.5 rounded-xl bg-navy-50/80 hover:bg-navy-900 hover:text-white transition-all text-xs font-bold text-navy-900"
                    >
                      <div className="flex items-center justify-between">
                        <span>All Products / Full Catalogue</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
                      </div>
                      <span className="text-[11px] font-normal opacity-80 block mt-0.5">3,127+ parts across all brands</span>
                    </Link>

                    <div className="pt-1 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        Product Categories
                      </span>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <Link href="/products?category=engine" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Engine Parts
                        </Link>
                        <Link href="/products?category=brake" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Brake System
                        </Link>
                        <Link href="/products?category=suspension" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Suspension &amp; Steering
                        </Link>
                        <Link href="/products?category=electrical" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Electrical Parts
                        </Link>
                        <Link href="/products?category=filters" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Filters
                        </Link>
                        <Link href="/products?category=cooling" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Cooling System
                        </Link>
                        <Link href="/products?category=transmission" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Transmission
                        </Link>
                        <Link href="/products?category=other" className="px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Other Components
                        </Link>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">
                        Parts Search
                      </span>
                      <div className="space-y-0.5 text-xs">
                        <Link href="/#parts-finder" className="block px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Search by Part Number
                        </Link>
                        <Link href="/#parts-finder" className="block px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Search by Product Name
                        </Link>
                        <Link href="/#parts-finder" className="block px-2 py-1 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-navy-900">
                          Search by OEM Number
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* BRANDS */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('brands')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/brands"
                  className={`px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1 ${
                    pathname.startsWith('/brands') ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                  }`}
                >
                  <span>BRANDS</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {activeDropdown === 'brands' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-1 animate-fade-in z-50 text-xs">
                    <Link href="/brands" className="block p-2 rounded-xl hover:bg-slate-100 font-bold text-navy-900">
                      All Brands (Suzuki, Bajaj, TVS...)
                    </Link>
                    <Link href="/brands#overview" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Brand Details &amp; Fleet Coverage
                    </Link>
                    <Link href="/brands#catalogue" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Products by Brand (3,127 Parts)
                    </Link>
                  </div>
                )}
              </div>

              {/* GLOBAL TRADE */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('markets')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/markets"
                  className={`px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1 ${
                    pathname.startsWith('/markets') ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                  }`}
                >
                  <span>Global Trade</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {activeDropdown === 'markets' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-1 animate-fade-in z-50 text-xs">
                    <Link href="/markets#global-markets" className="block p-2 rounded-xl hover:bg-slate-100 font-bold text-navy-900">
                      Global Sourcing
                    </Link>
                    <Link href="/markets#international-supply" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Wholesale Supply
                    </Link>
                    <Link href="/markets#export-distribution" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Export &amp; Distribution
                    </Link>
                    <Link href="/contact" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold text-brand-orange">
                      Market Enquiry Form →
                    </Link>
                  </div>
                )}
              </div>

              {/* COMPANY */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href="/about"
                  className={`px-3 py-2 rounded-xl transition-colors inline-flex items-center gap-1 ${
                    pathname.startsWith('/about') ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                  }`}
                >
                  <span>Company</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Link>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-1 animate-fade-in z-50 text-xs">
                    <Link href="/about#overview" className="block p-2 rounded-xl hover:bg-slate-100 font-bold text-navy-900">
                      About Us
                    </Link>
                    <Link href="/about#mission" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Mission &amp; Vision
                    </Link>
                    <Link href="/about#quality" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Quality Commitment
                    </Link>
                    <Link href="/about#why-choose-us" className="block p-2 rounded-xl hover:bg-slate-100 text-slate-700">
                      Why Choose Us
                    </Link>
                  </div>
                )}
              </div>

              {/* CONTACT */}
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-xl transition-colors ${
                  pathname.startsWith('/contact') ? 'text-brand-orange font-bold' : 'hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Actions: RFQ Basket & Get Quote */}
            <div className="flex items-center gap-2 shrink-0">
              {/* RFQ BASKET */}
              <button
                id="openRfqBtn"
                type="button"
                onClick={handleOpenRfq}
                className="relative whitespace-nowrap inline-flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-[13px] font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                title="View Selected Products in RFQ Basket"
              >
                <ClipboardList className="w-4 h-4 text-brand-orange shrink-0" />
                <span className="hidden sm:inline">RFQ BASKET</span>
                <span id="rfqBadge" className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brand-orange text-white">
                  {totalCount}
                </span>
              </button>

              <Link
                href="/contact"
                className="hidden md:inline-flex whitespace-nowrap items-center gap-1.5 bg-brand-orange hover:bg-brand-orangeHover text-white text-[13px] font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                <span>Get Quote</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-navy-900 hover:bg-slate-100"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* 3. MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-xl max-h-[80vh] overflow-y-auto">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-navy-900 hover:bg-navy-50"
            >
              HOME
            </Link>

            <div className="space-y-1 pl-3 border-l-2 border-brand-orange/40">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-bold text-navy-900 hover:text-brand-orange text-sm py-1"
              >
                PRODUCTS &amp; FULL CATALOGUE
              </Link>
              <div className="grid grid-cols-2 gap-1 text-xs text-slate-600 pt-1">
                <Link href="/products?category=engine" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Engine Parts
                </Link>
                <Link href="/products?category=brake" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Brake System
                </Link>
                <Link href="/products?category=suspension" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Suspension
                </Link>
                <Link href="/products?category=electrical" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Electrical Parts
                </Link>
                <Link href="/products?category=filters" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Filters
                </Link>
                <Link href="/products?category=transmission" onClick={() => setIsMobileMenuOpen(false)} className="py-1">
                  • Transmission
                </Link>
              </div>
            </div>

            <Link
              href="/brands"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-navy-900 hover:bg-navy-50"
            >
              BRANDS &amp; MODELS
            </Link>

            <Link
              href="/markets"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-navy-900 hover:bg-navy-50"
            >
              MARKETS &amp; GLOBAL SUPPLY
            </Link>

            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-navy-900 hover:bg-navy-50"
            >
              ABOUT US
            </Link>

            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg font-bold text-navy-900 hover:bg-navy-50"
            >
              CONTACT &amp; ENQUIRY
            </Link>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => { setIsMobileMenuOpen(false); handleOpenRfq(); }}
                className="w-full flex items-center justify-center gap-2 bg-navy-900 text-white font-bold py-2.5 rounded-xl text-sm"
              >
                <ClipboardList className="w-4 h-4 text-brand-orange" />
                <span>Open RFQ Basket ({totalCount})</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
