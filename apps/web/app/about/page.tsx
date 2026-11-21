'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Globe2,
  Building2,
  MapPin,
  Award,
  CheckCircle2,
  ArrowRight,
  Phone,
  Target,
  Compass,
  Zap,
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 space-y-16">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-navy-900 font-bold">About Us</span>
      </nav>

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full inline-block">
          Official Company Profile &amp; Ethos
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          About ALISONS GENERAL TRADING LLP
        </h1>
        <p className="text-base sm:text-lg font-bold text-brand-orange">
          HASTINA MOTOR PARTS — Automotive Spare Parts Exporter From India
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Your reliable, registered B2B export partner for motorcycle, scooter, tuk-tuk / three-wheeler, and passenger car spare parts from New Delhi, India to the world.
        </p>
      </div>

      {/* 1. COMPANY OVERVIEW */}
      <section id="overview" className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm">
        <div className="lg:col-span-7 space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-orange">
            <Building2 className="w-4 h-4" />
            <span>Section 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
            Company Overview
          </h2>
          <p className="text-base font-semibold text-navy-900">
            Alisons General Trading LLP is a premier India-based B2B export specialist and authorized sourcing house for automotive spare parts, commercial three-wheelers (tuk-tuks), scooters, motorcycles, and passenger vehicles.
          </p>
          <p>
            Operating under our flagship brand <strong>HASTINA MOTOR PARTS</strong>, we bridge the gap between India’s massive automotive manufacturing ecosystem and international importers, distributors, wholesalers, and fleet mechanics across the globe.
          </p>
          <p>
            Our core coverage encompasses India’s top OEM brands including <strong>Suzuki, Bajaj, TVS, Honda, Yamaha, Hero, Vespa, Piaggio, and Mahindra</strong>. With verified part-number matching and direct factory relationships, we ensure zero wrong-fit shipments.
          </p>
        </div>

        <div className="lg:col-span-5 bg-navy-950 text-white rounded-3xl p-8 border border-white/10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <Building2 className="w-8 h-8 text-brand-orange" />
            <div>
              <h3 className="font-black text-base text-white">Alisons General Trading LLP</h3>
              <p className="text-xs text-slate-400">Government Registered LLP in India</p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
              <span>
                Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-orange shrink-0" />
              <a href="tel:+919717829768" className="hover:text-white transition-colors font-bold text-white">
                Contact: +91 9717829768
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Globe2 className="w-4 h-4 text-brand-orange shrink-0" />
              <span>Official Portal: www.hastinamotorparts.in</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Export Compliance &amp; Chamber Legalization</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full bg-brand-orange hover:bg-brand-orangeHover text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Contact Our Export Team</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2 & 3. MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* OUR MISSION */}
        <section id="mission" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
            Our Purpose
          </span>
          <h2 className="text-2xl font-black text-navy-900">
            Our Mission
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To provide global automotive importers and fleet operators with dependable, transparent, and direct access to India’s highest-quality OEM and verified aftermarket spare parts. We strive to simplify cross-border sourcing through accurate part-number cross-referencing, consolidated packing, competitive wholesale pricing, and punctual dispatch.
          </p>
          <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Eliminate counterfeit components via strict supply audits</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Offer flexible shipment consolidation from cartons to sea containers</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Deliver rapid turnaround on proforma invoices &amp; RFQs</span>
            </li>
          </ul>
        </section>

        {/* OUR VISION */}
        <section id="vision" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-navy-900 flex items-center justify-center">
            <Compass className="w-6 h-6 text-brand-orange" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange block">
            Our Global Horizon
          </span>
          <h2 className="text-2xl font-black text-navy-900">
            Our Vision
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            To be recognized as India’s most dependable and technologically capable automotive spare parts export house—trusted by international wholesalers, government fleets, and commercial distribution networks across the Middle East, Africa, Latin America, Europe, and Asia.
          </p>
          <ul className="space-y-2 pt-2 text-xs font-semibold text-slate-700">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Expand real-time digital catalogue lookups for 10,000+ OEM parts</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Deepen export corridors in Iraq, UAE, Saudi Arabia, Africa &amp; South America</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Pioneer paperless export documentation and tracking</span>
            </li>
          </ul>
        </section>

      </div>

      {/* 4. QUALITY COMMITMENT */}
      <section id="quality" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Rigorous Benchmarks
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
            Quality Commitment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            At Hastina Motor Parts, quality is not an afterthought—it is the cornerstone of our export credibility. Every consignment undergoes multiple checkpoints before seaworthy packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <Award className="w-6 h-6 text-brand-orange" />
            <h3 className="font-bold text-navy-900 text-sm">100% Genuine OEM Procurement</h3>
            <p className="text-xs text-slate-500">
              Procured directly in original factory packaging with authentic barcodes, security holograms, and manufacturer seals.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <Layers className="w-6 h-6 text-navy-900" />
            <h3 className="font-bold text-navy-900 text-sm">Vetted Tier-1 OES Alternates</h3>
            <p className="text-xs text-slate-500">
              When clients require competitive aftermarket pricing, we source strictly from ISO/TS-certified Indian Tier-1 OE suppliers.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-navy-900 text-sm">Seaworthy Export Packing</h3>
            <p className="text-xs text-slate-500">
              Heavy-duty corrugated master cartons, moisture-proof pallet shrink-wrapping, and barcode labeling for effortless customs clearance.
            </p>
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US (6 PILLARS) */}
      <section id="why-choose-us" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Competitive Edge
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
            Why Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Six fundamental pillars that make Alisons General Trading LLP the preferred export house for international spare parts importers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'Direct Sourcing from India',
              desc: 'Unfiltered access to authorized Indian suppliers for Suzuki, Bajaj, TVS, Honda, Hero and Piaggio.'
            },
            {
              title: 'Part-Number Precision',
              desc: 'Exact OEM part number matching to guarantee 100% fitment accuracy on all foreign vehicle assemblies.'
            },
            {
              title: 'Competitive Wholesale Pricing',
              desc: 'Structured tiered pricing for B2B importers, distributors, workshops, and commercial fleet managers.'
            },
            {
              title: 'Complete Tuk-Tuk Coverage',
              desc: 'Comprehensive inventory for 3-wheeler passenger & cargo rickshaws (Bajaj RE, TVS King, Piaggio Ape).'
            },
            {
              title: 'Export Documentation Expertise',
              desc: 'Professional proforma invoices, COO, legalized chamber certification, and packing lists to avoid port delays.'
            },
            {
              title: 'Flexible Consolidation Logistics',
              desc: 'From urgent air freight courier parcels to 20ft / 40ft High-Cube consolidated ocean containers.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-orange hover:bg-white transition-all space-y-2 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0" />
                <h3 className="font-bold text-navy-900 text-sm">{item.title}</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed pl-6">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-navy-900 hover:bg-brand-orange text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            <span>Start an Export Order with Us</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}
