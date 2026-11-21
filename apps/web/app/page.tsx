'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  Search,
  Copy,
  Plus,
  Check,
  CheckCircle2,
  X,
  ClipboardList,
  Send,
  Mail,
  MessageCircle,
  Phone,
  FileSpreadsheet,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Package,
  Handshake,
  Globe2,
  Truck,
  Headphones,
  Car,
  Layers,
  Wrench,
  Disc,
  Cog,
  Boxes,
  LayoutGrid,
  List,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';
import { useEnquiry } from '@/lib/enquiryContext';

// Compact DB row model
interface CatalogPart {
  id: number;
  modelCode: string;
  modelLabel: string;
  brand: string;
  fig: string;
  category: string;
  partNo: string;
  desc: string;
  qty: string;
  refNo: string;
  img: string;
  searchBlob: string;
}

export default function HomePage() {
  const { items, addItem, removeItem, updateQuantity, clearEnquiry, totalCount } = useEnquiry();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid'); // Default to Diagram Card Grid View
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);

  // Diagram Lightbox Modal State
  const [selectedDiagramPart, setSelectedDiagramPart] = useState<CatalogPart | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // UI Modals & Drawers
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState<boolean>(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    country: 'United Arab Emirates',
    type: 'Wholesale Supply',
    message: ''
  });

  // Expand compact DB for lightning fast search
  const allParts: CatalogPart[] = useMemo(() => {
    return CATALOGUE_DB.r.map((row, idx) => {
      const m = CATALOGUE_DB.m[row[0]];
      return {
        id: idx,
        modelCode: m.code,
        modelLabel: m.label,
        brand: m.brand,
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

  // Listen to custom header drawer event
  useEffect(() => {
    const handleOpenDrawer = () => setIsRfqDrawerOpen(true);
    window.addEventListener('open-rfq-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-rfq-drawer', handleOpenDrawer);
  }, []);

  // Show Toast notification
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  // Copy to clipboard helper
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
      showToast('Unable to copy automatically');
    }
    document.body.removeChild(ta);
  };

  // Search filter
  const filteredParts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    return allParts.filter((p) => {
      if (selectedModel !== 'ALL' && p.modelCode !== selectedModel) return false;
      return tokens.every((t) => p.searchBlob.includes(t));
    });
  }, [allParts, selectedModel, searchQuery]);

  // Pagination calculation
  const total = filteredParts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const pageItems = filteredParts.slice(startIdx, startIdx + pageSize);
  const showStart = total === 0 ? 0 : startIdx + 1;
  const showEnd = Math.min(startIdx + pageSize, total);

  // Cart lookup map
  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    items.forEach((it) => {
      map.set(it.partNumber.toLowerCase(), it.quantity);
    });
    return map;
  }, [items]);

  // Add to RFQ Basket
  const handleAddToRfq = (part: CatalogPart) => {
    addItem({
      partNumber: part.partNo,
      name: part.desc,
      grade: 'OEM Genuine',
      moq: parseInt(part.qty, 10) || 1
    }, 1);
    showToast(`Added ${part.partNo} to RFQ Basket`);
  };

  // Download CSV helper
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
  };

  const handleDownloadRfqCsv = () => {
    if (items.length === 0) {
      showToast('RFQ Basket is empty');
      return;
    }
    const headers = ['Item No.', 'OEM Part Number', 'Description', 'Quantity Requested'];
    const rows = items.map((it, idx) => [idx + 1, it.partNumber, it.name, it.quantity]);
    downloadCsv('Hastina_RFQ_Quotation_Request.csv', [headers, ...rows]);
    showToast('Downloaded RFQ Basket CSV');
  };

  const formatRfqText = () => {
    if (items.length === 0) return 'No OEM parts in RFQ Basket.';
    return items.map((i, idx) =>
      `${idx + 1}. OEM: ${i.partNumber} | ${i.name} | Qty: ${i.quantity}`
    ).join('\n');
  };

  // Search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      showToast('Please enter a part number, OEM or product name');
      return;
    }
    setSearchQuery(searchInput.trim());
    setCurrentPage(1);
    const searchTarget = document.getElementById('search');
    if (searchTarget) {
      searchTarget.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Quote form submission
  const handleQuoteFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    try {
      await fetch('/api/admin/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: quoteForm.name,
          company: quoteForm.company,
          country: quoteForm.country,
          email: quoteForm.email,
          phone: quoteForm.phone,
          type: quoteForm.type,
          message: quoteForm.message,
          items: items.map((i) => ({
            partNumber: i.partNumber,
            name: i.name,
            quantity: i.quantity
          })),
          status: 'NEW'
        })
      });
    } catch (err) {
      console.error(err);
    }
    setTimeout(() => {
      setQuoteSubmitted(false);
      setIsQuoteModalOpen(false);
      clearEnquiry();
      showToast('Thank you! Your quotation request has been recorded in Hastina Portal.');
    }, 1500);
  };

  return (
    <div className="w-full bg-white text-[#10213a] font-sans antialiased selection:bg-[#f36b21]/20 selection:text-[#f36b21]">

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#102b4c] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-xl shadow-2xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#f36b21]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          1. HERO SECTION (#home)
      ========================================================================= */}
      <section
        id="home"
        className="relative min-h-[460px] md:min-h-[520px] bg-[#061b31] text-white overflow-hidden flex items-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(6, 27, 49, 0.94) 0%, rgba(8, 34, 60, 0.82) 42%, rgba(8, 34, 60, 0.22) 100%), url('/images/hastina-hero-banner.jpg')`,
          backgroundPosition: 'center right',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#061b31]/60 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 z-10 w-full">
          <div className="max-w-2xl">
            <div className="text-[11px] sm:text-xs font-black tracking-[4px] uppercase text-[#d8e6f4] mb-3">
              IMPORT &nbsp;|&nbsp; EXPORT &nbsp;|&nbsp; WHOLESALE SUPPLY
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight leading-[1.08] mb-4">
              GLOBAL AUTOMOTIVE<br />
              PARTS <span className="text-[#f36b21]">SOURCING &amp; SUPPLY</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#e6edf5] leading-relaxed max-w-xl mb-6">
              Your Trusted Partner for Automotive Spare Parts Trading, International Sourcing and Global Supply Solutions.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="inline-flex items-center gap-2 bg-transparent hover:bg-white hover:text-[#102b4c] text-white font-bold text-sm px-6 py-3.5 rounded-xl border border-white transition-all cursor-pointer"
              >
                <ClipboardList className="w-4 h-4" />
                <span>Request a Quote</span>
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f36b21]" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/70" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TRADE BAR (4-PILLAR STRIP)
      ========================================================================= */}
      <section className="bg-[#102b4c] text-white relative border-y border-[#183c63]">
        {/* Angled orange chevron ends */}
        <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-4 bg-[#f36b21] [clip-path:polygon(0_0,100%_0,0_100%)]" />
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-4 bg-[#f36b21] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-600/50">
            {/* Pillar 1 */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1">
              <span className="text-2xl sm:text-3xl text-[#f36b21] shrink-0 font-bold">▤</span>
              <div className="leading-tight">
                <strong className="block text-xs sm:text-sm font-bold text-white">International<br className="hidden sm:block" /> Sourcing</strong>
                <span className="text-[10px] sm:text-[11px] text-[#c8d5e2] block mt-0.5">Reliable supply network</span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1">
              <span className="text-2xl sm:text-3xl text-[#f36b21] shrink-0">📦</span>
              <div className="leading-tight">
                <strong className="block text-xs sm:text-sm font-bold text-white">Wholesale<br className="hidden sm:block" /> Supply</strong>
                <span className="text-[10px] sm:text-[11px] text-[#c8d5e2] block mt-0.5">Bulk orders &amp; distribution</span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1 pt-3 lg:pt-1">
              <span className="text-2xl sm:text-3xl text-[#f36b21] shrink-0">🚢</span>
              <div className="leading-tight">
                <strong className="block text-xs sm:text-sm font-bold text-white">Import &amp;<br className="hidden sm:block" /> Export</strong>
                <span className="text-[10px] sm:text-[11px] text-[#c8d5e2] block mt-0.5">Global trade solutions</span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="flex items-center gap-3.5 px-2 sm:px-4 py-1 pt-3 lg:pt-1">
              <span className="text-2xl sm:text-3xl text-[#f36b21] shrink-0">🚚</span>
              <div className="leading-tight">
                <strong className="block text-xs sm:text-sm font-bold text-white">Logistics<br className="hidden sm:block" /> Support</strong>
                <span className="text-[10px] sm:text-[11px] text-[#c8d5e2] block mt-0.5">On-time &amp; secure delivery</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. "FIND THE RIGHT PART" SEARCH BAND & INTERACTIVE SEARCH
      ========================================================================= */}
      <section id="search" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-[#edf3f9] rounded-2xl p-4 sm:p-6 lg:p-7 border border-[#d6e2ee] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Left title */}
            <div className="md:col-span-4 lg:col-span-5">
              <h2 className="text-xl sm:text-2xl font-black text-[#102b4c] tracking-tight">
                Find the Right Part
              </h2>
              <p className="text-xs sm:text-sm text-[#44556c] mt-0.5 font-medium">
                Search by Part Number, OEM or Product Name
              </p>
            </div>

            {/* Right search input */}
            <div className="md:col-span-8 lg:col-span-7">
              <form onSubmit={handleSearchSubmit} className="flex bg-white rounded-xl border border-[#aebdce] shadow-xs overflow-hidden">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Enter Part Number / OEM / Product Name..."
                    className="w-full text-xs sm:text-sm text-[#102b4c] pl-10 pr-9 py-3 sm:py-3.5 bg-transparent border-0 outline-none focus:ring-0 placeholder:text-slate-400"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 text-slate-400 hover:text-[#102b4c] p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-3 sm:py-3.5 transition-colors cursor-pointer shrink-0"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Live Search Results (Only shown when user actively searches) */}
        {searchQuery.trim() && (
          <div className="mt-6 space-y-4 animate-in fade-in duration-300">
            {/* Results Header / Stats */}
            <div className="bg-blue-50/90 border border-blue-200 text-blue-900 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[#102b4c]">Search Results:</span>
                <span>Found <strong>{total}</strong> parts matching &quot;{searchQuery}&quot; (Showing {showStart}–{showEnd})</span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* View Mode Toggle: Grid vs Table */}
                <div className="inline-flex rounded-lg border border-blue-200 bg-white p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'grid'
                        ? 'bg-[#102b4c] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-[#102b4c]'
                      }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Diagrams</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${viewMode === 'table'
                        ? 'bg-[#102b4c] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-[#102b4c]'
                      }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Table</span>
                  </button>
                </div>

                {/* Per page selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                    className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-[#102b4c] cursor-pointer"
                  >
                    <option value={12}>12</option>
                    <option value={24}>24</option>
                    <option value={48}>48</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-[#f36b21] hover:underline font-bold text-xs cursor-pointer ml-1"
                >
                  Clear Search
                </button>
              </div>
            </div>

            {/* Results Body: Diagrams Grid or Table */}
            {pageItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
                No spare parts matched &quot;{searchQuery}&quot;. Try searching another part number or explore categories below.
              </div>
            ) : viewMode === 'grid' ? (
              /* ================= DIAGRAM CARD GRID VIEW (MATCHES SCREENSHOT) ================= */
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
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${p.brand === 'Bajaj'
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
                              onClick={(e) => {
                                e.stopPropagation();
                                addItem({
                                  partNumber: p.partNo,
                                  name: p.desc,
                                  grade: 'OEM Genuine',
                                  moq: parseInt(p.qty, 10) || 1
                                }, 1);
                                showToast(`Added ${p.partNo} to RFQ Basket`);
                              }}
                              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${inCartQty > 0
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="bg-[#102b4c] text-white text-xs uppercase tracking-wider font-bold">
                        <th className="py-3 px-3">Diagram</th>
                        <th className="py-3 px-4">Model</th>
                        <th className="py-3 px-4">Figure / Assembly</th>
                        <th className="py-3 px-4">OEM Part No.</th>
                        <th className="py-3 px-4">Description</th>
                        <th className="py-3 px-3 text-center">Std Qty</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {pageItems.map((p) => {
                        const inCartQty = cartMap.get(p.partNo.toLowerCase()) || 0;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
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
                                  className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md border ${p.brand === 'Bajaj'
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
                              <div className="text-xs font-bold text-[#102b4c]">{p.fig}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-[170px]" title={p.category}>
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
                                  className="text-slate-400 hover:text-[#102b4c] p-0.5 cursor-pointer"
                                  title="Copy Part Number"
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
                                onClick={() => {
                                  addItem({
                                    partNumber: p.partNo,
                                    name: p.desc,
                                    grade: 'OEM Genuine',
                                    moq: parseInt(p.qty, 10) || 1
                                  }, 1);
                                  showToast(`Added ${p.partNo} to RFQ Basket`);
                                }}
                                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${inCartQty > 0
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

            {/* Pagination controls */}
            <div className="bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="text-slate-600">
                Showing <strong>{showStart}–{showEnd}</strong> of <strong>{total}</strong> parts
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#102b4c] font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-[#102b4c] font-semibold hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          4. "AUTOMOTIVE SPARE PARTS CATEGORIES" (6 PHOTO CARDS)
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Section Title */}
        <div className="text-center mb-8">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#102b4c] mb-1.5">
            OUR PRODUCT RANGE
          </div>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <span className="h-[2px] w-12 sm:w-16 bg-[#f36b21]" />
            <h2 className="text-2xl sm:text-3xl font-black text-[#102b4c] tracking-tight">
              Automotive Spare Parts Categories
            </h2>
            <span className="h-[2px] w-12 sm:w-16 bg-[#f36b21]" />
          </div>
        </div>

        {/* 6 Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">

          {/* Card 1: Automotive Parts */}
          <Link
            href="/products?category=automotive"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/automotive.jpg"
                alt="Automotive Parts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                🚘
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Automotive Parts
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Passenger vehicle components
              </p>
            </div>
          </Link>

          {/* Card 2: Commercial Vehicle Parts */}
          <Link
            href="/products?category=commercial"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/commercial.jpg"
                alt="Commercial Vehicle Parts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                🚚
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Commercial Vehicle Parts
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Heavy-duty vehicle components
              </p>
            </div>
          </Link>

          {/* Card 3: Motorcycle Parts */}
          <Link
            href="/products?category=motorcycle"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/motorcycle.jpg"
                alt="Motorcycle Parts"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                🏍
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Motorcycle Parts
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Two-wheeler components
              </p>
            </div>
          </Link>

          {/* Card 4: Engine Components */}
          <Link
            href="/products?category=engine"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/engine.jpg"
                alt="Engine Components"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                ⚙
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Engine Components
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Engine &amp; mechanical spare parts
              </p>
            </div>
          </Link>

          {/* Card 5: Brake System */}
          <Link
            href="/products?category=brake"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/brake.jpg"
                alt="Brake System"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                ◉
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Brake System
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Brake pads, discs and related parts
              </p>
            </div>
          </Link>

          {/* Card 6: Suspension & Steering */}
          <Link
            href="/products?category=suspension"
            className="group bg-white rounded-2xl overflow-hidden border border-[#e1e7ee] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
          >
            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-slate-100">
              <img
                src="/images/categories/suspension.jpg"
                alt="Suspension & Steering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-3 text-center flex-1 flex flex-col items-center">
              <span className="w-8 h-8 rounded-full bg-white border border-[#f3d8c6] text-[#f36b21] -mt-7 shadow-md flex items-center justify-center text-sm font-bold z-10">
                🔧
              </span>
              <h3 className="text-xs sm:text-sm font-black text-[#102b4c] mt-2 mb-1 group-hover:text-[#f36b21] transition-colors leading-tight">
                Suspension &amp; Steering
              </h3>
              <p className="text-[10px] sm:text-[11px] text-[#627188] leading-tight">
                Shocks, struts, control arms &amp; more
              </p>
            </div>
          </Link>

        </div>
      </section>

      {/* =========================================================================
          5. "WE SUPPLY LEADING AUTOMOTIVE BRANDS" (ONLY CATALOGUE BRANDS)
      ========================================================================= */}
      <section className="bg-[#f3f6fa] py-10 sm:py-14 border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Title */}
          <div className="text-center mb-8">
            <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#102b4c] mb-1.5">
              BRANDS &amp; MANUFACTURERS
            </div>
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <span className="h-[2px] w-12 sm:w-16 bg-[#f36b21]" />
              <h2 className="text-2xl sm:text-3xl font-black text-[#102b4c] tracking-tight">
                We Supply Leading Automotive Brands
              </h2>
              <span className="h-[2px] w-12 sm:w-16 bg-[#f36b21]" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-xl mx-auto mt-2">
              Official catalogue spare parts coverage for premier Indian two-wheeler &amp; three-wheeler manufacturers
            </p>
          </div>

          {/* Catalogue Brands Grid (5 Verified Brands with Real Parts Data) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-6xl mx-auto">

            {/* 1. Suzuki */}
            <Link
              href="/brands?brand=suzuki#catalogue"
              className="group bg-white rounded-2xl border border-[#e1e6ed] p-4 text-center shadow-xs hover:shadow-md hover:border-[#0a3e91] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 100 80" className="h-6 w-auto shrink-0" fill="none">
                  <path d="M22 6 L88 6 L70 30 L36 30 L24 46 L78 46 L60 70 L10 70 L28 46 L27 46 L40 30 Z" fill="#E60012" />
                </svg>
                <span className="text-lg font-black tracking-wider text-[#002E6D] group-hover:text-[#E60012] transition-colors">
                  SUZUKI
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-[#002E6D]/10 group-hover:text-[#002E6D] px-2.5 py-0.5 rounded-full transition-colors">
                9 Models • 10,950+ Parts
              </div>
            </Link>

            {/* 2. Bajaj */}
            <Link
              href="/brands?brand=bajaj#catalogue"
              className="group bg-white rounded-2xl border border-[#e1e6ed] p-4 text-center shadow-xs hover:shadow-md hover:border-[#00539F] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 100 80" className="h-6 w-auto shrink-0" fill="none">
                  <path d="M15 15 L48 15 C62 15 72 23 72 35 C72 44 65 50 54 53 C68 56 76 64 76 75 C76 87 64 95 48 95 L15 95 Z M32 30 L32 45 L46 45 C52 45 56 42 56 37 C56 33 52 30 46 30 Z M32 58 L32 78 L48 78 C55 78 60 74 60 68 C60 62 55 58 48 58 Z" fill="#00539F" />
                </svg>
                <span className="text-lg font-black tracking-wider text-[#00539F] group-hover:text-[#003970] transition-colors">
                  BAJAJ
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-[#00539F]/10 group-hover:text-[#00539F] px-2.5 py-0.5 rounded-full transition-colors">
                2 Models • 2,318+ Parts
              </div>
            </Link>

            {/* 3. Aprilia */}
            <Link
              href="/brands?brand=aprilia#catalogue"
              className="group bg-white rounded-2xl border border-[#e1e6ed] p-4 text-center shadow-xs hover:shadow-md hover:border-[#D31145] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block bg-[#D31145] text-white font-black italic tracking-tight text-sm px-2 py-0.5 rounded shadow-2xs group-hover:scale-105 transition-transform">
                  racing
                </span>
                <span className="text-lg font-black tracking-tight text-[#D31145] italic lowercase">
                  aprilia
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-[#D31145]/10 group-hover:text-[#D31145] px-2.5 py-0.5 rounded-full transition-colors">
                5 Models • 3,924+ Parts
              </div>
            </Link>

            {/* 4. Vespa */}
            <Link
              href="/brands?brand=vespa#catalogue"
              className="group bg-white rounded-2xl border border-[#e1e6ed] p-4 text-center shadow-xs hover:shadow-md hover:border-[#00875A] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black italic tracking-tight text-[#00875A] font-serif group-hover:scale-105 transition-transform">
                  Vespa
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-[#00875A]/10 group-hover:text-[#00875A] px-2.5 py-0.5 rounded-full transition-colors">
                2 Models • 1,781+ Parts
              </div>
            </Link>

            {/* 5. Yamaha */}
            <Link
              href="/brands?brand=yamaha#catalogue"
              className="group bg-white rounded-2xl border border-[#e1e6ed] p-4 text-center shadow-xs hover:shadow-md hover:border-[#E60012] hover:-translate-y-0.5 transition-all flex flex-col items-center justify-center gap-2 min-h-[96px]"
            >
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 100 100" className="h-6 w-auto shrink-0" fill="none">
                  <circle cx="50" cy="50" r="45" stroke="#E60012" strokeWidth="7" fill="none" />
                  <path d="M50 16 L50 50 M25 68 L50 50 M75 68 L50 50" stroke="#E60012" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="8" fill="#E60012" />
                </svg>
                <span className="text-lg font-black tracking-wider text-[#E60012] group-hover:text-[#b8000e] transition-colors">
                  YAMAHA
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 bg-slate-100 group-hover:bg-[#E60012]/10 group-hover:text-[#E60012] px-2.5 py-0.5 rounded-full transition-colors">
                1 Model • 707+ Parts
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. GLOBAL TRADE & SUPPLY ("FROM SOURCE TO GLOBAL MARKETS")
      ========================================================================= */}
      <section className="bg-[#102b4c] text-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[290px]">
          {/* Left: Port cargo terminal photo */}
          <div className="lg:col-span-5 min-h-[240px] lg:min-h-[300px] relative overflow-hidden bg-navy-950">
            <img
              src="/images/global-export-port-logistics.jpeg"
              alt="International cargo port and logistics"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#102b4c]/80 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Right: Navy Content Box */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-[#102b4c] to-[#09213b]">
            <div className="text-[11px] font-bold tracking-[3px] uppercase text-[#d8e6f4] mb-2">
              GLOBAL TRADE &amp; SUPPLY
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              From Source to Global Markets
            </h2>
            <p className="text-xs sm:text-sm text-[#dce7f3] leading-relaxed max-w-xl mb-6">
              We connect quality automotive parts manufacturers with international buyers through reliable import-export, sourcing and distribution solutions.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold text-white">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#f36b21]">🌐</span>
                <span>Global Sourcing</span>
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#f36b21]">📦</span>
                <span>Bulk Supply</span>
              </span>
              <span className="hidden sm:inline text-slate-500">|</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#f36b21]">🚢</span>
                <span>Export &amp; Distribution</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. "WHY CHOOSE HASTINA MOTOR PARTS?"
      ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <div className="text-xs font-black tracking-[3px] uppercase text-[#102b4c]">
            WHY CHOOSE HASTINA MOTOR PARTS?
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          {/* Item 1 */}
          <div className="bg-[#f4f7fb] rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-100 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">♧</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Quality Assured Parts
            </strong>
          </div>

          {/* Item 2 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-200/80 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">▣</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Wide Product Range
            </strong>
          </div>

          {/* Item 3 */}
          <div className="bg-[#f4f7fb] rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-100 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">🤝</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Trusted Trade Partner
            </strong>
          </div>

          {/* Item 4 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-200/80 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">◎</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Global Supply Network
            </strong>
          </div>

          {/* Item 5 */}
          <div className="bg-[#f4f7fb] rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-100 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">🚚</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Reliable Logistics
            </strong>
          </div>

          {/* Item 6 */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center justify-center border border-slate-200/80 hover:shadow-md transition-shadow">
            <span className="text-3xl text-[#f36b21] mb-2 font-bold">☏</span>
            <strong className="text-xs sm:text-sm font-bold text-[#102b4c] leading-tight">
              Responsive Support
            </strong>
          </div>

        </div>
      </section>

      {/* =========================================================================
          8. CTA BANNER ("LOOKING FOR AUTOMOTIVE SPARE PARTS IN BULK?")
      ========================================================================= */}
      <section className="bg-gradient-to-r from-[#f36b21] to-[#f58a26] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center md:text-left">
              <span className="hidden sm:inline-block text-5xl opacity-80 shrink-0">
                📦
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Looking for Automotive Spare Parts in Bulk?
                </h2>
                <p className="text-xs sm:text-sm text-[#fff6ed] mt-1 font-medium">
                  Get a competitive quotation for your import, export or wholesale requirements.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-[#102b4c] text-[#102b4c] hover:text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              <ClipboardList className="w-4 h-4 text-[#f36b21]" />
              <span>Request a Quote →</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. REQUEST A QUOTATION MODAL
      ========================================================================= */}
      {isQuoteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#041120]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsQuoteModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden p-6 sm:p-8 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#102b4c]">Request a Quotation</h2>
                <p className="text-xs text-slate-500 mt-0.5">Submit your automotive spare parts requirement</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-[#102b4c] flex items-center justify-center cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuoteFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    placeholder="Company or Dealership"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    required
                    type="email"
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    required
                    type="text"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="Country code + number"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={quoteForm.country}
                    onChange={(e) => setQuoteForm({ ...quoteForm, country: e.target.value })}
                    placeholder="Destination Country"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Requirement Type</label>
                  <select
                    value={quoteForm.type}
                    onChange={(e) => setQuoteForm({ ...quoteForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21] cursor-pointer"
                  >
                    <option>Import / Export</option>
                    <option>Wholesale Supply</option>
                    <option>Parts Sourcing</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parts / Product Requirements *</label>
                <textarea
                  required
                  rows={4}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  placeholder="Part numbers, vehicle models, quantities or requirements..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#f36b21] resize-none"
                />
              </div>

              {quoteSubmitted && (
                <div className="bg-[#e8f7ee] text-[#17653b] p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your quotation enquiry has been submitted successfully.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={quoteSubmitted}
                className="w-full bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                Submit Enquiry →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          10. RFQ BASKET SLIDE-OUT DRAWER
      ========================================================================= */}
      {isRfqDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#041120]/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
          onClick={() => setIsRfqDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#102b4c] text-white px-5 py-4 flex items-center justify-between border-b border-[#183c63]">
              <div className="flex items-center gap-2.5">
                <ClipboardList className="w-5 h-5 text-[#f36b21]" />
                <div>
                  <h3 className="text-sm font-black">RFQ Quotation Basket</h3>
                  <span className="text-[11px] text-slate-300">{items.length} parts ({totalCount} pcs)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRfqDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <span className="text-4xl block mb-2 opacity-50">🛒</span>
                  <div className="text-sm font-bold text-[#102b4c]">Your RFQ Basket is empty</div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Search parts by part number or browse categories, then click &quot;+ Add RFQ&quot; to build your quotation list.
                  </p>
                </div>
              ) : (
                items.map((it) => (
                  <div key={it.partNumber} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <code className="font-mono text-xs font-bold text-[#102b4c] bg-white px-2 py-0.5 rounded border border-slate-200">
                          {it.partNumber}
                        </code>
                        <div className="text-xs font-bold text-slate-800 mt-1">{it.name}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(it.partNumber)}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Qty:</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.partNumber, Math.max(1, it.quantity - 1))}
                          className="w-6 h-6 rounded bg-white border border-slate-300 font-bold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                        >
                          -
                        </button>
                        <span className="font-bold text-[#102b4c] font-mono px-1">{it.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(it.partNumber, it.quantity + 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-300 font-bold flex items-center justify-center cursor-pointer hover:bg-slate-100"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyText(it.partNumber, `Copied ${it.partNumber}`)}
                        className="text-[11px] text-slate-500 hover:text-[#102b4c] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3 text-[#f36b21]" />
                        <span>Copy Code</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => copyText(formatRfqText(), 'Copied RFQ Basket')}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-[#102b4c] border border-slate-300 py-2.5 rounded-xl cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#f36b21]" />
                  <span>Copy List</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadRfqCsv}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-white hover:bg-slate-100 text-[#102b4c] border border-slate-300 py-2.5 rounded-xl cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#f36b21]" />
                  <span>Download CSV</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setQuoteForm((prev) => ({
                    ...prev,
                    message: prev.message ? `${prev.message}\n\n${formatRfqText()}` : formatRfqText()
                  }));
                  setIsRfqDrawerOpen(false);
                  setIsQuoteModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Submit RFQ Quotation Request</span>
              </button>

              <button
                type="button"
                onClick={clearEnquiry}
                className="w-full text-xs font-semibold text-slate-500 hover:text-red-600 py-1 cursor-pointer"
              >
                Clear Basket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DIAGRAM ZOOM & LIGHTBOX MODAL
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
                <span className="text-xs font-mono font-bold text-slate-200 px-1">
                  {Math.round(zoomLevel * 100)}%
                </span>
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
                  className="text-[11px] font-semibold px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDiagramPart(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-white cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Zoomable Image */}
            <div className="relative flex-1 bg-slate-50 p-6 overflow-auto min-h-[320px] max-h-[60vh] flex items-center justify-center">
              {selectedDiagramPart.img ? (
                <div
                  className="transition-transform duration-150 origin-center select-none"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={selectedDiagramPart.img}
                    alt={selectedDiagramPart.desc}
                    className="max-h-[500px] w-auto object-contain mx-auto shadow-sm rounded-lg bg-white p-2"
                  />
                </div>
              ) : (
                <div className="text-slate-400 text-center py-12">
                  No technical schematic available for this part.
                </div>
              )}
            </div>

            {/* Modal Footer: Part Info + Actions */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-[#102b4c] bg-white px-2.5 py-0.5 rounded border border-slate-300">
                    {selectedDiagramPart.partNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyText(selectedDiagramPart.partNo, `Copied ${selectedDiagramPart.partNo}`)}
                    className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                    title="Copy Part Number"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  {selectedDiagramPart.desc}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      partNumber: selectedDiagramPart.partNo,
                      name: selectedDiagramPart.desc,
                      grade: 'OEM Genuine',
                      moq: parseInt(selectedDiagramPart.qty, 10) || 1
                    }, 1);
                    showToast(`Added ${selectedDiagramPart.partNo} to RFQ Basket`);
                  }}
                  className="inline-flex items-center gap-2 bg-[#f36b21] hover:bg-[#db5b12] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to RFQ Basket</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDiagramPart(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
