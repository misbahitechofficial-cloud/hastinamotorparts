'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Bike, ChevronRight, Check, ArrowLeft, Car, RefreshCw } from 'lucide-react';
import { useVehicle } from '@/lib/vehicleContext';
import { api } from '@/lib/api';

const VEHICLE_TYPES = [
  { id: 'SCOOTER', label: 'Scooter', icon: '🛵', desc: 'Suzuki Access, Burgman, Avenis, Vespa, Aprilia, Yamaha Ray' },
  { id: 'MOTORCYCLE', label: 'Motorcycle', icon: '🏍️', desc: 'Suzuki Gixxer, V-Strom, Bajaj Boxer 150, Honda GL150' },
  { id: 'TUKTUK', label: 'Tuk Tuk / 3-Wheeler', icon: '🛺', desc: 'Bajaj RE 4-Stroke Auto-Rickshaw' },
];

export default function VehicleSelectorModal() {
  const router = useRouter();
  const { isSelectorOpen, closeSelector, selectedVehicle, setVehicle, clearVehicle } = useVehicle();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedType, setSelectedType] = useState<'MOTORCYCLE' | 'SCOOTER' | 'TUKTUK' | 'CAR'>('MOTORCYCLE');
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<any | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch brands whenever selectedType changes
  useEffect(() => {
    if (isSelectorOpen) {
      setIsLoading(true);
      api.getBrands(selectedType)
        .then((res) => {
          if (res.success) setBrands(res.brands);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [selectedType, isSelectorOpen]);

  // Fetch models whenever selectedBrand changes
  useEffect(() => {
    if (selectedBrand) {
      setIsLoading(true);
      api.getBrandModels(selectedBrand.slug, selectedType)
        .then((res) => {
          if (res.success) setModels(res.models);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [selectedBrand, selectedType]);

  if (!isSelectorOpen) return null;

  const handleSelectType = (type: any) => {
    setSelectedType(type);
    setSelectedBrand(null);
    setSelectedModel(null);
    setStep(2);
  };

  const handleSelectBrand = (brand: any) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setStep(3);
  };

  const handleSelectModel = (model: any) => {
    setSelectedModel(model);
    setStep(4);
  };

  const handleFinish = (year?: number) => {
    if (!selectedBrand || !selectedModel) return;

    setVehicle({
      type: selectedType,
      brandId: selectedBrand.id,
      brandName: selectedBrand.name,
      brandSlug: selectedBrand.slug,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      modelSlug: selectedModel.slug,
      year: year || selectedYear
    });

    closeSelector();
    // Redirect to filtered parts page
    router.push(`/parts?brand=${selectedBrand.slug}&model=${selectedModel.slug}`);
  };

  const currentYears = Array.from({ length: 15 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-floating border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-navy-900 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-navy-900">Select Vehicle</h2>
              <p className="text-xs text-slate-500">
                Step {step} of 4: {step === 1 ? 'Vehicle Type' : step === 2 ? 'Brand' : step === 3 ? 'Model' : 'Year / Variant'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeSelector}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-navy-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div
            className="bg-brand-600 h-1 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: VEHICLE TYPE */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Choose vehicle category:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VEHICLE_TYPES.map((vt) => (
                  <button
                    key={vt.id}
                    type="button"
                    onClick={() => handleSelectType(vt.id)}
                    className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between h-32 group ${
                      selectedType === vt.id
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{vt.icon}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-900 group-hover:text-brand-600 transition-colors">
                        {vt.label}
                      </h3>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{vt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: BRAND */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Brand ({selectedType}):
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBrand(b)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50/40 text-center transition-all group flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-navy-900 text-lg group-hover:scale-105 transition-transform">
                      {b.name.charAt(0)}
                    </div>
                    <span className="font-bold text-xs text-navy-900 group-hover:text-brand-600 transition-colors">
                      {b.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MODEL */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Select Model for {selectedBrand?.name}:
                </p>
              </div>
              <div className="space-y-2">
                {models.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleSelectModel(m)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-brand-600 hover:bg-slate-50 flex items-center justify-between text-start transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-900 flex items-center justify-center font-bold text-xs">
                        🏍️
                      </div>
                      <div>
                        <div className="text-sm font-bold text-navy-900 group-hover:text-brand-600 transition-colors">
                          {m.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {m.yearFrom ? `From ${m.yearFrom}` : 'All variants'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: YEAR / CONFIRM */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-xs font-semibold text-slate-400 uppercase mb-1">Vehicle Selected:</div>
                <div className="text-base font-bold text-navy-900 flex items-center gap-2">
                  <span>{selectedBrand?.name}</span>
                  <span className="text-brand-600">•</span>
                  <span>{selectedModel?.name}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Category: {selectedType}</div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Select manufacturing year (optional):
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {currentYears.slice(0, 8).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setSelectedYear(yr);
                        handleFinish(yr);
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-brand-600 hover:bg-brand-50 text-xs font-bold text-navy-900 text-center transition-all"
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleFinish()}
                  className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center shadow-sm"
                >
                  Show Parts for All Years
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Current Active Vehicle Footer */}
        {selectedVehicle && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600">
              Current: <strong className="text-navy-900">{selectedVehicle.brandName} {selectedVehicle.modelName}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                clearVehicle();
                closeSelector();
              }}
              className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Clear Filter</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
