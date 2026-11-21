'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    company_name: 'Alisons General Trading LLP',
    website: 'www.hastinamotorparts.in',
    tagline: 'Motorcycle • Scooter • Tuk Tuk Spare Parts — From India to the World',
    address: 'Unit No. 43, Ground Floor, Living Style Mall, Jasola, New Delhi – 110025, India',
    phone: '+91 9717829768',
    whatsapp: '919717829768',
    email: 'contect@hastinamotorparts.in',
    enable_car_parts: 'true',
    working_hours: 'Mon - Sat: 9:30 AM – 6:30 PM (IST)'
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.settings) {
          setSettings(prev => ({ ...prev, ...res.settings }));
        }
      })
      .catch(console.error);
  }, []);

  const handleChange = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        alert(data.error || 'Failed to update settings');
      }
    } catch (err) {
      alert('Error updating site settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">
          Website &amp; Company Settings
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage export desk contact details, WhatsApp integration numbers, and registered office address.
        </p>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Site settings successfully updated and applied!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          <div>
            <label className="font-bold text-navy-900 block mb-1">Company Legal Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => handleChange('company_name', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="font-bold text-navy-900 block mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-navy-900"
            />
          </div>

          <div>
            <label className="font-bold text-navy-900 block mb-1">Registered Office Address</label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-semibold text-navy-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-navy-900 block mb-1">Export Sales Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-navy-900"
              />
            </div>

            <div>
              <label className="font-bold text-navy-900 block mb-1">WhatsApp Export Number (No +)</label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="919811000000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-navy-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="font-bold text-navy-900 block mb-1">Car Spare Parts Section (Optional Module)</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="carParts"
                checked={settings.enable_car_parts === 'true'}
                onChange={(e) => handleChange('enable_car_parts', e.target.checked ? 'true' : 'false')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <label htmlFor="carParts" className="text-slate-700 font-medium cursor-pointer">
                Enable Car Spare Parts module (Maruti Suzuki, Hyundai, Kia export spares)
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold px-6 py-3 rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Site Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
