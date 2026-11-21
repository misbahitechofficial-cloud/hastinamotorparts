'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe2,
  Ship,
  Plane,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  FileText,
  MapPin,
  Send,
  Boxes,
  Truck
} from 'lucide-react';
import { useEnquiry } from '@/lib/enquiryContext';

const GLOBAL_MARKETS = [
  {
    name: 'Middle East',
    countries: ['Iraq (Umm Qasr / Baghdad / Erbil)', 'United Arab Emirates (Dubai / Jebel Ali)', 'Saudi Arabia (Jeddah / Dammam)', 'Iran', 'Kuwait', 'Oman', 'Qatar', 'Yemen', 'Jordan', 'Lebanon'],
    desc: 'Extensive regular shipments for Suzuki Gixxer, Access 125, Bajaj Boxer, Pulsar, and Vespa spares. Regular 20ft/40ft container logistics.'
  },
  {
    name: 'Africa',
    countries: ['Ghana (Tema / Accra)', 'Angola (Luanda)', 'Senegal (Dakar)', 'South Africa (Durban / JNB)', 'Libya (Tripoli / Benghazi)', 'Algeria (Algiers)', 'Egypt (Alexandria)', 'Nigeria (Lagos)', 'Kenya (Mombasa)', 'Tanzania (Dar es Salaam)'],
    desc: 'High demand for commercial Tuk Tuk RE 4-Stroke components, Bajaj Boxer BM150, TVS King, and heavy-duty cylinder blocks, clutch plates, and brake shoes.'
  },
  {
    name: 'Asia & Europe',
    countries: ['Afghanistan (Kabul / Herat)', 'Turkey (Istanbul / Izmir)', 'Bangladesh (Chittagong)', 'Sri Lanka (Colombo)', 'Nepal (Birgunj)', 'United Kingdom', 'Germany', 'France', 'Italy'],
    desc: 'Export solutions for urban commuter scooters, delivery bikes, and specialty Italian-line scooters (Vespa / Aprilia / Piaggio).'
  },
  {
    name: 'South America',
    countries: ['Argentina (Buenos Aires)', 'Peru (Callao)', 'Colombia (Buenaventura)', 'Expanding Regional Distribution'],
    desc: 'Long-distance seaworthy palletized packaging for Bajaj, Suzuki, and Honda motorcycle components with legalized Certificate of Origin.'
  }
];

