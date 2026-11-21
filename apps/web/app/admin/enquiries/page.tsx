'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
  FileSpreadsheet,
  Mail,
  Building,
  Globe2,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Email reply modal state
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchEnquiries = () => {
    setIsLoading(true);
    fetch('/api/admin/enquiries')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.enquiries) {
          let list = data.enquiries;
          if (statusFilter) {
            list = list.filter((e: any) => e.status === statusFilter);
          }
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((e: any) =>
              (e.customerName || '').toLowerCase().includes(q) ||
              (e.company || '').toLowerCase().includes(q) ||
              (e.id || '').toLowerCase().includes(q) ||
              (e.email || '').toLowerCase().includes(q)
            );
          }
          setEnquiries(list);
          if (list.length > 0 && !selectedEnquiry) {
            setSelectedEnquiry(list[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/enquiries', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify({ id, status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchEnquiries();
        if (selectedEnquiry && selectedEnquiry.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
        }
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    setIsSendingReply(true);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/enquiries/admin/${selectedEnquiry.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
        },
        body: JSON.stringify({
          subject: replySubject,
          message: replyMessage
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setIsReplyModalOpen(false);
        setReplyMessage('');
        fetchEnquiries();
      }
    } catch (err) {
      alert('Error dispatching reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-brand-50 text-brand-700 border border-brand-200 text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>;
      case 'QUOTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full">QUOTED</span>;
      case 'WON':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">WON</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full">LOST</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Quotation Enquiries ({enquiries.length})
          </h1>
          <p className="text-xs text-slate-500">
            Incoming B2B spare parts quote requests, quotation replies, and order status tracking.
          </p>
        </div>

        <a
          href="http://localhost:4000/api/v1/enquiries/admin/export"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-slate-50 text-navy-900 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export to Excel</span>
        </a>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['', 'NEW', 'QUOTED', 'WON', 'LOST'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-navy-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st || 'All Statuses'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchEnquiries()}
            placeholder="Search ref #, buyer, country..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-navy-900 font-semibold focus:outline-none focus:border-brand-600"
          />
          <button
            type="button"
            onClick={fetchEnquiries}
            className="bg-navy-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl shrink-0"
          >
            Search
          </button>
        </div>
      </div>

      {/* 2-Column Split: Enquiry List + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100 max-h-[750px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">Loading enquiries...</div>
          ) : enquiries.length > 0 ? (
            enquiries.map((enq) => (
              <button
                key={enq.id}
                type="button"
                onClick={() => setSelectedEnquiry(enq)}
                className={`w-full text-start p-4 transition-colors flex flex-col justify-between gap-2 ${
                  selectedEnquiry?.id === enq.id ? 'bg-brand-50/60 border-s-4 border-s-brand-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-brand-600">
                    {enq.refNo}
                  </span>
                  {getStatusBadge(enq.status)}
                </div>

                <div>
                  <div className="text-sm font-bold text-navy-900">{enq.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span>{enq.company || 'Direct Importer'}</span>
                    <span>•</span>
                    <span className="font-semibold text-navy-900">{enq.country}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>{enq.items?.length || 0} parts requested</span>
                  <span>{new Date(enq.createdAt).toLocaleDateString()}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No quotation requests found.</div>
          )}
        </div>

        {/* Selected Enquiry Detail View */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="font-mono text-lg font-black text-brand-600">
                    {selectedEnquiry.refNo}
                  </span>
                  <div className="text-xs text-slate-500">
                    Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Status:</span>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedEnquiry.id, e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-navy-900 focus:outline-none focus:border-brand-600"
                  >
                    <option value="NEW">NEW</option>
                    <option value="QUOTED">QUOTED</option>
                    <option value="WON">WON</option>
                    <option value="LOST">LOST</option>
                  </select>
                </div>
              </div>

              {/* Customer Info Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Customer Name</span>
                  <strong className="text-navy-900 text-sm">{selectedEnquiry.name}</strong>
                  <div className="text-slate-600 mt-1">{selectedEnquiry.company || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold uppercase text-[10px] block">Destination &amp; Contact</span>
                  <div className="text-navy-900 font-bold">{selectedEnquiry.country}</div>
                  <div className="text-slate-600 mt-0.5">{selectedEnquiry.email}</div>
                  {selectedEnquiry.phone && <div className="text-emerald-700 font-semibold">{selectedEnquiry.phone}</div>}
                </div>
              </div>

              {/* Customer Message */}
              {selectedEnquiry.message && (
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Customer Message / Requirements</span>
                  <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-700 border border-slate-200 italic leading-relaxed">
                    &quot;{selectedEnquiry.message}&quot;
                  </div>
                </div>
              )}

              {/* Parts Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Requested Spare Parts ({selectedEnquiry.items?.length || 0})
                </span>
                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-start">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 text-start">Part Number</th>
                        <th className="py-2.5 px-3 text-start">Description</th>
                        <th className="py-2.5 px-3 text-end">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedEnquiry.items?.map((item: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-mono font-bold text-navy-900">{item.partNumber}</td>
                          <td className="py-2.5 px-3 text-slate-700 font-medium">{item.partName || 'OEM Component'}</td>
                          <td className="py-2.5 px-3 text-end font-bold font-mono text-brand-600">{item.quantity} pcs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Internal Export Notes</label>
                <textarea
                  rows={2}
                  defaultValue={selectedEnquiry.notes || ''}
                  onBlur={(e) => handleUpdateStatus(selectedEnquiry.id, selectedEnquiry.status, e.target.value)}
                  placeholder="e.g. Quoted $4,200 CIF Umm Qasr. Awaiting payment terms confirmation..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-navy-900 focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setReplySubject(`Quotation for Spare Parts: ${selectedEnquiry.refNo}`);
                    setIsReplyModalOpen(true);
                  }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Quotation Email Reply</span>
                </button>

                {selectedEnquiry.phone && (
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedEnquiry.name}, thank you for your enquiry (${selectedEnquiry.refNo}) at Hastina Motor Parts (Alisons General Trading LLP). We have prepared your export quotation.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Buyer</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-400">
              Select an enquiry from the list to view specifications and reply.
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-floating">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-navy-900">
                Send Quotation Reply to {selectedEnquiry?.email}
              </h3>
              <button
                type="button"
                onClick={() => setIsReplyModalOpen(false)}
                className="text-slate-400 hover:text-navy-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-navy-900 block mb-1">Email Subject</label>
                <input
                  type="text"
                  required
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-navy-900 block mb-1">Quotation Details / Message Body</label>
                <textarea
                  rows={6}
                  required
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Dear Customer,&#10;&#10;We are pleased to provide competitive pricing for your enquiry:&#10;- Part #36360086 (150 pcs): $12.50 / pc FOB&#10;- Part #JA541015 (300 pcs): $3.20 / pc FOB&#10;&#10;Lead time: 7 days. Packaging: Seaworthy corrugated cartons."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingReply}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-2 rounded-xl shadow-sm"
                >
                  {isSendingReply ? 'Sending...' : 'Send Quotation Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
