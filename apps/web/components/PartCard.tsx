'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Plus,
  Check,
  Copy,
  ArrowRight,
  Bike,
  Tag
} from 'lucide-react';
import { useEnquiry } from '@/lib/enquiryContext';

interface PartCardProps {
  part: any;
  variant?: 'list' | 'card';
}

export default function PartCard({ part, variant = 'list' }: PartCardProps) {
  const { addItem, items } = useEnquiry();
  const [quantity, setQuantity] = useState(part.moq || 5);
  const [isCopied, setIsCopied] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const existingInEnquiry = items.find(
    i => i.partNumber?.toLowerCase() === part.partNumber?.toLowerCase()
  );

  const handleCopyPartNumber = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(part.partNumber);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleAddToEnquiry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(part, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const isOem = String(part.grade || '').toUpperCase().includes('OEM') || 
                String(part.grade || '').toUpperCase().includes('GENUINE');

  const figAssembly = part.specifications?.['Figure Assembly'] || part.category?.name || 'OEM Component';
  const itemRef = part.specifications?.['Item Ref'];
  const compatList = part.modelsCompat || part.compatibleModels?.map((m: any) => `${m.brandName || ''} ${m.name || ''}`.trim()) || [];

  // ==========================================
  // 1. VERTICAL CARD LAYOUT (For Grids / Related Parts)
  // ==========================================
  if (variant === 'card') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 hover:shadow-lg transition-all duration-200 p-5 flex flex-col justify-between h-full group relative">
        
        {/* Top Badges & Meta */}
        <div className="space-y-3 flex-1">
          {/* Badge Row */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {/* Copyable OEM Part Number */}
            <button
              type="button"
              onClick={handleCopyPartNumber}
              title="Click to copy OEM Part Number"
              className="group/copy flex items-center gap-1 font-mono text-[11px] font-bold text-slate-800 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 px-2 py-0.5 rounded-md transition-colors border border-slate-200"
            >
              <Tag className="w-2.5 h-2.5 text-sky-600" />
              <span>#{part.partNumber}</span>
              {isCopied ? (
                <Check className="w-2.5 h-2.5 text-emerald-600" />
              ) : (
                <Copy className="w-2.5 h-2.5 text-slate-400 group-hover/copy:text-sky-600" />
              )}
            </button>

            {/* Genuine OEM Badge */}
            <span className="bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-sky-600" />
              <span>{isOem ? 'OEM GENUINE' : (part.grade || 'GENUINE')}</span>
            </span>

            {/* Item Ref in Diagram */}
            {itemRef && itemRef !== 'N/A' && (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/60">
                Ref #{itemRef}
              </span>
            )}
          </div>

          {/* Part Name / Description */}
          <Link href={`/part/${part.slug}`} className="block group-hover:text-sky-600 transition-colors">
            <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
              {part.name}
            </h4>
          </Link>

          {/* Assembly / System Category Pill */}
          {part.category?.name && (
            <div>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70 inline-block truncate max-w-full">
                {part.category.name}
              </span>
            </div>
          )}

          {/* Vehicle Compatibility & Diagram Details */}
          <div className="space-y-1 pt-1 text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-start gap-1.5 text-slate-600 font-medium">
              <Bike className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <div className="leading-tight text-[11px]">
                <span className="text-slate-400">Fitment: </span>
                <strong className="text-slate-800">{part.model?.name || compatList[0] || 'Suzuki Access 125'}</strong>
                {compatList.length > 1 && (
                  <span className="text-slate-400 block text-[10px]">
                    (+{compatList.length - 1} compatible variants)
                  </span>
                )}
              </div>
            </div>

            {part.specifications?.['Figure Assembly'] && (
              <div className="text-[10px] text-slate-400 font-mono truncate">
                • Fig: {part.specifications['Figure Assembly']}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Area (Guaranteed no overlap) */}
        <div className="pt-3 border-t border-slate-100 mt-4 space-y-2.5 shrink-0">
          
          {/* Unit MOQ Info */}
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-mono text-slate-400 uppercase tracking-wider text-[10px]">Unit MOQ</span>
            <span className="font-bold text-slate-700">{part.moq || 5} {part.unit || 'PCS'}</span>
          </div>

          {/* Stepper + Add to Enquiry Row */}
          <div className="flex items-center gap-1.5">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shrink-0 h-9">
              <button
                type="button"
                onClick={() => setQuantity(Math.max((part.moq || 1), quantity - 5))}
                className="w-7 h-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-8 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 5)}
                className="w-7 h-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddToEnquiry}
              className={`flex-1 h-9 px-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 truncate ${
                isAdded || existingInEnquiry
                  ? 'bg-slate-900 text-white'
                  : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">Added!</span>
                </>
              ) : existingInEnquiry ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">In RFQ ({existingInEnquiry.quantity})</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 shrink-0" />
                  <span className="truncate">Add to Enquiry</span>
                </>
              )}
            </button>

            {/* View Link Arrow */}
            <Link
              href={`/part/${part.slug}`}
              className="w-9 h-9 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shrink-0"
              title="Inspect Part Details"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // 2. HORIZONTAL ROW LAYOUT (For Catalogue List / Search Results)
  // ==========================================
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-sky-500 hover:shadow-md transition-all duration-200 p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group">
      
      {/* 1. Left: Part Identity & Technical Assembly Specs (No Model Image) */}
      <div className="space-y-2 flex-1 min-w-0 w-full lg:w-auto">
        
        {/* Top Badges Row */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Copyable OEM Part Number */}
          <button
            type="button"
            onClick={handleCopyPartNumber}
            title="Click to copy OEM Part Number"
            className="group/copy flex items-center gap-1.5 font-mono text-xs font-bold text-slate-800 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 px-2.5 py-1 rounded-lg transition-colors border border-slate-200 shadow-2xs"
          >
            <Tag className="w-3 h-3 text-sky-600" />
            <span>#{part.partNumber}</span>
            {isCopied ? (
              <Check className="w-3 h-3 text-emerald-600" />
            ) : (
              <Copy className="w-3 h-3 text-slate-400 group-hover/copy:text-sky-600" />
            )}
          </button>

          {/* Genuine OEM Badge */}
          <span className="bg-sky-50 text-sky-700 border border-sky-200/80 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            <span>{isOem ? 'OEM Genuine' : (part.grade || 'Export Quality')}</span>
          </span>

          {/* Assembly / System Pill */}
          {part.category?.name && (
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200/60 truncate max-w-[220px]">
              {part.category.name}
            </span>
          )}

          {/* Item Reference in Diagram */}
          {itemRef && itemRef !== 'N/A' && (
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              Ref #{itemRef}
            </span>
          )}
        </div>

        {/* Part Name / Description */}
        <Link href={`/part/${part.slug}`} className="block group-hover:text-sky-600 transition-colors">
          <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
            {part.name}
          </h3>
        </Link>

        {/* Vehicle Compatibility & Diagram Details */}
        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          {/* Model / Compatibility */}
          <div className="flex items-center gap-1 text-slate-600 font-medium">
            <Bike className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>
              Vehicle Fitment: <strong className="text-slate-800">{part.model?.name || compatList[0] || 'Suzuki OEM'}</strong>
              {compatList.length > 1 && (
                <span className="text-slate-400 text-[11px] ms-1">
                  (+{compatList.length - 1} compatible variants)
                </span>
              )}
            </span>
          </div>

          {/* Figure Reference */}
          {part.specifications?.['Figure Assembly'] && (
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              • Fig: {part.specifications['Figure Assembly']}
            </span>
          )}
        </div>

      </div>

      {/* 2. Right: MOQ, Quantity Stepper & Add to Enquiry Action */}
      <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-between lg:justify-end">
        
        {/* MOQ Info */}
        <div className="text-end hidden xl:block me-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Unit MOQ</div>
          <div className="text-xs font-bold text-slate-700">{part.moq || 5} {part.unit || 'PCS'}</div>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shrink-0 h-10 shadow-2xs">
          <button
            type="button"
            onClick={() => setQuantity(Math.max((part.moq || 1), quantity - 5))}
            className="px-2.5 h-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 text-center text-xs font-bold text-slate-800 bg-transparent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setQuantity(quantity + 5)}
            className="px-2.5 h-full text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            +
          </button>
        </div>

        {/* Add to RFQ Button */}
        <button
          type="button"
          onClick={handleAddToEnquiry}
          className={`flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 ${
            isAdded || existingInEnquiry
              ? 'bg-slate-900 text-white'
              : 'bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sky-500/20'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Added!</span>
            </>
          ) : existingInEnquiry ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>In RFQ ({existingInEnquiry.quantity})</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Enquiry</span>
            </>
          )}
        </button>

        {/* Inspect Details Link Button */}
        <Link
          href={`/part/${part.slug}`}
          className="w-10 h-10 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-600 hover:text-sky-600 flex items-center justify-center transition-all shrink-0 shadow-2xs"
          title="View Full Specifications"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
