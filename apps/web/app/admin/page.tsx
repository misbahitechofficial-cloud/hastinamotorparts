'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Package,
  Search,
  AlertTriangle,
  Globe2,
  TrendingUp,
  ArrowRight,
  FileSpreadsheet,
  Plus,
  Users,
  ShieldCheck,
  Settings
} from 'lucide-react';
import { useAdminAuth } from '@/lib/adminAuthContext';
import { CATALOGUE_DB } from '@/lib/embeddedCatalogue';

export default function AdminDashboardPage() {
  const { user, isSuperAdmin, isManager, isEditor } = useAdminAuth();

  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(false);

  useEffect(() => {
    if (!isEditor) {
      setLoadingEnquiries(true);
      fetch('/api/admin/enquiries')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.enquiries) {
            setEnquiries(data.enquiries);
          }
        })
        .catch(console.error)
        .finally(() => setLoadingEnquiries(false));
    }
  }, [isEditor]);

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'NEW').length;
  const quotedEnquiriesCount = enquiries.filter((e) => e.status === 'QUOTED').length;
  const totalPartsCount = CATALOGUE_DB.r.length;

  const currentRole = user?.role || 'SUPER_ADMIN';

  return (
    <div className="space-y-8">
      {/* 1. Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#102b4c] tracking-tight">
              Export Operations Dashboard
            </h1>
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              currentRole === 'SUPER_ADMIN'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : currentRole === 'MANAGER'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}>
              {currentRole === 'SUPER_ADMIN' && '👑 Super Admin View'}
              {currentRole === 'MANAGER' && '💼 Manager View'}
              {currentRole === 'EDITOR' && '✍️ Content Editor View'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Welcome back, <strong>{user?.name}</strong>. Everything in this catalogue and portal is fully editable.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isSuperAdmin && (
            <Link
              href="/admin/users"
              className="bg-white hover:bg-slate-50 text-[#102b4c] border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs transition-colors"
            >
              <Users className="w-4 h-4 text-purple-600" />
              <span>Team IDs</span>
            </Link>
          )}

          {!isEditor && (
            <Link
              href="/admin/import"
              className="bg-white hover:bg-slate-50 text-[#102b4c] border border-slate-200 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-2 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Excel Import / Export</span>
            </Link>
          )}

          <Link
            href="/admin/parts"
            className="bg-[#f36b21] hover:bg-[#db5b12] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Parts</span>
          </Link>
        </div>
      </div>

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Catalogue Parts (Visible to ALL) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Live Catalogue Parts
            </span>
            <span className="text-3xl font-black text-[#102b4c] font-mono">
              {totalPartsCount.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">4 verified vehicle models</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: New RFQs (Hidden from Editor) */}
        {!isEditor ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                New RFQ Inquiries
              </span>
              <span className="text-3xl font-black text-[#f36b21] font-mono">
                {newEnquiriesCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Awaiting price quotes</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#f36b21] flex items-center justify-center font-bold">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-5 flex items-center justify-between text-slate-400">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider block mb-1">
                Customer RFQ Leads
              </span>
              <span className="text-sm font-bold text-slate-500 block">Restricted</span>
              <span className="text-[10px] text-slate-400 block mt-1">Manager/Admin only</span>
            </div>
            <ShieldCheck className="w-8 h-8 opacity-40" />
          </div>
        )}

        {/* Card 3: Quoted Orders (Hidden from Editor) */}
        {!isEditor ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Quotes Sent
              </span>
              <span className="text-3xl font-black text-emerald-600 font-mono">
                {quotedEnquiriesCount}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">In customer review</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Schematic Diagrams
              </span>
              <span className="text-3xl font-black text-purple-600 font-mono">
                350
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">High-res WebP plates</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Search className="w-6 h-6" />
            </div>
          </div>
        )}

        {/* Card 4: Subdomains Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Hostinger Domain
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 block mt-1 truncate max-w-[140px]">
              hastinamotorparts.in
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">● DNS Subdomains Live</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Globe2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Role-Based Working Area */}
      {!isEditor ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inquiries List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#102b4c]" />
                <h2 className="font-bold text-base text-[#102b4c]">
                  Recent Quotation Requests
                </h2>
              </div>
              <Link href="/admin/enquiries" className="text-xs font-bold text-[#f36b21] hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#102b4c] block">{enq.customerName}</span>
                    <span className="text-[11px] text-slate-500">{enq.company} · {enq.country}</span>
                  </div>
                  <div className="text-end">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      enq.status === 'NEW'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : enq.status === 'QUOTED'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                    }`}>
                      {enq.status}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">{enq.items?.length || 0} parts requested</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base text-[#102b4c]">
                Quick Management Actions
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Link
                href="/admin/parts"
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#f36b21] hover:bg-slate-50/50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2 text-[#102b4c] font-bold text-xs">
                  <Package className="w-4 h-4 text-[#f36b21]" />
                  <span>Edit Parts</span>
                </div>
                <p className="text-[11px] text-slate-500">Add new parts or update diagrams and part numbers.</p>
              </Link>

              <Link
                href="/admin/enquiries"
                className="p-4 rounded-2xl border border-slate-200 hover:border-[#f36b21] hover:bg-slate-50/50 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 mb-2 text-[#102b4c] font-bold text-xs">
                  <ClipboardList className="w-4 h-4 text-[#f36b21]" />
                  <span>RFQ Inquiries</span>
                </div>
                <p className="text-[11px] text-slate-500">Respond to customer quotation requests and update status.</p>
              </Link>

              {isSuperAdmin && (
                <>
                  <Link
                    href="/admin/users"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#f36b21] hover:bg-slate-50/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#102b4c] font-bold text-xs">
                      <Users className="w-4 h-4 text-purple-600" />
                      <span>Team &amp; Roles</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Manage user IDs, passwords, and permissions.</p>
                  </Link>

                  <Link
                    href="/admin/settings"
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#f36b21] hover:bg-slate-50/50 transition-all flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2 mb-2 text-[#102b4c] font-bold text-xs">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span>Site Settings</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Update company phone, email, and address.</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Editor Working Area */
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center font-bold">
            <Package className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-[#102b4c]">Technical Content Editor Workspace</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            You are logged in with the <strong>EDITOR</strong> role. You have permissions to create, edit, organize, and update spare parts, exploded diagram plate numbers, and categories. Customer inquiries and billing settings are reserved for Managers and Administrators.
          </p>
          <div className="pt-2">
            <Link
              href="/admin/parts"
              className="inline-flex items-center gap-2 bg-[#f36b21] hover:bg-[#db5b12] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors shadow-xs"
            >
              <Package className="w-4 h-4" />
              <span>Go to Catalogue Parts Editor</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
