'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  Bike,
  ClipboardList,
  FileSpreadsheet,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Users,
  Globe,
  Lock
} from 'lucide-react';
import { AdminAuthProvider, useAdminAuth, UserRole } from '@/lib/adminAuthContext';

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isSuperAdmin, isManager, isEditor, switchRoleQuick, canAccess } = useAdminAuth();

  const allNavLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { href: '/admin/parts', label: 'Catalogue Parts', icon: Package, module: 'parts' },
    { href: '/admin/brands', label: 'Brands & Models', icon: Bike, module: 'brands' },
    { href: '/admin/categories', label: '3-Level Categories', icon: Layers, module: 'categories' },
    { href: '/admin/enquiries', label: 'Enquiries & RFQs', icon: ClipboardList, module: 'enquiries' },
    { href: '/admin/import', label: 'Excel Import / Export', icon: FileSpreadsheet, module: 'import' },
    { href: '/admin/analytics', label: 'Search Analytics', icon: BarChart3, module: 'analytics' },
    { href: '/admin/users', label: 'Team & Role IDs', icon: Users, module: 'users' },
    { href: '/admin/settings', label: 'Site Settings', icon: Settings, module: 'settings' },
  ];

  // Filter links visible to the current role
  const visibleLinks = allNavLinks.filter((link) => {
    if (isSuperAdmin) return true;
    if (isManager) {
      return ['dashboard', 'parts', 'brands', 'categories', 'enquiries', 'import', 'analytics'].includes(link.module);
    }
    if (isEditor) {
      return ['dashboard', 'parts', 'brands', 'categories'].includes(link.module);
    }
    return false;
  });

  // Check if current route is restricted for current role
  const isRestrictedForEditor = isEditor && ['/admin/enquiries', '/admin/import', '/admin/analytics', '/admin/settings', '/admin/users'].some((p) => pathname.startsWith(p));
  const isRestrictedForManager = isManager && ['/admin/settings', '/admin/users'].some((p) => pathname.startsWith(p));
  const isRestricted = isRestrictedForEditor || isRestrictedForManager;

  const currentRole = user?.role || 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#081b30] text-slate-300 flex flex-col justify-between shrink-0 border-e border-[#142e4e] select-none">
        <div>
          {/* Logo / Header */}
          <div className="p-4 border-b border-[#142e4e] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-md p-1 shrink-0 border border-slate-700">
              <img
                src="/hastina-icon.svg"
                alt="Hastina Motor Parts"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="font-black text-white text-sm block tracking-tight">HASTINA PORTAL</span>
              <span className="text-[10px] text-[#f36b21] block uppercase font-bold tracking-wider">
                Alisons General Trading
              </span>
            </div>
          </div>

          {/* Active Subdomain Badge */}
          <div className="px-4 py-2.5 bg-[#051323] border-b border-[#142e4e] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-[10px] truncate">
                {currentRole === 'SUPER_ADMIN' && 'admin.hastinamotorparts.in'}
                {currentRole === 'MANAGER' && 'manager.hastinamotorparts.in'}
                {currentRole === 'EDITOR' && 'editor.hastinamotorparts.in'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Hostinger DNS Active" />
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#f36b21] text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Role Switcher */}
        <div className="p-3 border-t border-[#142e4e] space-y-2.5">
          {/* User Profile Card */}
          <div className="bg-[#0b2440] rounded-xl p-3 border border-[#1b3d64] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white block truncate">{user?.name || 'Administrator'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                currentRole === 'SUPER_ADMIN'
                  ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                  : currentRole === 'MANAGER'
                  ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                  : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
              }`}>
                {currentRole === 'SUPER_ADMIN' && '👑 SUPER ADMIN'}
                {currentRole === 'MANAGER' && '💼 MANAGER'}
                {currentRole === 'EDITOR' && '✍️ EDITOR'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentRole === 'SUPER_ADMIN' ? 'All Access' : currentRole === 'MANAGER' ? 'Ops/Sales' : 'Catalogue'}
              </span>
            </div>
          </div>

          {/* Quick Role Switcher (For testing permissions) */}
          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Switch Test Role:
            </span>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => switchRoleQuick('SUPER_ADMIN')}
                className={`py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                  currentRole === 'SUPER_ADMIN'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#0f2d50] text-slate-400 hover:text-white'
                }`}
                title="Super Admin: Full Access to all settings & team"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => switchRoleQuick('MANAGER')}
                className={`py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                  currentRole === 'MANAGER'
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#0f2d50] text-slate-400 hover:text-white'
                }`}
                title="Manager: Catalogue + RFQs + Analytics"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => switchRoleQuick('EDITOR')}
                className={`py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                  currentRole === 'EDITOR'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0f2d50] text-slate-400 hover:text-white'
                }`}
                title="Editor: Only edit parts & categories"
              >
                Editor
              </button>
            </div>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold py-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-[#102b4c] font-black uppercase">ALISONS GENERAL TRADING LLP</span>
            <span>•</span>
            <span className="text-slate-500">Hastina Motor Parts Global Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Subdomain pill */}
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>Hostinger: hastinamotorparts.in</span>
            </span>

            <Link
              href="/"
              className="text-xs font-bold text-slate-700 hover:text-[#f36b21] flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 hover:border-[#f36b21] transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>RBAC Protected</span>
            </span>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {isRestricted ? (
            <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-amber-200 p-8 shadow-sm text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center border border-amber-200">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-[#102b4c]">Restricted Section</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your current role (<strong>{currentRole}</strong>) does not have permission to view or modify this module.
                {isRestrictedForEditor && ' Content Editors can only view and update parts catalogue, brands, and categories.'}
                {isRestrictedForManager && ' Only Super Administrators can manage team accounts and root site settings.'}
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <Link
                  href="/admin/parts"
                  className="px-4 py-2 bg-[#102b4c] text-white rounded-xl text-xs font-bold hover:bg-[#f36b21] transition-colors"
                >
                  Go to Catalogue Parts
                </Link>
                <button
                  type="button"
                  onClick={() => switchRoleQuick('SUPER_ADMIN')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  Switch to Super Admin
                </button>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
