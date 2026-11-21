'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuthContext';

export default function AdminPartsPage() {
  const [parts, setParts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<any | null>(null);

  // Form fields
  const [partNumber, setPartNumber] = useState('');
  const [altNumbers, setAltNumbers] = useState('');
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1006);
  const [grade, setGrade] = useState<'GENUINE' | 'OES' | 'AFTERMARKET'>('GENUINE');
  const [description, setDescription] = useState('');
  const [moq, setMoq] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(1.5);

  const [categories, setCategories] = useState<any[]>([]);

  const { isEditor } = useAdminAuth();

  const fetchParts = () => {
    setIsLoading(true);
    fetch(`/api/admin/parts?q=${encodeURIComponent(query)}&limit=50`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.items) {
          setParts(data.items);
          setTotal(data.total);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchParts();
    api.getCategories().then(res => res.success && setCategories(res.categories)).catch(console.error);
  }, []);

  const handleOpenCreate = () => {
    setEditingPart(null);
    setPartNumber('');
    setAltNumbers('');
    setName('');
    setCategoryId(1006);
    setGrade('GENUINE');
    setDescription('');
    setMoq(10);
    setWeightKg(1.0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingPart(p);
    setPartNumber(p.partNumber);
    setAltNumbers(p.altNumbers?.join(', ') || '');
    setName(p.name);
    setCategoryId(p.categoryId || 1);
    setGrade(p.grade || 'GENUINE');
    setDescription(p.description || p.category || '');
    setMoq(p.moq || 1);
    setWeightKg(p.weightKg || 1);
    setIsModalOpen(true);
  };

  const handleSavePart = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      key: editingPart?.key || editingPart?.id,
      partNumber,
      name,
      fig: editingPart?.fig || 'PLATE 1',
      category: description || editingPart?.category || 'General Components',
      qty: String(moq || 1),
      refNo: editingPart?.refNo || '1',
      brand: editingPart?.brand || 'Universal',
      modelLabel: editingPart?.modelLabel || 'Export Genuine'
    };

    try {
      const url = '/api/admin/parts';
      const method = editingPart ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchParts();
      } else {
        alert(data.error || 'Failed to save part');
      }
    } catch (err) {
      alert('Network error saving part');
    }
  };

  const handleDeletePart = async (p: any) => {
    if (isEditor) {
      alert('Permission Denied: Content Editors cannot delete parts.');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${p.partNumber} - ${p.name}" from the catalogue?`)) return;
    try {
      const res = await fetch(`/api/admin/parts?key=${encodeURIComponent(p.key || p.id)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        }
      });
      const data = await res.json();
      if (data.success) {
        fetchParts();
      } else {
        alert(data.error || 'Failed to delete part');
      }
    } catch (err) {
      alert('Error deleting part');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Spare Parts Inventory ({total})
          </h1>
          <p className="text-xs text-slate-500">
            Create, edit, and organize OEM/OES components across all motorcycle and tuk-tuk models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/import"
            className="bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Import / Export Excel</span>
          </Link>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Part</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchParts()}
          placeholder="Search by Part Number, Alt Numbers, or Name..."
          className="w-full text-xs font-semibold text-navy-900 focus:outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={fetchParts}
          className="bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold px-4 py-1.5 rounded-xl shrink-0"
        >
          Search
        </button>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 text-start">Part Number</th>
                <th className="py-3 px-4 text-start">Part Name</th>
                <th className="py-3 px-4 text-start">Grade</th>
                <th className="py-3 px-4 text-start">Category</th>
                <th className="py-3 px-4 text-start">MOQ</th>
                <th className="py-3 px-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">Loading parts...</td>
                </tr>
              ) : parts.length > 0 ? (
                parts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-navy-900">
                      {p.partNumber}
                      {p.altNumbers?.length > 0 && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Alt: {p.altNumbers.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-navy-900 max-w-xs truncate">
                      {p.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {p.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.category?.name || 'Category'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {p.moq || 1} pcs
                    </td>
                    <td className="py-3.5 px-4 text-end space-x-2">
                      <Link
                        href={`/part/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-navy-900 inline-block"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 inline-block"
                        title="Edit Part"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      {!isEditor && (
                        <button
                          type="button"
                          onClick={() => handleDeletePart(p)}
                          className="p-1.5 text-slate-400 hover:text-red-600 inline-block cursor-pointer"
                          title="Delete Part"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">No parts found matching search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-floating max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-navy-900">
                {editingPart ? 'Edit Spare Part' : 'Add New Spare Part'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePart} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Primary OEM / OES Part Number *</label>
                <input
                  type="text"
                  required
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="e.g. 36360086"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Alternative Numbers / Cross References (comma separated)</label>
                <input
                  type="text"
                  value={altNumbers}
                  onChange={(e) => setAltNumbers(e.target.value)}
                  placeholder="e.g. DH101048, 36DH4001"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Part Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cylinder Block Kit with Piston & Rings"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Grade Standard</label>
                  <select
                    value={grade}
                    onChange={(e: any) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="GENUINE">GENUINE (OEM)</option>
                    <option value="OES">OES (Tier-1)</option>
                    <option value="AFTERMARKET">AFTERMARKET</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-navy-900 block mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (L{c.level})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Minimum Order Qty (MOQ)</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical details, material, application..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2 rounded-xl shadow-sm"
                >
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
