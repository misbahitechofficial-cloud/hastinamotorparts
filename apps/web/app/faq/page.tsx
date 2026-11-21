import React from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I request a quotation for spare parts?',
    a: 'Browse parts by Brand, Model, or Part Number. Click "Add to Enquiry" with the required quantity. Once ready, visit your Enquiry List and submit your details. You will receive an instant Reference Number (ENQ-YYYY-XXXXXX) and our export sales desk will reply within 24 hours.'
  },
  {
    q: 'Can I submit a custom parts list or Excel spreadsheet?',
    a: 'Yes! Use our "Quick OEM Paste Box" on the Enquiry page to paste a list of part numbers with quantities, or upload your Excel/PDF requirements file directly.'
  },
  {
    q: 'What is the difference between Genuine, OES, and Aftermarket?',
    a: 'Genuine parts come in official OEM factory-sealed cartons (Bajaj, TVS, Honda, Suzuki, Vespa). OES parts are produced by tier-1 factory suppliers (Bosch, FCC, Bando, Gabriel, ASK, Goetze) in their own packaging. Aftermarket parts are quality-tested replacement components made to match OEM dimensions and reliability at competitive export price points.'
  },
  {
    q: 'What are your Minimum Order Quantities (MOQ)?',
    a: 'MOQs vary by component category. Fast-moving consumables (filters, spark plugs, brake pads) typically have MOQs of 20 to 50 pieces, while major assemblies like cylinder kits, crankshafts, or differential gear sets have lower MOQs (5 to 10 pieces).'
  },
  {
    q: 'What shipping and export terms do you support?',
    a: 'We support FOB (Nhava Sheva, Mundra, Delhi ICD/Air Cargo), CIF, and CFR worldwide, complete with Certificate of Origin, packing lists, and bill of lading coordination.'
  }
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-2">
          <img
            src="/hastina-logo.svg"
            alt="Hastina Motor Parts"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
        <span className="text-xs font-black uppercase tracking-wider text-[#54A5BE] bg-[#54A5BE]/10 border border-[#54A5BE]/30 px-3 py-1 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
          Export Guidance &amp; FAQ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything international buyers need to know about sourcing motorcycle and tuk-tuk spare parts from India.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
            <h3 className="font-bold text-sm sm:text-base text-navy-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed ps-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center space-y-4">
        <h3 className="font-bold text-base text-navy-900">Have a specific parts question?</h3>
        <p className="text-xs text-slate-500">Our New Delhi export desk is active to assist with part number lookups and fitment matching.</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors"
        >
          <span>Contact Our Export Team</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
