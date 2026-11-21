'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowRight, ShieldCheck, Bike, Tag } from 'lucide-react';
import { api } from '@/lib/api';

export default function SearchBar({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{
    parts: any[];
    models: any[];
    categories: any[];
  }>({ parts: [], models: [], categories: [] });

  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search autocomplete
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions({ parts: [], models: [], categories: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await api.searchSuggest(query.trim());
        if (res.success) {
          setSuggestions(res.suggestions);
          setIsOpen(true);
        }
      } catch (e) {
        console.error('Search suggestion error:', e);
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/parts?q=${encodeURIComponent(query.trim())}`);
  };

  const hasSuggestions =
    suggestions.parts.length > 0 ||
    suggestions.models.length > 0 ||
    suggestions.categories.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (hasSuggestions) setIsOpen(true);
          }}
          placeholder="Search by OEM Part No. (e.g. 36360086, 27601-33G00), Part Name or Model..."
          className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-navy-900 placeholder:text-slate-500 rounded-full py-2.5 ps-11 pe-24 text-sm font-medium border border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 focus:outline-none transition-all shadow-inner"
        />
        <div className="absolute start-3.5 text-slate-400 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
        <button
          type="submit"
          className="absolute end-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1 shadow-sm"
        >
          <span>Search</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full start-0 end-0 mt-2 bg-white rounded-2xl shadow-floating border border-slate-200 overflow-hidden z-50 divide-y divide-slate-100 animate-fade-in max-h-[80vh] overflow-y-auto">
          {hasSuggestions ? (
            <>
              {/* Parts Section */}
              {suggestions.parts.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Matching Spare Parts</span>
                  </div>
                  <div className="space-y-1 mt-1">
                    {suggestions.parts.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/part/${p.slug}`);
                        }}
                        className="w-full text-start flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <Tag className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-navy-900 group-hover:text-brand-600 transition-colors flex items-center gap-2">
                              <span>{p.name}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase border border-slate-200">
                                {p.grade}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono font-medium">
                              OEM #{p.partNumber}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Models Section */}
              {suggestions.models.length > 0 && (
                <div className="p-3 bg-slate-50/50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center gap-1.5">
                    <Bike className="w-3.5 h-3.5 text-navy-700" />
                    <span>Matching Vehicles & Models</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 mt-1">
                    {suggestions.models.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/models/${m.brandSlug}/${m.slug}`);
                        }}
                        className="text-start flex items-center justify-between p-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all group"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-500">{m.brandName}</div>
                          <div className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                            {m.name}
                          </div>
                        </div>
                        <span className="text-xs text-brand-600 font-medium">View Parts →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories Section */}
              {suggestions.categories.length > 0 && (
                <div className="p-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                    Categories
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1 px-2">
                    {suggestions.categories.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(`/parts?category=${c.slug}`);
                        }}
                        className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* View all button */}
              <div className="p-2.5 bg-slate-50 text-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1"
                >
                  <span>View all results for &quot;{query}&quot;</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-sm text-slate-600 mb-3">
                No catalogued parts found matching &quot;<span className="font-semibold text-navy-900">{query}</span>&quot;
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push(`/enquiry?quickPart=${encodeURIComponent(query)}`);
                }}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm"
              >
                <span>Request Quotation for &quot;{query}&quot;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
