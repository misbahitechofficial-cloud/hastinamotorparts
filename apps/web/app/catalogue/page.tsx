'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Layers } from 'lucide-react';
import ModelCatalogueTable from '@/components/ModelCatalogueTable';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get('model') || 'ALL';

  return (
    <div className="w-full min-h-screen bg-[#F8F9FB] px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <Link href="/brands" className="hover:text-brand-orange transition-colors">Brands &amp; Models</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="text-navy-900 font-bold">OEM Parts Catalogue</span>
      </nav>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <ModelCatalogueTable initialModel={initialModel} showTitle={true} />
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center text-slate-500 text-sm">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
