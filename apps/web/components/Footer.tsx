'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#071d35] text-[#d5e0eb] text-xs selection:bg-[#f36b21]/30">
      {/* Main 5-Column Sitemap Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          
          {/* Column 1: Brand & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full border-[3px] border-white flex items-center justify-center font-black text-xl text-white relative">
                <span>⚙</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#f36b21] rounded-full" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-black tracking-tight text-white">
                  HASTINA <span className="text-[#f36b21]">MOTOR PARTS</span>
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-[#aebed0] uppercase">
                  ALISONS GENERAL TRADING LLP
                </div>
              </div>
            </Link>
            <p className="text-[11px] text-[#b9c8d7] leading-relaxed max-w-sm">
              Global automotive spare parts trading company, specializing in import, export, sourcing and wholesale supply.
            </p>
            <div className="flex items-center gap-3 text-slate-300 font-bold text-xs pt-1">
              <a href="#" className="hover:text-[#f36b21] transition-colors" aria-label="LinkedIn">in</a>
              <a href="#" className="hover:text-[#f36b21] transition-colors" aria-label="Instagram">◎</a>
              <a href="#" className="hover:text-[#f36b21] transition-colors" aria-label="YouTube">▶</a>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-1.5 text-[11px] text-[#b9c8d7]">
              <li>
                <Link href="/" className="hover:text-[#f36b21] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#f36b21] transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-[#f36b21] transition-colors">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-[#f36b21] transition-colors">
                  Global Trade
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#f36b21] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Products (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Products
            </h3>
            <ul className="space-y-1.5 text-[11px] text-[#b9c8d7]">
              <li>
                <Link href="/products" className="hover:text-[#f36b21] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products#categories" className="hover:text-[#f36b21] transition-colors">
                  Product Categories
                </Link>
              </li>
              <li>
                <Link href="/#search" className="hover:text-[#f36b21] transition-colors">
                  Parts Search
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#f36b21] transition-colors">
                  Full Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-1.5 text-[11px] text-[#b9c8d7]">
              <li>
                <Link href="/about" className="hover:text-[#f36b21] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about#mission" className="hover:text-[#f36b21] transition-colors">
                  Our Vision &amp; Mission
                </Link>
              </li>
              <li>
                <Link href="/about#quality" className="hover:text-[#f36b21] transition-colors">
                  Quality Commitment
                </Link>
              </li>
              <li>
                <Link href="/about#why-choose-us" className="hover:text-[#f36b21] transition-colors">
                  Why Choose Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Get in Touch (2 cols) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <div className="space-y-1.5 text-[11px] text-[#b9c8d7]">
              <p>☏ &nbsp;<a href="tel:+919717829768" className="hover:text-white transition-colors">+91 97178 29768</a></p>
              <p>
                <a href="mailto:contect@hastinamotorparts.in" className="hover:text-[#f36b21] transition-colors">
                  ✉ &nbsp;contect@hastinamotorparts.in
                </a>
              </p>
              <p>⌖ &nbsp;Unit No. 43, Jasola, New Delhi, India</p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs"
                >
                  Business Enquiry
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-[#2c4159] py-4 bg-[#05162a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-[#aebed0]">
          <div>
            © 2026 Hastina Motor Parts | Alisons General Trading LLP. All Rights Reserved.
          </div>
          <div className="text-center font-medium">
            Website designed &amp; powered by:{' '}
            <a
              href="https://misbahitech.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#f36b21] hover:text-white hover:underline transition-colors"
            >
              Misbahi Tech
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-[#2c4159]">|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
