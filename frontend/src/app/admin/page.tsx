'use client';

import { useEffect, useState } from 'react';
import { Users, FolderKanban, ArrowLeftRight, AlertTriangle, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-400 text-sm animate-pulse">Loading dashboard...</div>
      </div>
    );
  }

  const metrics = data?.health?.metrics;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          System status: <span className="text-green-400">{data?.health?.status ?? 'unknown'}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4 bg-blue-500/10 border-blue-500/20">
          <div className="text-xs text-gray-400 uppercase mb-3">Active Users</div>
          <div className="text-2xl font-bold text-blue-400">{metrics?.activeUsers ?? '—'}</div>
        </div>
        <div className="rounded-lg border p-4 bg-green-500/10 border-green-500/20">
          <div className="text-xs text-gray-400 uppercase mb-3">Active Groups</div>
          <div className="text-2xl font-bold text-green-400">{metrics?.activeGroups ?? '—'}</div>
        </div>
        <div className="rounded-lg border p-4 bg-purple-500/10 border-purple-500/20">
          <div className="text-xs text-gray-400 uppercase mb-3">Txns (24h)</div>
          <div className="text-2xl font-bold text-purple-400">{metrics?.transactionsLast24h ?? '—'}</div>
        </div>
        <div className="rounded-lg border p-4 bg-amber-500/10 border-amber-500/20">
          <div className="text-xs text-gray-400 uppercase mb-3">Pending Flags</div>
          <div className="text-2xl font-bold text-amber-400">{metrics?.pendingModerationFlags ?? '—'}</div>
        </div>
      </div>
    </div>
  );
}
