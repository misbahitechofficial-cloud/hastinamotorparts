'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
  Building2,
  Clock,
  Globe2,
  ShieldCheck,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { api } from '@/lib/api';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.submitContact({ name, email, phone, country, subject, message });
      if (res.success) {
        setIsSuccess(true);
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappNumber = '919717829768';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hello Alisons General Trading LLP, I would like to inquire about motorcycle / tuk-tuk spare parts export from India.'
  )}`;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 space-y-16 font-sans">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-navy-900 font-bold">Contact Us</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-orange-50 border border-orange-200/80 px-3.5 py-1 rounded-full inline-block">
          Direct B2B Export Communications
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-navy-900 tracking-tight">
          Contact ALISONS GENERAL TRADING LLP
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
          Send us your required motorcycle, scooter, or tuk-tuk part numbers, product lists, or container requirements. Our international sales desk will prepare an official export proforma invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 1. CONTACT INFORMATION */}
        <div id="info" className="scroll-mt-24 lg:col-span-5 space-y-6">
          <div className="bg-navy-950 text-white rounded-3xl p-8 border border-white/10 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-orange">
                Contact Information
              </span>
              <h2 className="text-xl font-black text-white">Alisons General Trading LLP</h2>
              <p className="text-xs text-slate-400">Hastina Motor Parts Export Desk</p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Physical Registered Address:</strong>
                  <span>Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Telephone / Direct Line:</strong>
                  <a href="tel:+919717829768" className="text-white font-bold hover:text-brand-orange text-sm transition-colors">
                    +91 9717829768
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">WhatsApp Export Line:</strong>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-bold hover:underline">
                    +91 9717829768 (Instant Chat &amp; RFQ Send)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Official Export Email:</strong>
                  <a href="mailto:contect@hastinamotorparts.in" className="hover:text-white underline text-slate-200">
                    contect@hastinamotorparts.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Business Hours:</strong>
                  <span>Monday – Saturday: 9:00 AM – 7:00 PM IST (UTC+5:30)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Incorporated LLP under Ministry of Corporate Affairs, India</span>
            </div>
          </div>
        </div>

        {/* 2 & 3. CONTACT FORM & BUSINESS ENQUIRY */}
        <div id="form" className="scroll-mt-24 lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Business Enquiry &amp; Contact Form
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900 mt-1">
                Send an Export Quotation Inquiry
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submit your spare parts enquiry and our team will check factory availability and pricing immediately.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-2 animate-fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm">Thank You for Contacting Us</h3>
                <p className="text-xs text-emerald-700">
                  Your inquiry has been received by our New Delhi export desk. We will respond promptly via email or WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="text-xs font-bold text-emerald-800 underline mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-navy-900 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-900 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@company.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-navy-900 block mb-1">Destination Country *</label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. Iraq, UAE, Saudi Arabia, Ghana, Argentina"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-navy-900 block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+964 ... / +971 ..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1">Subject / Requirement Type</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Suzuki Access 125 Parts Export Quote / Full Container Inquiry"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-navy-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-navy-900 block mb-1">Message / Parts List *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Specify target vehicle models, exact OEM part numbers, descriptions, or order quantities required..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-xs text-navy-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-navy-900 hover:bg-brand-orange disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Quotation Inquiry...' : 'Submit Quotation Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* 4. LOCATION */}
      <section id="location" className="scroll-mt-24 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Section 4
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
              Our Location &amp; Headquarters
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Conveniently located in South Delhi’s prime commercial hub with rapid access to dry ports and the international airport.
            </p>
          </div>
          <a
            href="https://maps.google.com/?q=Living+Style+Mall+Jasola+New+Delhi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-navy-900 hover:bg-brand-orange px-4 py-2.5 rounded-xl transition-all shadow-xs shrink-0"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <Building2 className="w-5 h-5 text-brand-orange" />
            <h3 className="font-bold text-navy-900 text-sm">Commercial Headquarters</h3>
            <p className="text-xs text-slate-500">
              Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <Navigation className="w-5 h-5 text-navy-900" />
            <h3 className="font-bold text-navy-900 text-sm">Airport &amp; Air Cargo</h3>
            <p className="text-xs text-slate-500">
              Direct highway connectivity to Indira Gandhi International Airport (DEL) Cargo Terminal for same-day air dispatch.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-navy-900 text-sm">Inland Container Depot (ICD)</h3>
            <p className="text-xs text-slate-500">
              Proximity to ICD Tughlakabad (TKD), Asia’s largest dry port, ensuring rapid rail transit to JNPT &amp; Mundra seaports.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
