'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Plus, Trash2, Edit, ChevronRight, X } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminCategoriesPage() {
  const [tree, setTree] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal create state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);

  const fetchTree = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/api/v1/categories/tree')
      .then(res => res.json())
      .then(data => {
        if (data.success) setTree(data.tree);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchTree();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/v1/categories/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify({
          name: catName,
          parentId,
          level
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setCatName('');
        fetchTree();
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (err) {
      alert('Error creating category');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            3-Level Category Tree
          </h1>
          <p className="text-xs text-slate-500">
            Powers the 3-level desktop Mega Menu and mobile navigation drawer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setParentId(null);
            setLevel(1);
            setIsModalOpen(true);
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Root Category (Level 1)</span>
        </button>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading category tree...</div>
        ) : (
          tree.map((l1) => (
            <div key={l1.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/50">
              {/* Level 1 Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-navy-900 text-white text-xs font-black flex items-center justify-center">
                    L1
                  </span>
                  <div>
                    <h3 className="font-black text-sm text-navy-900">{l1.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">slug: {l1.slug}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setParentId(l1.id);
                    setLevel(2);
                    setIsModalOpen(true);
                  }}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-navy-900 font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Add Subcategory (L2)</span>
                </button>
              </div>

              {/* Level 2 & 3 Nodes */}
              <div className="ps-6 space-y-3">
                {l1.children && l1.children.length > 0 ? (
                  l1.children.map((l2: any) => (
                    <div key={l2.id} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-brand-50 text-brand-700 text-[10px] font-bold flex items-center justify-center">
                            L2
                          </span>
                          <span className="font-bold text-xs text-navy-900">{l2.name}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setParentId(l2.id);
                            setLevel(3);
                            setIsModalOpen(true);
                          }}
                          className="text-[11px] font-bold text-brand-600 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Part Type (L3)</span>
                        </button>
                      </div>

                      {/* Level 3 chips */}
                      {l2.children && l2.children.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 ps-7">
                          {l2.children.map((l3: any) => (
                            <span
                              key={l3.id}
                              className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200"
                            >
                              L3: {l3.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic">No subcategories created yet.</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-floating">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-navy-900">
                Add Category (Level {level})
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Brake Pads & Shoes"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="bg-brand-600 text-white font-bold px-5 py-2 rounded-xl">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
