'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, SlidersHorizontal, ArrowRight, ShieldCheck, X, RefreshCw, Bike, Search } from 'lucide-react';
import PartCard from '@/components/PartCard';
import { useVehicle } from '@/lib/vehicleContext';
import { api } from '@/lib/api';

function PartsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedVehicle, clearVehicle, openSelector } = useVehicle();

  // Query parameters
  const qParam = searchParams.get('q') || '';
  const brandParam = searchParams.get('brand') || '';
  const modelParam = searchParams.get('model') || '';
  const modelIdParam = searchParams.get('modelId') || '';
  const categoryParam = searchParams.get('category') || '';
  const gradeParam = searchParams.get('grade') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [parts, setParts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter options state
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Mobile filters toggle
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Load brands and categories for sidebar
  useEffect(() => {
    api.getBrands().then(res => res.success && setBrands(res.brands)).catch(console.error);
    api.getCategories(1).then(res => res.success && setCategories(res.categories)).catch(console.error);
  }, []);

  // Fetch models if brand is selected
  useEffect(() => {
    if (brandParam) {
      api.getBrandModels(brandParam).then(res => res.success && setModels(res.models)).catch(console.error);
    } else {
      setModels([]);
    }
  }, [brandParam]);

  // Main data fetch
  useEffect(() => {
    setIsLoading(true);

    const activeBrand = brandParam || (selectedVehicle && !brandParam && !modelParam ? selectedVehicle.brandSlug : undefined);
    const activeModel = modelParam || modelIdParam || (selectedVehicle && !brandParam && !modelParam ? selectedVehicle.modelSlug || selectedVehicle.modelId : undefined);

    api.getParts({
      q: qParam,
      brand: activeBrand,
      model: activeModel,
      category: categoryParam,
      grade: gradeParam,
      sort: sortParam,
      page: pageParam,
      limit: 12
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
  }, [qParam, brandParam, modelParam, modelIdParam, categoryParam, gradeParam, sortParam, pageParam, selectedVehicle]);

  // Update query params helper
  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    router.push(`/parts?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push('/parts');
  };

  const hasActiveFilters = Boolean(
    qParam || brandParam || modelParam || modelIdParam || categoryParam || gradeParam
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12">
      {/* 1. Page Header & Active Vehicle Banner */}
      <div className="mb-8">
        <div className="flex justify-center mb-4">
          <img
            src="/hastina-logo.svg"
            alt="Hastina Motor Parts"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#54A5BE] bg-[#54A5BE]/10 border border-[#54A5BE]/30 px-3 py-0.5 rounded-full inline-block mb-1.5">
              OEM &amp; AFTERMARKET DIRECTORY
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#232323] tracking-tight">
              Spare Parts Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Search by OEM/OES part number, brand, model, or component system.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openSelector}
              className="bg-[#232323] hover:bg-[#1E2125] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md border border-[#C8C9CE]/30"
            >
              <Bike className="w-4 h-4 text-[#54A5BE]" />
              <span>{selectedVehicle ? `Vehicle: ${selectedVehicle.brandName} ${selectedVehicle.modelName}` : 'Select Vehicle Filter'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden bg-white border border-[#C8C9CE]/40 text-[#232323] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#54A5BE]" />
              <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>
          </div>
        </div>

        {/* Vehicle banner */}
        {selectedVehicle && (
          <div className="bg-[#E9F5F8] border border-[#54A5BE]/40 rounded-2xl p-3 sm:p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#275765] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#54A5BE] animate-pulse" />
              <span>Filtered to parts compatible with: <strong>{selectedVehicle.brandName} {selectedVehicle.modelName}</strong> ({selectedVehicle.type})</span>
            </div>
            <button
              type="button"
              onClick={clearVehicle}
              className="text-sky-600 hover:text-sky-700 hover:underline font-bold flex items-center gap-1 ms-2"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Grid with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`lg:col-span-1 space-y-6 ${
            isMobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-white rounded-3xl border border-[#C8C9CE]/40 p-5 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-black uppercase tracking-wider text-[#232323] flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#54A5BE]" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Quality Grade Filter */}
            <div>
              <label className="text-xs font-bold text-[#232323] uppercase tracking-wider block mb-2">
                Quality Grade
              </label>
              <div className="space-y-1.5">
                {[
                  { id: '', label: 'All Grades' },
                  { id: 'GENUINE', label: 'OEM Genuine' },
                  { id: 'OES', label: 'Tier-1 OES' },
                  { id: 'AFTERMARKET', label: 'Export Aftermarket' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => updateFilter('grade', g.id || undefined)}
                    className={`w-full text-start text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-between ${
                      gradeParam === g.id
                        ? 'bg-[#232323] text-white shadow-sm'
                        : 'text-gray-700 hover:bg-[#F8F9FB]'
                    }`}
                  >
                    <span>{g.label}</span>
                    {gradeParam === g.id && <span className="text-[#54A5BE]">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="text-xs font-bold text-[#232323] uppercase tracking-wider block mb-2">
                Vehicle Brand
              </label>
              <select
                value={brandParam}
                onChange={(e) => {
                  const val = e.target.value;
                  const params = new URLSearchParams(searchParams.toString());
                  if (val) params.set('brand', val);
                  else params.delete('brand');
                  params.delete('model');
                  params.delete('modelId');
                  params.set('page', '1');
                  router.push(`/parts?${params.toString()}`);
                }}
                className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#232323] focus:outline-none focus:border-[#54A5BE]"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name} ({b.modelsCount || ''})
                  </option>
                ))}
              </select>
            </div>

            {/* Model Filter */}
            {brandParam && models.length > 0 && (
              <div>
                <label className="text-xs font-bold text-[#232323] uppercase tracking-wider block mb-2">
                  Model
                </label>
                <select
                  value={modelParam}
                  onChange={(e) => updateFilter('model', e.target.value || undefined)}
                  className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#232323] focus:outline-none focus:border-[#54A5BE]"
                >
                  <option value="">All {brandParam} Models</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.slug}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <label className="text-xs font-bold text-[#232323] uppercase tracking-wider block mb-2">
                Category
              </label>
              <select
                value={categoryParam}
                onChange={(e) => updateFilter('category', e.target.value || undefined)}
                className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#232323] focus:outline-none focus:border-[#54A5BE]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="text-xs font-bold text-[#232323] uppercase tracking-wider block mb-2">
                Sort By
              </label>
              <select
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="w-full bg-[#F8F9FB] border border-[#C8C9CE] rounded-xl px-3 py-2.5 text-xs font-semibold text-[#232323] focus:outline-none focus:border-[#54A5BE]"
              >
                <option value="newest">Recently Added</option>
                <option value="name_asc">Part Name (A - Z)</option>
                <option value="part_number">Part Number</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Parts Listing Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Status bar */}
          <div className="flex items-center justify-between text-xs text-gray-500 bg-white rounded-2xl p-3.5 border border-[#C8C9CE]/40 shadow-xs">
            <div>
              Showing <strong className="text-[#232323]">{parts.length}</strong> of{' '}
              <strong className="text-[#232323]">{total}</strong> parts
              {qParam && (
                <span>
                  {' '}matching &quot;<strong className="text-[#54A5BE]">{qParam}</strong>&quot;
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-[#54A5BE] hover:underline font-bold"
              >
                Clear all filters
              </button>
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
            /* ZERO RESULTS STATE */
            <div className="bg-white border border-[#C8C9CE]/40 rounded-3xl p-10 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-[#E9F5F8] text-[#54A5BE] mx-auto flex items-center justify-center font-bold text-2xl shadow-xs">
                🔍
              </div>
              <h3 className="text-xl font-bold text-[#232323]">
                No Exact Catalogue Match Found
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                We supply thousands of Indian spare parts beyond our online catalogue. Send us the OEM/OES part number or photograph and our export sourcing desk will quote directly!
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push(`/enquiry?quickPart=${encodeURIComponent(qParam || 'Custom Part Request')}`)}
                  className="bg-[#54A5BE] hover:bg-[#438ea5] text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md shadow-[#54A5BE]/25 flex items-center gap-2"
                >
                  <span>Request Quotation for &quot;{qParam || 'Unlisted Part'}&quot;</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-white border border-[#C8C9CE] text-[#232323] font-bold text-xs px-6 py-3 rounded-xl hover:bg-[#F8F9FB] transition-colors"
                >
                  View All Parts
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                type="button"
                disabled={pageParam <= 1}
                onClick={() => updateFilter('page', String(pageParam - 1))}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#C8C9CE] text-[#232323] disabled:opacity-40 hover:bg-[#F8F9FB] transition-colors shadow-xs"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-500 px-3">
                Page {pageParam} of {totalPages}
              </span>
              <button
                type="button"
                disabled={pageParam >= totalPages}
                onClick={() => updateFilter('page', String(pageParam + 1))}
                className="px-5 py-2.5 rounded-xl text-xs font-bold border border-[#C8C9CE] text-[#232323] disabled:opacity-40 hover:bg-[#F8F9FB] transition-colors shadow-xs"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function PartsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-gray-500">Loading parts catalogue...</div>}>
      <PartsContent />
    </Suspense>
  );
}
