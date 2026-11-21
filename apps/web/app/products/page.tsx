'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Cpu,
  Disc,
  Cog,
  Wind,
  Filter,
  Eye,
  Plus,
  Check
} from 'lucide-react';
import ModelCatalogueTable from '@/components/ModelCatalogueTable';
import { useEnquiry } from '@/lib/enquiryContext';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';

const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products / Full Catalogue', icon: Layers, query: '' },
  { id: 'engine', name: 'Engine Parts', icon: Cog, query: 'cylinder piston valve crank head' },
  { id: 'brake', name: 'Brake System', icon: Disc, query: 'brake shoe pad disc caliper master' },
  { id: 'suspension', name: 'Suspension & Steering', icon: SlidersHorizontal, query: 'fork shock absorber handle steering bearing' },
  { id: 'electrical', name: 'Electrical Parts', icon: Cpu, query: 'coil spark plug cdi starter stator harness relay' },
  { id: 'filters', name: 'Filters', icon: Wind, query: 'filter air oil fuel element cleaner' },
  { id: 'cooling', name: 'Cooling System', icon: Wind, query: 'radiator fan hose coolant pump' },
  { id: 'transmission', name: 'Transmission Parts', icon: Package, query: 'clutch gear belt chain sprocket roller pulley' },
  { id: 'other', name: 'Other Components', icon: ShieldCheck, query: 'gasket bolt nut washer cable lock mirror body' }
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearchType = searchParams.get('searchBy') || 'all';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchMode, setSearchMode] = useState<string>(initialSearchType);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'catalogue' | 'cards'>('catalogue');

  const { items, addItem } = useEnquiry();

  // Cart quick map
  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => map.set(it.partNumber.toLowerCase(), it.quantity));
    return map;
  }, [items]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-10">
      
      {/* 1. Header & Breadcrumbs */}
      <div className="space-y-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-navy-900 font-bold">Products &amp; Full Catalogue</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Export Spare Parts Portfolio
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-900 tracking-tight">
              Products &amp; Spare Parts Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Authentic OEM, OES, and rigorously vetted aftermarket spare parts for Indian two-wheelers, three-wheelers, and passenger cars. Ready for worldwide wholesale B2B export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Link
              href="/brands"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-navy-900 border border-slate-200 hover:border-brand-orange transition-all shadow-2xs flex items-center gap-1.5"
            >
              <span>Browse by Brand</span>
              <ArrowRight className="w-3.5 h-3.5 text-brand-orange" />
            </Link>
            <Link
              href="/#contact"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-navy-900 text-white hover:bg-brand-orange transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Request Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Product Categories Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Product Categories
          </span>
          <span className="text-xs text-slate-500 font-medium">
            3,127+ OEM Part Numbers Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSearchQuery(cat.query);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isActive
                    ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-brand-orange/40'
                    : 'bg-white text-navy-900 border-slate-200 hover:border-brand-orange hover:bg-slate-50/80 shadow-2xs'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isActive ? 'bg-white/10 text-brand-orange' : 'bg-navy-50 text-navy-900'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold leading-tight">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Parts Search Options: Part Number, Product Name, OEM Number */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-navy-900">
              Parts Search Engine
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by exact OEM part number, descriptive keyword, or assembly figure.
            </p>
          </div>

          {/* Search Type Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
            {[
              { id: 'all', label: 'All Search' },
              { id: 'partNo', label: 'By Part Number' },
              { id: 'name', label: 'By Product Name' },
              { id: 'oem', label: 'By OEM Number' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSearchMode(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  searchMode === tab.id
                    ? 'bg-white text-navy-900 shadow-xs'
                    : 'hover:text-navy-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Interactive OEM Catalogue Table with full features */}
        <ModelCatalogueTable initialModel="ALL" showTitle={false} />
      </div>

      {/* 5. Product Details Information & Specification Guarantee */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-navy-900 flex items-center justify-center">
            <Package className="w-5 h-5 text-brand-orange" />
          </div>
          <h3 className="font-black text-base text-navy-900">Product Information &amp; Specs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every part is verified against official factory parts catalogues, including technical dimensions, figure breakdowns, and standard export packaging quantities.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-black text-base text-navy-900">Genuine OEM &amp; OES Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct procurement from authorized Indian OEM suppliers and Tier-1 certified automotive component manufacturers ensuring 100% fitment accuracy.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
          </div>
          <h3 className="font-black text-base text-navy-900">B2B Quotation &amp; Fast Dispatch</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Add parts to your RFQ Basket with one click and submit for immediate wholesale pricing, FOB/CIF container rates, and air parcel logistics.
          </p>
        </div>
      </div>

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading products catalogue...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