export default function MarketsPage() {
  const [enquiryCountry, setEnquiryCountry] = useState('Iraq');
  const [enquiryFreight, setEnquiryFreight] = useState('Sea Container (20ft / 40ft)');
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryEmail, setEnquiryEmail] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleMarketEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 space-y-16">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
        <span className="text-slate-300">/</span>
        <span className="text-navy-900 font-bold">International Markets</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full inline-block">
          Worldwide Distribution &amp; Supply Corridors
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          International Export Markets
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          From our export consolidation hubs in New Delhi and Indian seaports, ALISONS GENERAL TRADING LLP coordinates consolidated ocean containers and express air-cargo shipments across 5 continents.
        </p>
      </div>

      {/* 1. GLOBAL MARKETS */}
      <section id="global-markets" className="scroll-mt-24 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Section 1
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              Global Markets
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Active destination corridors where we reliably export spare parts consignments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {GLOBAL_MARKETS.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-5 flex flex-col justify-between hover:border-brand-orange transition-all"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center font-bold">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-black text-navy-900">{r.name}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{r.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {r.countries.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-slate-50 text-navy-900 font-bold px-3 py-1.5 rounded-xl border border-slate-200/80"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Full custom documentation &amp; Chamber of Commerce legalization</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. INTERNATIONAL SUPPLY */}
      <section id="international-supply" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Section 2
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
            International Supply
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Multi-modal freight options tailored to the urgency and scale of your automotive parts order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-navy-900 flex items-center justify-center">
              <Ship className="w-6 h-6 text-brand-orange" />
            </div>
            <h3 className="font-black text-base text-navy-900">Ocean Container Freight</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full Container Load (FCL 20ft &amp; 40ft High Cube) and Less than Container Load (LCL) consolidated shipments dispatched from Nhava Sheva (JNPT) and Mundra ports.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-black text-base text-navy-900">Air Cargo Consignment</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Urgent express air shipments dispatched via IGI Airport New Delhi (DEL) to international airports worldwide for fast stock replenishment and emergency mechanical spares.
            </p>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Boxes className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-black text-base text-navy-900">Consolidated Export Packing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We consolidate multiple brand orders (e.g. Suzuki + Bajaj + TVS) into one single shipment, reducing overall freight overheads and import customs charges for the buyer.
            </p>
          </div>
        </div>
      </section>

      {/* 3. EXPORT & DISTRIBUTION */}
      <section id="export-distribution" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Section 3
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
            Export &amp; Distribution Protocols
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Professional trade compliance ensuring swift entry and zero administrative friction at destination customs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            <h4 className="font-bold text-navy-900 text-sm">Commercial Invoices &amp; Packing</h4>
            <p className="text-xs text-slate-500">Itemized with exact OEM codes, net weights, box dimensions, and FOB/CIF value.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <ShieldCheck className="w-5 h-5 text-navy-900" />
            <h4 className="font-bold text-navy-900 text-sm">Certificate of Origin (COO)</h4>
            <p className="text-xs text-slate-500">Legalized by authorized Indian Chambers of Commerce for preferential duty tariffs.</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h4 className="font-bold text-navy-900 text-sm">Accurate HS Code Tagging</h4>
            <p className="text-xs text-slate-500">Every automotive component correctly mapped to standard international tariff codes (8714).</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <Truck className="w-5 h-5 text-brand-orange" />
            <h4 className="font-bold text-navy-900 text-sm">Port Handling &amp; Clearance</h4>
            <p className="text-xs text-slate-500">End-to-end liaison with shipping lines, container freight stations, and bonded warehouses.</p>
          </div>
        </div>
      </section>

      {/* 4. MARKET ENQUIRY FORM */}
      <section id="market-enquiry" className="scroll-mt-24 bg-navy-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-white/10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Section 4
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Market Supply Enquiry
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Interested in importing Indian automotive spare parts to your country? Fill out the details below for a customized CIF freight quote and pricing schedule.
          </p>
        </div>

        {isSent ? (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-base">Enquiry Sent Successfully</h3>
            <p className="text-xs text-emerald-200">
              Our international export desk will review your market requirements and contact you within 24 business hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleMarketEnquirySubmit} className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={enquiryName}
                onChange={(e) => setEnquiryName(e.target.value)}
                placeholder="Full name"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={enquiryEmail}
                onChange={(e) => setEnquiryEmail(e.target.value)}
                placeholder="sales@yourcompany.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={enquiryPhone}
                onChange={(e) => setEnquiryPhone(e.target.value)}
                placeholder="+964 ... / +971 ..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Destination Country *</label>
              <select
                value={enquiryCountry}
                onChange={(e) => setEnquiryCountry(e.target.value)}
                className="w-full bg-navy-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-orange cursor-pointer"
              >
                {['Iraq', 'United Arab Emirates', 'Saudi Arabia', 'Iran', 'Afghanistan', 'Turkey', 'Libya', 'Algeria', 'Ghana', 'Angola', 'Senegal', 'South Africa', 'Argentina', 'Other Country'].map((c) => (
                  <option key={c} value={c} className="bg-navy-900 text-white">{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Preferred Shipment Method</label>
              <select
                value={enquiryFreight}
                onChange={(e) => setEnquiryFreight(e.target.value)}
                className="w-full bg-navy-900 border border-white/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-orange cursor-pointer"
              >
                <option value="Sea Container (20ft / 40ft)" className="bg-navy-900 text-white">Full Sea Container (20ft / 40ft FCL)</option>
                <option value="LCL Consolidated Pallet" className="bg-navy-900 text-white">LCL Consolidated Ocean Pallet</option>
                <option value="Air Cargo" className="bg-navy-900 text-white">Air Cargo Parcel Dispatch</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Required Models / Parts Overview</label>
              <textarea
                rows={3}
                value={enquiryNotes}
                onChange={(e) => setEnquiryNotes(e.target.value)}
                placeholder="Mention required vehicle models (e.g. Access 125, Boxer BM150, TVS King), target quantities, or part numbers..."
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-orange"
              />
            </div>

            <div className="md:col-span-2 text-center pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md cursor-pointer text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Market Supply Request</span>
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
}
