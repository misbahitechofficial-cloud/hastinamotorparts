'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Bike, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';

export default function SingleBrandPage() {
  const params = useParams();
  const brandSlug = params?.brand as string;

  const [brand, setBrand] = useState<any | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (brandSlug) {
      setIsLoading(true);
      api.getBrandModels(brandSlug)
        .then((res) => {
          if (res.success) {
            setBrand(res.brand);
            setModels(res.models);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [brandSlug]);

  if (isLoading) {
    return (
      <div className="w-full px-4 py-20 text-center text-sm text-slate-500">
        Loading {brandSlug} catalogue models...
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="w-full px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-navy-900">Brand Not Found</h2>
        <Link href="/brands" className="text-brand-600 font-bold text-sm">
          Return to Brands List →
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/brands" className="hover:text-brand-600 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Brands</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-navy-900 font-bold">{brand.name}</span>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block mb-1">
              Export Vehicle Range
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              {brand.name} Spare Parts Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl">
              Select your specific {brand.name} motorcycle, scooter or three-wheeler model below to explore genuine OEM and quality aftermarket components.
            </p>
          </div>

          <Link
            href={`/parts?brand=${brand.slug}`}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-full transition-colors shrink-0 shadow-sm flex items-center gap-2"
          >
            <span>View All {brand.name} Parts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Models Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-navy-900 tracking-tight">
          Vehicle Models ({models.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(m => (
            <Link
              key={m.id}
              href={`/models/${brand.slug}/${m.slug}`}
              className="bg-white rounded-3xl border border-slate-200 hover:border-brand-600 hover:shadow-floating p-6 transition-all group flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {m.type}
                  </span>
                  {m.displacement && (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {m.displacement}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                  {m.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {m.yearFrom ? `Year: ${m.yearFrom} – Present` : 'All generation variants'}
                </div>
                <div className="text-xs font-bold text-sky-600 pt-2 flex items-center gap-1">
                  <span>Browse {m.totalParts || m.partsCount || '600+'} compatible parts</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[#54A5BE] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shrink-0 border border-slate-200/80 group-hover:border-[#54A5BE]">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
