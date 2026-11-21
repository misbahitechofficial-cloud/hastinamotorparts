'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Search, ShieldCheck, ChevronRight, Layers, CheckCircle2, Database } from 'lucide-react';
import { ALL_BRANDS_WITH_MODELS, BrandItem } from '@/lib/brandModelsData';
import ModelCatalogueTable from '@/components/ModelCatalogueTable';

function BrandsContent() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get('model') || 'ALL';
  const [selectedType, setSelectedType] = useState<string>('');
  const [modelSearch, setModelSearch] = useState<string>('');

  // Client-side instant filter and search with zero lag or empty flash
  const filteredBrands = useMemo(() => {
    return ALL_BRANDS_WITH_MODELS.map((brand) => {
      let models = brand.models;

      // Filter by vehicle type
      if (selectedType) {
        models = models.filter((m) => m.type === selectedType);
      }

      // Filter by search query
      if (modelSearch.trim()) {
        const query = modelSearch.trim().toLowerCase();
        models = models.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.displacement.toLowerCase().includes(query) ||
            brand.name.toLowerCase().includes(query)
        );
      }

      return {
        ...brand,
        models,
        modelsCount: models.length
      };
    }).filter((brand) => brand.models.length > 0);
  }, [selectedType, modelSearch]);

  const totalModelsCount = useMemo(() => {
    return filteredBrands.reduce((acc, b) => acc + b.models.length, 0);
  }, [filteredBrands]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16 space-y-10">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="flex justify-center mb-2">
          <img
            src="/hastina-logo.svg"
            alt="Hastina Motor Parts"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#54A5BE] bg-[#54A5BE]/10 border border-[#54A5BE]/30 px-3.5 py-1 rounded-full inline-block">
          INDIAN TWO-WHEELER &amp; THREE-WHEELER COVERAGE
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#232323] tracking-tight">
          Browse Spare Parts by Brand &amp; Model
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 font-medium max-w-2xl mx-auto">
          We export genuine and high-precision aftermarket components for India’s premier motorcycle, scooter, and tuk-tuk brands.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {[
            { id: '', label: 'All Brands (6)' },
            { id: 'MOTORCYCLE', label: 'Motorcycles' },
            { id: 'SCOOTER', label: 'Scooters' },
            { id: 'TUKTUK', label: 'Tuk-Tuk 3-Wheelers' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedType(f.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === f.id
                  ? 'bg-[#0B1120] text-white shadow-md border border-slate-700/80'
                  : 'bg-white text-slate-700 border border-slate-200/90 hover:border-[#54A5BE] hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Instant Model Search Bar */}
        <div className="pt-2 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Quick search model (e.g. Access 125, Boxer, RE Tuk-Tuk, Gixxer)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-[#232323] placeholder:text-slate-400 focus:outline-none focus:border-[#54A5BE] focus:ring-1 focus:ring-[#54A5BE] shadow-xs"
            />
            {modelSearch && (
              <button
                type="button"
                onClick={() => setModelSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs font-mono text-slate-500">
        <span>
          SHOWING: <strong className="text-[#232323]">{filteredBrands.length}</strong> BRANDS // <strong className="text-[#54A5BE]">{totalModelsCount}</strong> TOTAL VEHICLE MODELS
        </span>
        {selectedType && (
          <button
            type="button"
            onClick={() => setSelectedType('')}
            className="text-[#54A5BE] hover:underline font-bold"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Official OEM Spare Parts Catalogue by Model (3,127 Parts) */}
      <section id="catalogue" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm scroll-mt-24">
        <ModelCatalogueTable initialModel={initialModel} showTitle={true} />
      </section>

      {/* Brands & Models Hierarchical List: Pehle Brand, Brand ke andar Model */}
      <div className="space-y-8">
        {filteredBrands.map((b) => (
          <section
            key={b.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6"
          >
            {/* 1. BRAND HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xs shrink-0"
                  style={{ backgroundColor: b.logoColor || '#0B1120' }}
                >
                  {b.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#232323] tracking-tight uppercase">
                      {b.name}
                    </h2>
                    <span className="text-[11px] font-mono font-bold text-[#54A5BE] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      {b.models.length} {b.models.length === 1 ? 'Model' : 'Models'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-xs text-slate-400 font-medium">{b.origin}</span>
                    <span className="text-slate-300">•</span>
                    {b.types.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/brands/${b.slug}`}
                  className="text-xs font-bold text-slate-600 hover:text-[#54A5BE] px-4 py-2 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  Brand Overview
                </Link>
                <Link
                  href={`/parts?brand=${b.slug}`}
                  className="text-xs font-bold text-white bg-[#0B1120] hover:bg-slate-800 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>All {b.name} Parts</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
                </Link>
              </div>
            </div>

            {/* 2. MODELS GRID INSIDE THE BRAND */}
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#54A5BE]" />
                <span>CHASSIS CATALOGUE MODELS // {b.name.toUpperCase()} FLEET</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {b.models.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/models/${b.slug}/${m.slug}`}
                    className="group bg-[#F8FAFC] rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-[#54A5BE] hover:bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200/80">
                          {m.typeLabel}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-[#54A5BE]">
                          {m.displacement}
                        </span>
                      </div>

                      {/* Model Name */}
                      <h3 className="font-extrabold text-base text-[#232323] group-hover:text-[#54A5BE] transition-colors leading-snug">
                        {m.name}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {m.desc}
                      </p>

                      {/* Technical Specs box */}
                      <div className="mt-3 py-2 px-2.5 rounded-lg bg-white border border-slate-200/60 text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Total Parts</span>
                          <span className="font-semibold text-slate-700">~{m.totalParts} OEM Items</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500">
                          <span>Export Ready</span>
                          <span className="font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Verified Fitment
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-3.5 mt-3.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-[#54A5BE]">
                      <span className="group-hover:underline flex items-center gap-1">
                        <span>Explore Parts</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        // {b.slug}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {filteredBrands.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <h3 className="text-lg font-bold text-[#232323]">No models found matching your criteria</h3>
            <p className="text-xs text-slate-500">Try selecting another filter or clearing your search term.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedType('');
                setModelSearch('');
              }}
              className="text-xs font-bold text-[#54A5BE] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading catalogue...</div>}>
      <BrandsContent />
    </Suspense>
  );
}
