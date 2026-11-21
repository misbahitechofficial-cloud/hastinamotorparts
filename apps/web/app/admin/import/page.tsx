'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function BulkImportExportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select an Excel or CSV file to upload.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/api/v1/parts/admin/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(data.result);
      } else {
        alert(data.error || 'Import failed');
      }
    } catch (err) {
      alert('Network error during upload');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-black text-navy-900 tracking-tight">
          Catalogue Bulk Import &amp; Export
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload bulk Excel/CSV sheets with thousands of spare parts, or export your live inventory.
        </p>
      </div>

      {/* Template & Export Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          href="http://localhost:4000/api/v1/parts/admin/template"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-navy-900 group-hover:text-brand-600">Download Excel Template</h3>
              <p className="text-[11px] text-slate-500">Official columns structure &amp; sample SKUs</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" />
        </a>

        <a
          href="http://localhost:4000/api/v1/parts/admin/export"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-xs transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-navy-900 group-hover:text-emerald-700">Export All Active Parts</h3>
              <p className="text-[11px] text-slate-500">Download live catalogue with fitments</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-black text-navy-900">Upload Excel Spreadsheet</h2>
          <p className="text-xs text-slate-500 mt-1">
            Accepts <code>.xlsx</code> or <code>.csv</code> files up to 15 MB. Existing part numbers will be updated automatically.
          </p>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-3xl p-8 text-center space-y-3 bg-slate-50/50 transition-colors">
            <Upload className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <label className="text-xs font-bold text-brand-600 hover:underline cursor-pointer">
                <span>Select file from computer</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-slate-400 block mt-1">
                {file ? `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)` : 'or drag and drop spreadsheet here'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={isUploading || !file}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
            >
              {isUploading ? (
                <span>Parsing &amp; Importing...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Execute Bulk Import</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Validation Report */}
        {importResult && (
          <div className="pt-6 border-t border-slate-100 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
              <span>
                Processed {importResult.totalRows} rows: {importResult.importedCount} new parts added, {importResult.updatedCount} existing parts updated.
              </span>
            </div>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Validation Warnings ({importResult.errors.length}):</span>
                </div>
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 max-h-48 overflow-y-auto space-y-1.5 text-xs text-amber-900">
                  {importResult.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>Row {err.row}: {err.message}</span>
                      {err.partNumber && <span className="font-mono text-[11px] font-bold">#{err.partNumber}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Column Specifications Reference */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 space-y-2">
        <strong className="text-navy-900 block font-bold">Expected Excel Column Names:</strong>
        <div className="font-mono text-[11px] bg-white p-3 rounded-xl border border-slate-200 text-slate-800 leading-relaxed overflow-x-auto">
          part_number | alt_numbers | name | category_l1 | category_l2 | category_l3 | grade | brand | models | description | specs | moq | weight_kg | image_file
        </div>
      </div>
    </div>
  );
}
