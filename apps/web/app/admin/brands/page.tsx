'use client';

import React, { useState, useEffect } from 'react';
import { Bike, Plus, Trash2, Edit, X, Check } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Brand Modal
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(['MOTORCYCLE']);

  // New Model Modal
  const [isModelModalOpen, setIsModelModalOpen] = useState(false);
  const [modelName, setModelName] = useState('');
  const [modelType, setModelType] = useState('MOTORCYCLE');
  const [yearFrom, setYearFrom] = useState(2015);

  const fetchBrands = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/api/v1/brands')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBrands(data.brands);
          if (data.brands.length > 0 && !selectedBrand) {
            handleSelectBrand(data.brands[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSelectBrand = (brand: any) => {
    setSelectedBrand(brand);
    fetch(`http://localhost:4000/api/v1/brands/${brand.slug}/models`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setModels(data.models);
      })
      .catch(console.error);
  };

  const handleCreateBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/v1/brands/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify({ name: brandName, types: vehicleTypes })
      });
      const data = await res.json();
      if (data.success) {
        setIsBrandModalOpen(false);
        setBrandName('');
        fetchBrands();
      } else {
        alert(data.error || 'Failed to create brand');
      }
    } catch (err) {
      alert('Error creating brand');
    }
  };

  const handleCreateModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    try {
      const res = await fetch('http://localhost:4000/api/v1/models/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify({
          brandId: selectedBrand.id,
          name: modelName,
          type: modelType,
          yearFrom: Number(yearFrom)
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsModelModalOpen(false);
        setModelName('');
        handleSelectBrand(selectedBrand);
      } else {
        alert(data.error || 'Failed to create model');
      }
    } catch (err) {
      alert('Error creating model');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Brands &amp; Vehicle Models
          </h1>
          <p className="text-xs text-slate-500">
            Configure vehicle brands and compatible models for the vehicle selector and fitment matrix.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBrandModalOpen(true)}
          className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Brand</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Brands List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
          <div className="p-4 bg-slate-50 font-bold text-xs text-navy-900 border-b border-slate-100 flex items-center justify-between">
            <span>Vehicle Brands ({brands.length})</span>
          </div>

          <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-100">
            {brands.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => handleSelectBrand(b)}
                className={`w-full text-start p-4 transition-colors flex items-center justify-between ${
                  selectedBrand?.id === b.id ? 'bg-brand-50/70 border-s-4 border-s-brand-600' : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-navy-900">{b.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {b.types?.join(', ')} • {b.modelsCount || 0} models
                  </div>
                </div>
                <span className="text-xs text-brand-600 font-bold">Manage →</span>
              </button>
            ))}
          </div>
        </div>

        {/* Models under Selected Brand */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-black text-base text-navy-900">
                Models for {selectedBrand?.name || 'Brand'}
              </h2>
              <span className="text-xs text-slate-400">
                {models.length} active vehicle models
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModelModalOpen(true)}
              className="bg-navy-900 hover:bg-navy-950 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Model</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {models.length > 0 ? (
              models.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-navy-900 block">{m.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {m.type} • {m.yearFrom ? `From ${m.yearFrom}` : 'All years'}
                    </span>
                  </div>
                  <span className="font-mono text-slate-500 font-semibold">
                    {m.partsCount || 0} parts
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No models added yet for this brand. Click &quot;Add Model&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-floating">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-navy-900">Add Vehicle Brand</h3>
              <button onClick={() => setIsBrandModalOpen(false)} className="text-slate-400 hover:text-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateBrand} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Royal Enfield"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsBrandModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="bg-brand-600 text-white font-bold px-5 py-2 rounded-xl">Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Model Modal */}
      {isModelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-floating">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-navy-900">Add Model for {selectedBrand?.name}</h3>
              <button onClick={() => setIsModelModalOpen(false)} className="text-slate-400 hover:text-navy-900">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateModel} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="e.g. Pulsar NS200"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Type</label>
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  >
                    <option value="MOTORCYCLE">MOTORCYCLE</option>
                    <option value="SCOOTER">SCOOTER</option>
                    <option value="TUKTUK">TUKTUK</option>
                    <option value="CAR">CAR</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-navy-900 block mb-1">Year From</label>
                  <input
                    type="number"
                    value={yearFrom}
                    onChange={(e) => setYearFrom(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold font-mono"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModelModalOpen(false)} className="px-4 py-2 font-bold text-slate-500">Cancel</button>
                <button type="submit" className="bg-brand-600 text-white font-bold px-5 py-2 rounded-xl">Save Model</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
