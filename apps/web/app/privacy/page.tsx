import React from 'react';

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          ALISONS GENERAL TRADING LLP — www.hastinamotorparts.in
        </p>
      </div>

      <div className="prose prose-slate text-xs sm:text-sm space-y-6 text-slate-600 leading-relaxed">
        <p>
          ALISONS GENERAL TRADING LLP is committed to preserving the privacy and confidentiality of international trading partners, wholesalers, distributors, and visitors using <strong>www.hastinamotorparts.in</strong>.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">Information We Collect</h2>
          <p>
            When you request a spare parts quotation or submit an inquiry, we collect your business contact details (name, company, country, email address, phone/WhatsApp number) along with part specifications and inquiry items.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">Use of Information</h2>
          <p>
            Collected details are solely utilized to prepare commercial export proformas, confirm part availability, coordinate logistics, and answer technical product questions. We never sell, lease, or distribute customer details to third-party marketing services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-navy-900">Data Security</h2>
          <p>
            All website data transmissions are secured using SSL/TLS encryption. Registered office: Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India.
          </p>
        </section>
      </div>
    </div>
  );
}
