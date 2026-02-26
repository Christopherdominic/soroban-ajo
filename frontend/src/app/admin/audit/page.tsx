'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const limit = 50;
  const pages = Math.ceil(total / limit);

  const fetchLogs = () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (actionFilter) params.set('action', actionFilter);

    fetch(`/api/admin/audit?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setLogs(d.logs); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(fetchLogs, [page, actionFilter]);

  const actionColors: any = {
    ban_user: 'text-red-400',
    delete_user: 'text-red-500',
    suspend_user: 'text-amber-400',
    reinstate_user: 'text-green-400',
    delete_group: 'text-red-400',
    cancel_group: 'text-amber-400',
    update_config: 'text-blue-400',
    flag_content: 'text-amber-400',
    resolve_flag: 'text-green-400',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Audit Log</h1>
        <span className="text-xs text-gray-500">{total.toLocaleString()} entries</span>
      </div>

      <div className="flex gap-3">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
          >
            <option value="">All actions</option>
            <option value="ban_user">Ban user</option>
            <option value="suspend_user">Suspend user</option>
            <option value="reinstate_user">Reinstate user</option>
            <option value="delete_user">Delete user</option>
            <option value="delete_group">Delete group</option>
            <option value="cancel_group">Cancel group</option>
            <option value="update_config">Config change</option>
            <option value="flag_content">Flag content</option>
            <option value="resolve_flag">Resolve flag</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-800/50">
          {loading && (
            <div className="text-center py-8 text-gray-500 text-xs animate-pulse">Loading...</div>
          )}
          {!loading && logs.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No audit entries</div>
          )}
          {logs.map(entry => (
            <div key={entry.id}>
              <button
                onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
                className="w-full px-4 py-3 text-left hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium font-mono ${actionColors[entry.action] || 'text-gray-300'}`}>
                      {entry.action}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                      {entry.targetType}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{entry.admin?.email}</span>
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </button>
              {expanded === entry.id && (
                <div className="px-4 pb-3 bg-gray-800/30 text-xs text-gray-500 font-mono space-y-1">
                  <div><span className="text-gray-400">target_id:</span> {entry.targetId}</div>
                  <div><span className="text-gray-400">admin:</span> {entry.admin?.email} ({entry.admin?.role})</div>
                  <div><span className="text-gray-400">metadata:</span> {JSON.stringify(entry.metadata)}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 rounded hover:bg-gray-800 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="p-1 rounded hover:bg-gray-800 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
