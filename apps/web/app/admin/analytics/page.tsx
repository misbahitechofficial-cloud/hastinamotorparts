'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, AlertTriangle, Search, Globe2, TrendingUp, RefreshCw } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>({
    totalSearches: 6,
    zeroResultCount: 2,
    topSearches: [
      { query: 'pulsar 150 cylinder', count: 4 },
      { query: '36360086', count: 3 },
      { query: 'tvs ntorq belt', count: 2 }
    ],
    topZeroResults: [
      { query: 'hero splendor cdi', count: 3 },
      { query: 'yamaha r15 v3 headlight', count: 2 },
      { query: 'ktm duke 200 piston', count: 1 }
    ],
    enquiriesByCountry: {
      'Iraq': 1,
      'Ghana': 1
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchAnalytics = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/api/v1/admin/analytics/summary', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('hastina_admin_token') || ''}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.analytics) {
          setAnalytics(data.analytics);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-navy-900 tracking-tight">
            Search Analytics &amp; Zero-Result Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logs of buyer search behavior, uncovered part demand, and zero-match search queries.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAnalytics}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-navy-900 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Zero-Result Searches (Crucial Spec Requirement) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="font-bold text-base text-navy-900">
                Zero-Result Searches (Unmet Customer Demand)
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {analytics.zeroResultCount} zero matches
            </span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            These part numbers and model names were searched by buyers but yielded zero results in the active catalogue. Consider sourcing and adding these items to capture immediate export sales.
          </p>

          <div className="divide-y divide-slate-100">
            {analytics.topZeroResults.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-navy-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {item.query}
                  </span>
                </div>
                <span className="font-bold text-slate-500">
                  {item.count} search attempts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Searched Terms */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-600" />
              <h2 className="font-bold text-base text-navy-900">
                Top Searched Spare Parts &amp; Models
              </h2>
            </div>
            <span className="text-xs font-bold text-navy-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
              {analytics.totalSearches} total queries
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {analytics.topSearches.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-navy-900">
                  {item.query}
                </span>
                <span className="font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                  {item.count} searches
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
