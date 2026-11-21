'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ClipboardList,
  Trash2,
  Send,
  CheckCircle2,
  Sparkles,
  Upload,
  ArrowRight,
  MessageCircle,
  FileText,
  Building,
  Mail,
  Phone,
  Globe2,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useEnquiry } from '@/lib/enquiryContext';
import { api } from '@/lib/api';

const KEY_COUNTRIES = [
  'Iraq', 'United Arab Emirates (UAE)', 'Saudi Arabia', 'Iran', 'Afghanistan',
  'Turkey', 'Libya', 'Algeria', 'Ghana', 'Angola', 'Senegal', 'South Africa',
  'Argentina', 'Egypt', 'Kenya', 'Nigeria', 'Tanzania', 'Jordan', 'Lebanon',
  'Kuwait', 'Oman', 'Qatar', 'Yemen', 'Bangladesh', 'Sri Lanka', 'Nepal',
  'United Kingdom', 'Germany', 'France', 'Italy', 'Other Country'
];

function EnquiryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, updateQuantity, removeItem, clearEnquiry, addBulkItems, totalCount } = useEnquiry();

  const [activeTab, setActiveTab] = useState<'LIST' | 'QUICK'>('LIST');
  const [quickPasteText, setQuickPasteText] = useState('');
  const [quickPasteSuccess, setQuickPasteSuccess] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('Iraq');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    refNo: string;
    message: string;
  } | null>(null);

  const whatsappNumber = '919717829768';

  // Check if query param pre-fills part
  useEffect(() => {
    const quickPart = searchParams.get('quickPart');
    const quickText = searchParams.get('quick');
    if (quickPart) {
      addBulkItems(`${quickPart} x 20`);
      setActiveTab('LIST');
    } else if (quickText) {
      setQuickPasteText(quickText);
      setActiveTab('QUICK');
    }
  }, [searchParams]);

  const handleBulkImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPasteText.trim()) return;

    const count = addBulkItems(quickPasteText);
    setQuickPasteSuccess(`Successfully added ${count} items to your quotation list!`);
    setQuickPasteText('');
    setTimeout(() => {
      setQuickPasteSuccess('');
      setActiveTab('LIST');
    }, 1500);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert('Please add at least one part to your enquiry list before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name,
        company,
        country,
        email,
        phone,
        message,
        attachmentUrl: attachmentName ? `https://storage.hastinamotorparts.com/uploads/${attachmentName}` : undefined,
        items: items.map(i => ({
          partNumber: i.partNumber,
          name: i.name,
          quantity: i.quantity,
          partId: i.partId || (typeof i.id === 'number' ? i.id : undefined)
        }))
      };

      const res = await api.submitEnquiry(payload);
      if (res.success) {
        setSubmissionResult({
          refNo: res.enquiry.referenceNo,
          message: 'Quotation request dispatched to our export sales team.'
        });
        clearEnquiry();
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting enquiry. Please connect directly via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult) {
    const followUpWhatsapp = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      `Hello Alisons General Trading LLP, I have just submitted quotation enquiry ref: ${submissionResult.refNo}. Customer: ${name} (${company || 'Individual'}). Looking forward to your export pricing.`
    )}`;

    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-8 sm:p-12 text-center shadow-floating space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#E9F5F8] text-[#54A5BE] flex items-center justify-center mx-auto shadow-md shadow-[#54A5BE]/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#54A5BE] bg-[#54A5BE]/10 px-3 py-1 rounded-full border border-[#54A5BE]/30">
              Quotation Request Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#232323]">
              Thank You, {name}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              Your inquiry has been logged in our export sales pipeline. A confirmation email has been dispatched to <strong>{email}</strong>.
            </p>
          </div>

          {/* Reference Box */}
          <div className="bg-[#F8F9FB] border border-[#C8C9CE]/40 rounded-2xl p-6 max-w-md mx-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
              Official Quotation Reference
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#54A5BE] font-mono tracking-tight">
              {submissionResult.refNo}
            </span>
            <div className="text-[11px] text-gray-400 mt-2">
              Please quote this reference number for all correspondence.
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={followUpWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#54A5BE] hover:bg-[#438ea5] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all inline-flex items-center gap-2 shadow-md shadow-[#54A5BE]/25"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Follow up on WhatsApp with {submissionResult.refNo}</span>
            </a>

            <Link
              href="/parts"
              className="bg-[#232323] hover:bg-[#1E2125] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all border border-[#C8C9CE]/30"
            >
              Browse More Parts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
      {/* 1. Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="flex justify-center mb-2">
          <img
            src="/hastina-logo.svg"
            alt="Hastina Motor Parts"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-2 bg-[#54A5BE]/10 border border-[#54A5BE]/30 text-[#54A5BE] rounded-full px-4 py-1 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-[#54A5BE]" />
          <span>B2B Export Quotation Engine • No Online Payment Required</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-[#232323] tracking-tight">
          Quotation Enquiry List (RFQ)
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review your selected spare parts or paste an OEM part numbers list below. Fill in your export destination details to receive proforma pricing within 24 hours.
        </p>
      </div>

      {/* 2. Tabs */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('LIST')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'LIST'
              ? 'bg-[#232323] text-white shadow-md'
              : 'bg-white text-gray-700 border border-[#C8C9CE]/40 hover:bg-[#F8F9FB]'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>Selected Parts List ({items.length})</span>
        </button>

        <button
          type="button"
          id="quick"
          onClick={() => setActiveTab('QUICK')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'QUICK'
              ? 'bg-[#232323] text-white shadow-md'
              : 'bg-white text-gray-700 border border-[#C8C9CE]/40 hover:bg-[#F8F9FB]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#54A5BE]" />
          <span>Quick OEM Paste Box</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Part Items / Quick Paste */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'QUICK' ? (
            /* QUICK ENQUIRY PASTE FORM */
            <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#54A5BE]" />
                  <h3 className="font-bold text-sm text-[#232323]">Paste Multiple OEM Numbers &amp; Quantities</h3>
                </div>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Paste part numbers copied from your inventory sheets or catalogues. Format can be:
                <br />
                <code className="text-[#54A5BE] font-mono font-bold">36360086 x 100</code> or <code className="text-[#54A5BE] font-mono font-bold">27601-33G00, 50</code> (one line per part).
              </p>

              {quickPasteSuccess && (
                <div className="bg-[#E9F5F8] border border-[#54A5BE]/40 text-[#275765] text-xs font-bold p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#54A5BE]" />
                  <span>{quickPasteSuccess}</span>
                </div>
              )}

              <form onSubmit={handleBulkImport} className="space-y-4">
                <textarea
                  rows={8}
                  value={quickPasteText}
                  onChange={(e) => setQuickPasteText(e.target.value)}
                  placeholder="36360086 x 50&#10;JA541015 x 100&#10;27601-33G00 x 20&#10;16510-05240 x 200"
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-2xl p-4 text-xs font-mono text-[#232323] focus:outline-none focus:border-[#54A5BE]"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-[#54A5BE] hover:bg-[#438ea5] text-white font-bold py-3.5 px-4 rounded-xl text-xs transition-colors shadow-md shadow-[#54A5BE]/25 flex items-center justify-center gap-2"
                >
                  <span>Add Pasted Items to Quotation List</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* SELECTED PARTS LIST */
            <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-bold text-sm text-[#232323]">
                  Enquiry Items ({items.length} unique items, {totalCount} total pieces)
                </h3>
                {items.length > 0 && (
                  <button
                    type="button"
                    onClick={clearEnquiry}
                    className="text-xs font-bold text-[#5A3E36] hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ClipboardList className="w-12 h-12 text-[#C8C9CE] mx-auto" />
                  <p className="text-sm font-bold text-[#232323]">Your enquiry list is currently empty</p>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Browse our catalogue to add genuine and aftermarket spare parts, or use the Quick Paste tool.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/parts"
                      className="bg-[#54A5BE] hover:bg-[#438ea5] text-white font-bold text-xs px-6 py-2.5 rounded-xl inline-block shadow-md shadow-[#54A5BE]/25"
                    >
                      Browse Catalogue
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.partNumber} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#F8F9FB] border border-[#C8C9CE]/40 overflow-hidden shrink-0 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#232323] line-clamp-1">{item.name}</div>
                          <div className="font-mono text-[11px] text-[#54A5BE] font-semibold">
                            OEM #{item.partNumber}
                          </div>
                          {item.grade && (
                            <span className="text-[9px] font-bold text-[#5A3E36] uppercase bg-[#BFB59E]/30 px-1.5 py-0.5 rounded border border-[#BFB59E]/40 mt-0.5 inline-block">
                              {item.grade}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Remove */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-[#C8C9CE] rounded-xl overflow-hidden bg-[#F8F9FB]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.partNumber, Math.max(1, item.quantity - 5))}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.partNumber, Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-12 text-center text-xs font-bold text-[#232323] bg-transparent focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.partNumber, item.quantity + 5)}
                            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.partNumber)}
                          className="p-1.5 text-gray-400 hover:text-[#5A3E36] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Customer & Shipping Details Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#54A5BE]">
                Export Destination &amp; Buyer Info
              </span>
              <h2 className="text-xl font-black text-[#232323]">Request Official Quotation</h2>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#232323] block mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hassan Al-Baghdadi"
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3.5 py-2.5 text-xs text-[#232323] font-semibold focus:outline-none focus:border-[#54A5BE]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#232323] block mb-1">
                  Company / Trading Firm Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Al-Noor Auto Spares Trading LLC"
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3.5 py-2.5 text-xs text-[#232323] font-semibold focus:outline-none focus:border-[#54A5BE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#232323] block mb-1">
                    Destination Country *
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3.5 py-2.5 text-xs text-[#232323] font-semibold focus:outline-none focus:border-[#54A5BE]"
                  >
                    {KEY_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#232323] block mb-1">
                    Business Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hassan@company.com"
                    className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3.5 py-2.5 text-xs text-[#232323] font-semibold focus:outline-none focus:border-[#54A5BE]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#232323] block mb-1">
                  Phone / WhatsApp Number (with Country Code)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 123 4567"
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3.5 py-2.5 text-xs text-[#232323] font-semibold focus:outline-none focus:border-[#54A5BE]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#232323] block mb-1">
                  Message / Port of Destination / Special Instructions
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Need CIF Umm Qasr Port quotation. We require export pallet packaging and Certificate of Origin."
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl p-3 text-xs text-[#232323] font-medium focus:outline-none focus:border-[#54A5BE]"
                />
              </div>

              {/* Optional File Upload */}
              <div>
                <label className="text-xs font-bold text-[#232323] block mb-1">
                  Attach Excel Parts List or Sample Photos (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setAttachmentName(f.name);
                  }}
                  className="w-full text-xs text-gray-500 file:me-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#F8F9FB] file:text-[#232323] hover:file:bg-[#E9F5F8]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-[#54A5BE] hover:bg-[#438ea5] disabled:opacity-50 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-[#54A5BE]/25 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Reference &amp; Sending...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Quotation Request ({items.length} parts)</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 space-y-1">
              <p>• We guarantee competitive export pricing and fast quotation turnaround.</p>
              <p>• Data strictly protected under ALISONS GENERAL TRADING LLP privacy terms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading enquiry engine...</div>}>
      <EnquiryContent />
    </Suspense>
  );
}
