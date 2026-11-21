'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Bike,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { api } from '@/lib/api';
import PartCard from '@/components/PartCard';
import { useVehicle } from '@/lib/vehicleContext';

export default function DedicatedModelPartsPage() {
  const params = useParams();
  const router = useRouter();
  const brandSlug = params?.brand as string;
  const modelSlug = params?.model as string;

  const [parts, setParts] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [model, setModel] = useState<any | null>(null);
  const [brand, setBrand] = useState<any | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string; count?: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeQuery, setActiveQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const { setVehicle } = useVehicle();

  // 1. Fetch Brand & Model Meta
  useEffect(() => {
    if (brandSlug && modelSlug) {
      api.getBrandModels(brandSlug)
        .then((res) => {
          if (res.success) {
            setBrand(res.brand);
            const found = res.models.find((m: any) => m.slug.toLowerCase() === modelSlug.toLowerCase());
            if (found) {
              setModel(found);
              setVehicle({
                type: found.type,
                brandId: res.brand.id,
                brandName: res.brand.name,
                brandSlug: res.brand.slug,
                modelId: found.id,
                modelName: found.name,
                modelSlug: found.slug,
                year: found.yearFrom
              });
            }
          }
        })
        .catch(console.error);

      // Load specific assembly categories for this model
      fetch(`/api/categories?model=${encodeURIComponent(modelSlug)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.categories) {
            setCategories(data.categories.slice(0, 15));
          }
        })
        .catch(console.error);
    }
  }, [brandSlug, modelSlug]);

  // 2. Fetch Parts for this Model with search, category, and pagination
  useEffect(() => {
    if (brandSlug && modelSlug) {
      setIsLoading(true);
      api.getParts({
        brand: brandSlug,
        model: modelSlug,
        category: selectedCategory || undefined,
        q: activeQuery || undefined,
        page,
        limit: 24
      })
        .then((res) => {
          if (res.success) {
            setParts(res.items);
            setTotal(res.total);
            setTotalPages(res.totalPages);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [brandSlug, modelSlug, selectedCategory, activeQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveQuery(searchQuery.trim());
  };

  const handleCategoryClick = (catSlug: string) => {
    setPage(1);
    setSelectedCategory(catSlug === selectedCategory ? '' : catSlug);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveQuery('');
    setSelectedCategory('');
    setPage(1);
  };

  const isScooter = model?.type?.toUpperCase() === 'SCOOTER' || model?.vehicleType?.toUpperCase() === 'SCOOTER';

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-10 font-sans">
      
      {/* 0. Top Brand Logo */}
      <div className="flex justify-center mb-2">
        <img
          src="/hastina-logo.svg"
          alt="Hastina Motor Parts"
          className="h-20 sm:h-24 w-auto object-contain"
        />
      </div>

      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
        <Link href="/" className="hover:text-sky-600 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/brands" className="hover:text-sky-600 transition-colors">Brands</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href={`/brands/${brandSlug}`} className="hover:text-sky-600 transition-colors">{brand?.name || brandSlug}</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-slate-900 font-bold">{model?.name || modelSlug}</span>
      </nav>

      {/* 2. Hero Model Header Banner */}
      <div className="relative overflow-hidden bg-[#0B1120] text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-sky-500/20">
                {model?.type || (isScooter ? 'SCOOTER' : 'MOTORCYCLE')}
              </span>
              <span className="text-xs text-slate-400 font-medium bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                Manufacturer: <strong className="text-white">{brand?.name || 'Suzuki'}</strong>
              </span>
              {model?.displacement && (
                <span className="text-xs text-sky-300 font-mono bg-sky-950/60 px-3 py-1 rounded-full border border-sky-800/60">
                  {model.displacement}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {brand?.name || 'Suzuki'} {model?.name || modelSlug} Spare Parts
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Complete official parts finder catalogue for <strong className="text-white">{model?.name || modelSlug}</strong>. Every genuine OEM part number, exploded diagram reference, gasket, cylinder, clutch, brake assembly, and electrical component ready for B2B export and wholesale supply.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs text-slate-300 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine OEM Standards</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Export Packaging &amp; Fast Air/Sea Dispatch</span>
              </div>
            </div>
          </div>

          {/* Model Fitment Card */}
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 text-xs shrink-0 space-y-3 min-w-[260px] shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400 font-mono uppercase text-[10px] tracking-wider">Catalogue Fitment</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="space-y-1">
              <div className="text-base font-black text-white">{model?.name || modelSlug}</div>
              <div className="text-[11px] text-slate-400">
                {model?.yearFrom ? `Years: ${model.yearFrom} – Present` : 'All Variant Generations'}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Parts In Catalogue:</span>
              <span className="text-sm font-mono font-bold text-sky-400">{total > 0 ? `${total} Parts` : '620+ Parts'}</span>
            </div>

            <Link
              href={`/parts?brand=${brandSlug}&model=${modelSlug}`}
              className="mt-2 w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20"
            >
              <span>Full Grid Catalogue</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. In-Model Quick Search & Category System Filter */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Search Bar within this model */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-stretch border border-slate-300 rounded-xl overflow-hidden focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all bg-white h-11 sm:h-12 shadow-2xs">
            <div className="ps-3.5 pe-2 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search within ${model?.name || 'this model'} (e.g. 11170, Cylinder, Gasket, Brake, Bolt)...`}
              className="flex-1 text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveQuery('');
                  setPage(1);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs px-2.5 font-bold"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="px-5 sm:px-7 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Filter</span>
            </button>
          </form>

          {(activeQuery || selectedCategory) && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 shrink-0 self-center"
            >
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Dynamic Assembly System Category Chips */}
        {categories.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>OEM Assembly Diagrams / Systems</span>
              </span>
              <span className="text-[10px] text-slate-400">Select system to filter</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleCategoryClick('')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  !selectedCategory
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Assembly Parts ({total})
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.slug
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {cat.count && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedCategory === cat.slug ? 'bg-sky-600/30 text-slate-950 font-black' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Parts Listing Grid */}
      <div className="space-y-6">
        
        {/* Status header */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <strong className="text-slate-900">{parts.length}</strong> of{' '}
            <strong className="text-slate-900">{total}</strong> verified OEM parts for{' '}
            <strong className="text-sky-600">{brand?.name} {model?.name}</strong>
            {activeQuery && (
              <span> matching &ldquo;<strong className="text-slate-900">{activeQuery}</strong>&rdquo;</span>
            )}
            {selectedCategory && (
              <span> in system &ldquo;<strong className="text-slate-900">{selectedCategory}</strong>&rdquo;</span>
            )}
          </div>
          {totalPages > 1 && (
            <div className="text-slate-400 font-mono">
              Page {page} of {totalPages}
            </div>
          )}
        </div>

        {/* Parts List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : parts.length > 0 ? (
          <div className="space-y-3">
            {parts.map((p) => (
              <PartCard key={p.id} part={p} />
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 mx-auto flex items-center justify-center font-bold text-2xl shadow-xs">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No matching spare parts for this filter
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              We carry thousands of verified OEM components for {model?.name}. You can clear your active filters or send us an export RFQ with your exact part number or diagram reference.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={clearAllFilters}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
              >
                Reset Search Filters
              </button>
              <Link
                href={`/enquiry?quickPart=${encodeURIComponent(`${brand?.name} ${model?.name}`)}`}
                className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                Send Request for {model?.name} Parts
              </Link>
            </div>
          </div>
        )}

        {/* 5. Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => {
                setPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              ← Previous
            </button>
            <span className="text-xs font-semibold text-slate-500 px-3 font-mono">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => {
                setPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 disabled:opacity-40 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* 6. Model Sourcing Bottom CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B1120] to-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-start">
          <div className="text-sky-400 text-xs font-bold uppercase tracking-wider">
            Bulk B2B Export Supply
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Wholesale Containers &amp; Fast Air Shipments for {model?.name || 'Suzuki Parts'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            We assemble consolidated export shipments containing genuine {brand?.name} spare parts with certificate of origin, pre-shipment quality inspection, and custom labelling.
          </p>
        </div>

        <Link
          href={`/enquiry?quickPart=${encodeURIComponent(`${brand?.name} ${model?.name} Bulk Order`)}`}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-black text-xs px-7 py-3.5 rounded-full transition-all shrink-0 shadow-lg shadow-sky-500/25 flex items-center gap-2"
        >
          <span>Request Wholesale Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
