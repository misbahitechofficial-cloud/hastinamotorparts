import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-12 sm:py-16 space-y-8">
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="flex justify-center mb-2">
          <img
            src="/hastina-logo.svg"
            alt="Hastina Motor Parts"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
        <h1 className="text-3xl font-black text-[#232323] tracking-tight">
          Export Terms &amp; Conditions
        </h1>
        <p className="text-xs text-gray-500">
          ALISONS GENERAL TRADING LLP — International B2B Supply Agreement
        </p>
      </div>

      <div className="prose prose-slate text-xs sm:text-sm space-y-6 text-slate-600 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">1. Quotations &amp; Validity</h2>
          <p>
            All export proformas and pricing quotations are issued in USD, EUR, or AED. Quotations remain valid for 15 calendar days from the date of issuance due to ocean freight and raw material index fluctuations.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">2. Order Confirmation &amp; Payment</h2>
          <p>
            Commercial export orders are executed upon receipt of confirmed purchase orders and mutually agreed banking arrangements (T/T or Irrevocable Letter of Credit at Sight).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">3. Packaging &amp; Inspection</h2>
          <p>
            Goods are packed according to international seaworthy and air cargo standards in heavy-gauge corrugated cartons with internal moisture protection. Pre-shipment physical inspection is welcomed prior to container sealing.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">4. Customs &amp; Documentation</h2>
          <p>
            ALISONS GENERAL TRADING LLP provides all requisite export compliance documentation, including Commercial Invoice, Detailed Packing List, Certificate of Origin (Chamber of Commerce legalized), and Bill of Lading (B/L) or Air Waybill (AWB).
          </p>
        </section>
      </div>
    </div>
  );
}
