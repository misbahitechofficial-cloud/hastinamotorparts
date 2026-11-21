'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Grid, ArrowRight, ShieldCheck, ChevronDown } from 'lucide-react';
import { api } from '@/lib/api';

export default function MegaMenu({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [tree, setTree] = useState<any[]>([]);
  const [activeL1, setActiveL1] = useState<any | null>(null);
  const [activeL2, setActiveL2] = useState<any | null>(null);

  useEffect(() => {
    api.getCategoryTree()
      .then((res) => {
        if (res.success && res.tree.length > 0) {
          setTree(res.tree);
          setActiveL1(res.tree[0]);
          if (res.tree[0].children && res.tree[0].children.length > 0) {
            setActiveL2(res.tree[0].children[0]);
          }
        }
      })
      .catch(console.error);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full start-0 end-0 bg-white border-b border-slate-200 shadow-floating z-40 animate-fade-in"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 py-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Grid className="w-4 h-4 text-brand-600" />
            <span>Spare Parts Catalogue by Category & Sub-Assembly</span>
          </div>
          <Link
            href="/parts"
            onClick={onClose}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Browse All Catalogue Parts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-8 min-h-[380px]">
          {/* Column 1: Level 1 Categories */}
          <div className="col-span-4 border-e border-slate-100 pe-4 max-h-[460px] overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Primary System (Level 1)
            </div>
            {tree.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onMouseEnter={() => {
                  setActiveL1(cat);
                  setActiveL2(cat.children?.[0] || null);
                }}
                className={`w-full text-start px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-between group ${
                  activeL1?.id === cat.id
                    ? 'bg-navy-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${activeL1?.id === cat.id ? 'bg-brand-500' : 'bg-slate-300'}`} />
                  <span>{cat.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeL1?.id === cat.id ? 'translate-x-1 text-brand-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
              </button>
            ))}
          </div>

          {/* Column 2: Level 2 Subcategories */}
          <div className="col-span-4 border-e border-slate-100 pe-4 max-h-[460px] overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
              <span>Sub-Assemblies (Level 2)</span>
              {activeL1 && (
                <Link
                  href={`/parts?category=${activeL1.slug}`}
                  onClick={onClose}
                  className="text-brand-600 hover:underline normal-case text-xs"
                >
                  View All {activeL1.name} →
                </Link>
              )}
            </div>

            {activeL1?.children && activeL1.children.length > 0 ? (
              activeL1.children.map((sub: any) => (
                <button
                  key={sub.id}
                  type="button"
                  onMouseEnter={() => setActiveL2(sub)}
                  className={`w-full text-start px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-between group ${
                    activeL2?.id === sub.id
                      ? 'bg-brand-50 text-brand-900 font-bold border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{sub.name}</span>
                  <ChevronRight className={`w-4 h-4 ${activeL2?.id === sub.id ? 'text-brand-600' : 'text-slate-300'}`} />
                </button>
              ))
            ) : (
              <div className="p-4 text-xs text-slate-400 italic">
                Direct parts available under this category.
              </div>
            )}
          </div>

          {/* Column 3: Level 3 Part Types / Quick Jump */}
          <div className="col-span-4 max-h-[460px] overflow-y-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Specific Part Types (Level 3)
            </div>

            {activeL2?.children && activeL2.children.length > 0 ? (
              <div className="space-y-1.5">
                {activeL2.children.map((pt: any) => (
                  <Link
                    key={pt.id}
                    href={`/parts?category=${pt.slug}`}
                    onClick={onClose}
                    className="block p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-xs font-semibold text-slate-700 hover:text-brand-600 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span>{pt.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Filter →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-200">
                <ShieldCheck className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-navy-900 mb-1">
                  {activeL2?.name || activeL1?.name}
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  Explore certified genuine and quality aftermarket spare parts for export.
                </p>
                <Link
                  href={`/parts?category=${activeL2?.slug || activeL1?.slug || ''}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 bg-navy-900 hover:bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                >
                  <span>Browse Category Parts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
