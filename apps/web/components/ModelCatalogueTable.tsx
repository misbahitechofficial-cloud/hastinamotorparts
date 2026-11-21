'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Copy,
  Plus,
  Check,
  RotateCcw,
  FileSpreadsheet,
  X,
  Layers,
  ArrowRight,
  Filter,
  LayoutGrid,
  List,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { CATALOGUE_DB, getCatalogueBrands, ModelMeta } from '@/lib/embeddedCatalogue';
import { useEnquiry } from '@/lib/enquiryContext';

export interface CatalogPart {
  id: number;
  modelCode: string;
  modelLabel: string;
  brand: string;
  brandSlug: string;
  fig: string;
  category: string;
  partNo: string;
  desc: string;
  qty: string;
  refNo: string;
  img: string;
  searchBlob: string;
}

interface ModelCatalogueTableProps {
  initialModel?: string;
  showTitle?: boolean;
}

export default function ModelCatalogueTable({
  initialModel = 'ALL',
  showTitle = true
}: ModelCatalogueTableProps) {
  const { items, addItem } = useEnquiry();

  // Selected Brand state ('ALL' or brand name e.g. 'Bajaj', 'Suzuki')
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // Default to Diagram Card Grid View!
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12); // 12 for neat 4-col grid
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Diagram Lightbox Modal State
  const [selectedDiagramPart, setSelectedDiagramPart] = useState<CatalogPart | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Sync initialModel if prop changes
  useEffect(() => {
    if (initialModel && initialModel !== 'ALL') {
      const foundModel = CATALOGUE_DB.m.find((m) => m.code === initialModel || m.slug === initialModel);
      if (foundModel) {
        setSelectedBrand(foundModel.brand);
        setSelectedModel(foundModel.code);
        setCurrentPage(1);
      } else {
        setSelectedModel(initialModel);
      }
    }
  }, [initialModel]);

  // Brand summaries
  const brandsList = useMemo(() => {
    return getCatalogueBrands();
  }, []);

  // Expand CATALOGUE_DB
  const allParts: CatalogPart[] = useMemo(() => {
    return CATALOGUE_DB.r.map((row, idx) => {
      const m = CATALOGUE_DB.m[row[0]];
      return {
        id: idx,
        modelCode: m.code,
        modelLabel: m.label,
        brand: m.brand,
        brandSlug: m.brandSlug,
        fig: row[1],
        category: CATALOGUE_DB.c[row[2]],
        partNo: row[3],
        desc: row[4],
        qty: String(row[5] || '1'),
        refNo: String(row[6] || ''),
        img: String(row[7] || ''),
        searchBlob: (
          m.brand + ' ' +
          m.code + ' ' +
          m.label + ' ' +
          row[1] + ' ' +
          CATALOGUE_DB.c[row[2]] + ' ' +
          row[3] + ' ' +
          row[4]
        ).toLowerCase()
      };
    });
  }, []);

  // Models filtered by selected brand
  const filteredModels = useMemo(() => {
    if (selectedBrand === 'ALL') {
      return CATALOGUE_DB.m;
    }
    return CATALOGUE_DB.m.filter((m) => m.brand === selectedBrand);
  }, [selectedBrand]);

  // Toast notification helper
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Copy OEM Part number
  const copyText = (text: string, successMsg: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(successMsg)).catch(() => fallbackCopy(text, successMsg));
    } else {
      fallbackCopy(text, successMsg);
    }
  };

  const fallbackCopy = (text: string, successMsg: string) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch {
      showToast('Copied: ' + text);
    }
    document.body.removeChild(ta);
  };

  // Categories list for selected brand / model
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    allParts.forEach((p) => {
      if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) return;
      if (selectedModel !== 'ALL' && p.modelCode !== selectedModel) return;
      cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [allParts, selectedBrand, selectedModel]);

  // Reset category if selected category is not in availableCategories
  useEffect(() => {
    if (selectedCategory !== 'ALL' && !availableCategories.includes(selectedCategory)) {
      setSelectedCategory('ALL');
    }
  }, [availableCategories, selectedCategory]);

  // Reset model if model doesn't belong to newly selected brand
  const handleBrandSelect = (brandName: string) => {
    setSelectedBrand(brandName);
    setSelectedModel('ALL');
    setSelectedCategory('ALL');
    setCurrentPage(1);
  };

  // Filtered Parts
  const filteredParts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const tokens = q ? q.split(/\s+/).filter(Boolean) : [];
    return allParts.filter((p) => {
      if (selectedBrand !== 'ALL' && p.brand !== selectedBrand) return false;
      if (selectedModel !== 'ALL' && p.modelCode !== selectedModel) return false;
      if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
      if (tokens.length > 0 && !tokens.every((t) => p.searchBlob.includes(t))) return false;
      return true;
    });
  }, [allParts, selectedBrand, selectedModel, selectedCategory, searchQuery]);

  // Pagination calculation
  const total = filteredParts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = filteredParts.slice(startIdx, startIdx + pageSize);

  const showStart = total === 0 ? 0 : startIdx + 1;
  const showEnd = Math.min(startIdx + pageSize, total);

  // RFQ Basket lookup map
  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => {
      map.set(it.partNumber.toLowerCase(), it.quantity);
    });
    return map;
  }, [items]);

  // Add to RFQ handler
  const handleAddToRfq = (part: CatalogPart) => {
    addItem({
      partNumber: part.partNo,
      name: part.desc,
      grade: 'OEM Genuine',
      moq: parseInt(part.qty, 10) || 1
    }, 1);
    showToast(`Added ${part.partNo} to RFQ Basket`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedBrand('ALL');
    setSelectedModel('ALL');
    setSelectedCategory('ALL');
    setSearchQuery('');
    setCurrentPage(1);
    setPageSize(12);
    showToast('Filters reset');
  };

  // CSV download function
  const downloadCsv = (filename: string, rows: (string | number)[][]) => {
    const csv = rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Exported ${rows.length - 1} parts to CSV`);
  };

  const handleExportFilteredCsv = () => {
    const header = ['Brand', 'Model', 'Figure/Plate', 'Assembly Category', 'Ref No', 'OEM Part No', 'Description', 'Std Qty'];
    const rows = filteredParts.map((p) => [
      p.brand,
      p.modelLabel,
      p.fig,
      p.category,
      p.refNo,
      p.partNo,
      p.desc,
      p.qty
    ]);
    downloadCsv(`hastina_parts_${selectedBrand.toLowerCase()}_${selectedModel.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
  };

  return (
    <div id="catalogue-table" className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#102b4c] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#f36b21]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {showTitle && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#f36b21]">
              Verified Technical Diagrams &amp; OEM Database
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102b4c] tracking-tight mt-1">
              Parts Finder with Exploded Schematic Diagrams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Official exploded schematics, plate illustrations, and exact reference numbers for Indian motorcycles, scooters &amp; three-wheelers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleExportFilteredCsv}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#102b4c] bg-white hover:bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#102b4c] bg-white hover:bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          1. BRAND SELECTOR TABS
      ========================================================================= */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#f36b21]" />
          <span>Step 1: Select Brand / Manufacturer</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Brands Tab */}
          <button
            type="button"
            onClick={() => handleBrandSelect('ALL')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedBrand === 'ALL'
                ? 'bg-[#102b4c] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            All Brands <span className="ml-1 opacity-75 font-normal font-mono">({allParts.length.toLocaleString()})</span>
          </button>

          {/* Dynamic Brand Tabs */}
          {brandsList.map((b) => (
            <button
              key={b.name}
              type="button"
              onClick={() => handleBrandSelect(b.name)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedBrand === b.name
                  ? 'bg-[#102b4c] text-white shadow-sm ring-2 ring-[#f36b21]/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${b.name === 'Bajaj' ? 'bg-sky-400' : 'bg-[#f36b21]'}`} />
              <span>{b.name}</span>
              <span className="opacity-75 font-normal font-mono text-xs">
                ({b.partCount.toLocaleString()} parts)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          2. MODEL PILLS (FILTERED TO SELECTED BRAND)
      ========================================================================= */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#f36b21]" />
          <span>Step 2: Select Vehicle Model</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* All Models Pill */}
          <button
            type="button"
            onClick={() => { setSelectedModel('ALL'); setCurrentPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedModel === 'ALL'
                ? 'bg-[#f36b21] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {selectedBrand === 'ALL' ? 'All Models' : `All ${selectedBrand} Models`}
            <span className="ml-1 opacity-80 font-normal font-mono">
              ({filteredModels.reduce((acc, m) => acc + m.count, 0).toLocaleString()})
            </span>
          </button>

          {/* Individual Models */}
          {filteredModels.map((m) => (
            <button
              key={m.code}
              type="button"
              onClick={() => { setSelectedModel(m.code); setCurrentPage(1); }}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedModel === m.code
                  ? 'bg-[#f36b21] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{m.label}</span>
              <span className="ml-1 opacity-80 font-normal font-mono">({m.count.toLocaleString()})</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. SEARCH & ASSEMBLY CONTROLS BAR (WITH VIEW TOGGLE)
      ========================================================================= */}
      <div className="bg-[#edf3f9] p-3.5 sm:p-4 rounded-2xl border border-[#d6e2ee] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search Part No (e.g. 39 1013 21, 11170-02L10-000), description, or Plate/FIG..."
            className="w-full bg-white text-xs sm:text-sm text-[#102b4c] pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#102b4c] p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Assembly / Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={selectedCategory}
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white text-xs sm:text-sm text-[#102b4c] px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21] cursor-pointer"
          >
            <option value="ALL">All Assemblies / Figures ({availableCategories.length})</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* View Switcher: Diagram Grid vs Table */}
        <div className="md:col-span-4 flex items-center justify-between sm:justify-end gap-2">
          {/* View Toggle */}
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-300 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#102b4c] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
              title="Diagram Card View (as requested)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#f36b21]" />
              <span className="hidden sm:inline">Diagrams</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#102b4c] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
              }`}
              title="Table List View"
            >
              <List className="w-3.5 h-3.5 text-[#f36b21]" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="bg-white text-xs font-semibold text-[#102b4c] px-2.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21] cursor-pointer"
            title="Rows per page"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>

          <span className="text-xs font-bold text-[#102b4c] bg-white border border-[#aebdce] px-2.5 py-2 rounded-xl whitespace-nowrap shadow-2xs font-mono">
            {total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Active Search Banner */}
      {searchQuery && (
        <div className="flex items-center justify-between bg-blue-50/90 border border-blue-200 text-blue-900 px-4 py-2.5 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold">Search results:</span>
            <span>Found <strong>{total}</strong> matching parts for &quot;{searchQuery}&quot; (Showing <strong>{showStart}–{showEnd}</strong>)</span>
          </div>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
            className="text-[#f36b21] hover:underline font-bold cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* =========================================================================
          4. PARTS RENDERING: DIAGRAM CARD GRID (EXACT SCREENSHOT STYLE) OR TABLE
      ========================================================================= */}
      {pageItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-2">
          <p className="text-base font-bold text-[#102b4c]">No parts matched your filter criteria.</p>
          <p className="text-xs text-slate-500">Try searching another part name or number, or click Reset.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ================= DIAGRAM CARD GRID VIEW ================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {pageItems.map((p) => {
            const inCartQty = cartMap.get(p.partNo.toLowerCase()) || 0;

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#f36b21]/50 transition-all duration-300 group"
              >
                {/* 1. TOP DIAGRAM IMAGE AREA (Click to open zoom lightbox) */}
                <div
                  onClick={() => { setSelectedDiagramPart(p); setZoomLevel(1); }}
                  className="relative h-44 sm:h-48 bg-white border-b border-slate-100 p-2.5 flex items-center justify-center overflow-hidden cursor-pointer group-hover:bg-slate-50/60 transition-colors"
                  title="Click to zoom exploded schematic diagram"
                >
                  {p.img ? (
                    <img
                      src={p.img}
                      alt={p.desc}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center justify-center gap-1 py-8">
                      <Layers className="w-10 h-10 opacity-30" />
                      <span className="text-[10px] text-slate-400 font-medium">Technical Diagram</span>
                    </div>
                  )}

                  {/* Top-Left Badges: PLATE / FIG and REF # (Yellow/Amber) */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap max-w-[85%] z-10">
                    <span className="px-2 py-0.5 rounded-md bg-[#102b4c] text-white text-[10px] sm:text-[11px] font-bold shadow-2xs">
                      {p.fig}
                    </span>
                    {p.refNo && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 border border-amber-300 text-[10px] sm:text-[11px] font-extrabold shadow-2xs">
                        REF #{p.refNo}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Maximize Icon on hover */}
                  <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-md text-slate-700 shadow-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Bottom-Right Qty Badge */}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-slate-100/95 text-slate-700 border border-slate-200/90 text-[10px] sm:text-[11px] font-bold shadow-2xs z-10">
                    Qty: {p.qty}
                  </span>
                </div>

                {/* 2. CARD CONTENT BODY */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    {/* Category Title in Light Blue (matches user screenshot) */}
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] sm:text-xs font-semibold text-sky-600 truncate block">
                        {p.category}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                        p.brand === 'Bajaj'
                          ? 'bg-sky-50 text-sky-900 border-sky-200'
                          : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`}>
                        {p.brand}
                      </span>
                    </div>

                    {/* Part Description / Name in bold */}
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#102b4c] leading-snug line-clamp-2" title={p.desc}>
                      {p.desc}
                    </h4>
                  </div>

                  {/* 3. BOTTOM ROW: PART NUMBER + COPY + ADD RFQ */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs sm:text-[13px] font-bold text-slate-900 tracking-tight">
                      {p.partNo}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); copyText(p.partNo, `Copied ${p.partNo}`); }}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        title="Copy Part Number"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleAddToRfq(p); }}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          inCartQty > 0
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#102b4c] hover:bg-[#f36b21] text-white'
                        }`}
                      >
                        {inCartQty > 0 ? `✓ (${inCartQty})` : '+ Add'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE LIST VIEW ================= */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="bg-[#102b4c] text-white text-xs uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Diagram</th>
                  <th className="py-3.5 px-4">Brand &amp; Model</th>
                  <th className="py-3.5 px-4">Figure / Plate</th>
                  <th className="py-3.5 px-4">OEM Part No.</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-3 text-center">Std Qty</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {pageItems.map((p) => {
                  const inCartQty = cartMap.get(p.partNo.toLowerCase()) || 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-2 px-3 w-14">
                        {p.img ? (
                          <div
                            onClick={() => { setSelectedDiagramPart(p); setZoomLevel(1); }}
                            className="w-12 h-12 bg-white rounded-lg border border-slate-200 p-1 flex items-center justify-center overflow-hidden cursor-pointer hover:border-[#f36b21]"
                          >
                            <img src={p.img} alt={p.desc} className="max-h-full max-w-full object-contain" />
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                              p.brand === 'Bajaj'
                                ? 'bg-sky-50 text-sky-900 border-sky-200'
                                : 'bg-blue-50 text-blue-900 border-blue-200'
                            }`}
                          >
                            {p.brand}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {p.modelLabel}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#102b4c]">{p.fig}</span>
                          {p.refNo && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[10px] font-bold">
                              #{p.refNo}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={p.category}>
                          {p.category}
                        </div>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <code className="font-mono text-xs font-bold bg-slate-100 text-[#102b4c] px-2 py-0.5 rounded border border-slate-200">
                            {p.partNo}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyText(p.partNo, `Copied ${p.partNo}`)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-[#102b4c] cursor-pointer"
                            title="Copy OEM Part Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">{p.desc}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-600">{p.qty}</td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleAddToRfq(p)}
                          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                            inCartQty > 0
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-[#102b4c] hover:bg-[#f36b21] text-white'
                          }`}
                        >
                          {inCartQty > 0 ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>In RFQ ({inCartQty})</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add RFQ</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          5. PAGINATION CONTROLS
      ========================================================================= */}
      <div className="bg-slate-50 px-4 py-3.5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-medium">
            Showing <span className="font-bold text-[#102b4c]">{showStart}–{showEnd}</span> of <span className="font-bold text-[#102b4c]">{total.toLocaleString()}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[#102b4c] font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="font-bold text-[#102b4c] px-2 font-mono">
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-[#102b4c] font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      {/* =========================================================================
          6. DIAGRAM ZOOM & LIGHTBOX MODAL
      ========================================================================= */}
      {selectedDiagramPart && (
        <div
          className="fixed inset-0 z-50 bg-[#041120]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setSelectedDiagramPart(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#102b4c] text-white px-5 py-4 flex items-center justify-between border-b border-[#183c63]">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-[#f36b21] text-white text-xs font-bold">
                  {selectedDiagramPart.fig}
                </span>
                {selectedDiagramPart.refNo && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 text-xs font-extrabold">
                    REF #{selectedDiagramPart.refNo}
                  </span>
                )}
                <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-md">
                  {selectedDiagramPart.category} · {selectedDiagramPart.modelLabel}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer"
                  title="Reset Zoom"
                >
                  100%
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDiagramPart(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold cursor-pointer ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Image Body with Zoom */}
            <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50 flex items-center justify-center min-h-[300px] max-h-[60vh]">
              {selectedDiagramPart.img ? (
                <div
                  className="transition-transform duration-200 max-h-full max-w-full flex items-center justify-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={selectedDiagramPart.img}
                    alt={selectedDiagramPart.desc}
                    className="max-h-[50vh] max-w-full object-contain rounded-xl bg-white p-3 border border-slate-200 shadow-sm"
                  />
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <p>No technical diagram available for this component.</p>
                </div>
              )}
            </div>

            {/* Modal Footer with Part Actions */}
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-sky-600 font-semibold">{selectedDiagramPart.category}</span>
                <h4 className="text-sm sm:text-base font-black text-[#102b4c]">
                  {selectedDiagramPart.desc}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs">
                  <span className="font-mono font-bold text-slate-800">
                    OEM: {selectedDiagramPart.partNo}
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600">
                    Std Qty: <strong>{selectedDiagramPart.qty}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => copyText(selectedDiagramPart.partNo, `Copied ${selectedDiagramPart.partNo}`)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-[#102b4c] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Part No</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddToRfq(selectedDiagramPart);
                    setSelectedDiagramPart(null);
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#f36b21] hover:bg-[#db5b12] text-white text-xs font-bold cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to RFQ Basket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
