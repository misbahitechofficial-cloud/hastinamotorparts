'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Check,
  Copy,
  Plus,
  MessageCircle,
  Truck,
  ArrowLeft,
  ChevronRight,
  Package,
  Layers,
  Scale,
  Award,
  Globe2
} from 'lucide-react';
import { api } from '@/lib/api';
import { useEnquiry } from '@/lib/enquiryContext';
import PartCard from '@/components/PartCard';

export default function PartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [part, setPart] = useState<any | null>(null);
  const [relatedParts, setRelatedParts] = useState<any[]>([]);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(10);
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { addItem, items } = useEnquiry();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      api.getPartBySlug(slug)
        .then((res) => {
          if (res.success && res.part) {
            setPart(res.part);
            setRelatedParts(res.relatedParts || []);
            setActiveImage(res.part.images?.[0] || '');
            setQuantity(res.part.moq || 10);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="w-full px-4 py-20 text-center text-sm text-gray-500">
        Loading part specifications...
      </div>
    );
  }

  if (!part) {
    return (
      <div className="w-full px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#232323]">Part Not Found</h2>
        <p className="text-sm text-gray-500">The requested part could not be found in our catalogue.</p>
        <Link href="/parts" className="inline-block bg-[#54A5BE] text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          Browse All Parts
        </Link>
      </div>
    );
  }

  const existingInEnquiry = items.find(i => i.partNumber.toLowerCase() === part.partNumber.toLowerCase());

  const handleCopyPartNumber = () => {
    navigator.clipboard.writeText(part.partNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddToEnquiry = () => {
    addItem(part, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const whatsappNumber = '919717829768';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Alisons General Trading, I would like to inquire about part: ${part.name} (OEM #${part.partNumber}). Quantity required: ${quantity} pcs.`
  )}`;

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-12">
      {/* 0. Top Brand Logo */}
      <div className="flex justify-center mb-2">
        <img
          src="/hastina-logo.svg"
          alt="Hastina Motor Parts"
          className="h-20 sm:h-24 w-auto object-contain"
        />
      </div>

      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 flex-wrap">
        <Link href="/" className="hover:text-[#54A5BE]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link href="/parts" className="hover:text-[#54A5BE]">Parts Catalogue</Link>
        {part.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href={`/parts?category=${part.category.slug}`} className="hover:text-[#54A5BE]">
              {part.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-[#232323] truncate max-w-[200px]">{part.name}</span>
      </div>

      {/* 2. Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Technical Specification Certificate (No vehicle photo) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-950 via-[#0B1120] to-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl flex flex-col justify-between text-white overflow-hidden">
            {/* Subtle schematic watermark */}
            <div className="absolute -right-10 -bottom-10 w-64 h-64 border border-sky-500/10 rounded-full pointer-events-none" />
            <div className="absolute -right-4 -bottom-4 w-44 h-44 border border-sky-500/10 rounded-full pointer-events-none" />

            {/* Top Row: OEM Verification & Grade */}
            <div className="flex items-center justify-between">
              <span className="bg-sky-500/20 text-sky-400 border border-sky-500/40 text-xs font-black uppercase px-3.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>OEM Genuine Guaranteed</span>
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60">
                Origin: {part.origin || 'India'}
              </span>
            </div>

            {/* Middle: Schematic Code & Assembly Ref */}
            <div className="space-y-3 my-auto py-4">
              <div className="text-[11px] font-mono uppercase tracking-widest text-sky-400">
                Official OEM Part Specification
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-black text-white tracking-wider bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700/80 shadow-inner flex items-center justify-between">
                <span>#{part.partNumber}</span>
                <span className="text-xs font-sans font-semibold text-slate-400">Std Qty: {part.specifications?.['Standard Qty'] || '1'}</span>
              </div>
              <div className="text-sm font-semibold text-slate-300">
                {part.name}
              </div>
            </div>

            {/* Bottom Row: Figure Reference & Model Fitment */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Assembly Diagram</span>
                <strong className="text-white">{part.specifications?.['Figure Assembly'] || part.category?.name || 'General Fitment'}</strong>
              </div>
              <div className="text-end">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Vehicle Fitment</span>
                <strong className="text-sky-400">{part.model?.name || 'Compatible Model'}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Enquiry Box */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#54A5BE] bg-[#E9F5F8] border border-[#54A5BE]/30 px-3 py-0.5 rounded-full">
                {part.grade === 'GENUINE' ? 'OEM Genuine Factory Boxed' : part.grade === 'OES' ? 'Tier-1 OES Original Quality' : 'Tested Export Replacement'}
              </span>
              {part.weightKg && (
                <span className="text-xs text-gray-400 font-medium">
                  • Weight: {part.weightKg} kg
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#232323] tracking-tight leading-snug">
              {part.name}
            </h1>
          </div>

          {/* Part Numbers Card */}
          <div className="bg-white rounded-2xl p-4 border border-[#C8C9CE]/40 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Primary OEM / OES Part No:</span>
              <button
                type="button"
                onClick={handleCopyPartNumber}
                className="flex items-center gap-1.5 font-mono text-sm font-bold text-[#232323] bg-[#F8F9FB] hover:bg-[#E9F5F8] hover:text-[#54A5BE] border border-[#C8C9CE]/40 px-3 py-1 rounded-xl shadow-xs transition-colors"
              >
                <span>#{part.partNumber}</span>
                {isCopied ? <Check className="w-3.5 h-3.5 text-[#54A5BE]" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
              </button>
            </div>

            {part.altNumbers && part.altNumbers.length > 0 && (
              <div className="flex items-start justify-between text-xs pt-2 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Cross References / Alt Nos:</span>
                <span className="font-mono text-gray-700 text-end">
                  {part.altNumbers.join(', ')}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {part.description}
          </p>

          {/* Wholesale Enquiry Box */}
          <div className="bg-white rounded-3xl border border-[#C8C9CE]/50 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Pricing &amp; Availability</span>
                <span className="text-sm font-extrabold text-[#232323]">Quotation on Request (B2B Export)</span>
              </div>
              <div className="text-end">
                <span className="text-xs font-semibold text-gray-500 block">Minimum Order</span>
                <span className="text-xs font-bold text-[#54A5BE] bg-[#E9F5F8] px-2.5 py-1 rounded-md border border-[#54A5BE]/30">
                  {part.moq || 10} pieces
                </span>
              </div>
            </div>

            {/* Quantity Stepper & Add to Enquiry */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="flex items-center border border-[#C8C9CE] rounded-xl overflow-hidden bg-[#F8F9FB] w-full sm:w-auto shrink-0 justify-between">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max((part.moq || 1), quantity - 10))}
                  className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200"
                >
                  -
                </button>
                <div className="px-4 py-2 text-center">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Quantity</span>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center text-sm font-black text-[#232323] bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 10)}
                  className="px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToEnquiry}
                className={`flex-1 w-full py-3.5 px-6 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md flex items-center justify-center gap-2 ${
                  isAdded || existingInEnquiry
                    ? 'bg-slate-900 text-white'
                    : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Quotation List!</span>
                  </>
                ) : existingInEnquiry ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Updated in Enquiry ({existingInEnquiry.quantity} pcs)</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add to Enquiry List</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct WhatsApp button */}
            <div className="pt-2 flex items-center justify-between text-xs text-gray-500 border-t border-gray-100">
              <span>Have instant questions?</span>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#54A5BE] hover:underline font-bold flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp regarding #{part.partNumber}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Specifications & Fitment Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8 border-t border-[#C8C9CE]/40">
        {/* Specifications Table */}
        <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#232323] mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#54A5BE]" />
            <span>Technical Specifications</span>
          </h3>
          <div className="divide-y divide-gray-100 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Part Number</span>
              <span className="font-mono font-bold text-[#232323]">{part.partNumber}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Grade Standard</span>
              <span className="font-bold text-[#232323]">{part.grade}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Weight</span>
              <span className="font-bold text-[#232323]">{part.weightKg ? `${part.weightKg} kg` : 'N/A'}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-gray-500 font-medium">Minimum Export Order</span>
              <span className="font-bold text-[#232323]">{part.moq || 1} pcs</span>
            </div>
            {part.specs && Object.entries(part.specs).map(([key, value]) => (
              <div key={key} className="py-2.5 flex justify-between">
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="font-bold text-[#232323] text-end">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fitment Directory (Unboxed Editorial List - NO TABLE BOX) */}
        <div className="py-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono font-bold text-[#54A5BE] uppercase tracking-wider">
                COMPATIBILITY // VERIFIED FITMENT
              </div>
              <h3 className="text-lg font-black text-[#232323] tracking-tight mt-0.5">
                Compatible Vehicle Models
              </h3>
            </div>
          </div>
          {part.compatibleModels && part.compatibleModels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {part.compatibleModels.map((m: any) => (
                <div key={m.id} className="py-3 border-b border-gray-200/80 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-gray-400 uppercase">
                      {m.brandName} • {m.type}
                    </div>
                    <div className="text-sm font-bold text-[#232323]">
                      {m.name}
                    </div>
                  </div>
                  <Link
                    href={`/models/${m.brandSlug}/${m.slug}`}
                    className="text-xs font-bold text-[#54A5BE] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>View Parts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500">Universal component or multi-application spare part.</p>
          )}
        </div>
      </div>

      {/* 4. Related Parts Carousel */}
      {relatedParts.length > 0 && (
        <div className="pt-8 border-t border-[#C8C9CE]/40">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-[#232323] tracking-tight">
              Related Spare Parts in this Category
            </h3>
            <Link href="/parts" className="text-xs font-bold text-[#54A5BE] hover:underline">
              View all category parts →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {relatedParts.map((rp) => (
              <PartCard key={rp.id} part={rp} variant="card" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
