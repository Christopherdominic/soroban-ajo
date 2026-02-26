'use client';

import { useEffect, useState } from 'react';
import { Search, UserX, UserCheck, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionModal, setActionModal] = useState<any>(null);
  const [actionReason, setActionReason] = useState('');

  const limit = 20;
  const pages = Math.ceil(total / limit);

  const fetchUsers = () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/users?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => { setUsers(d.users); setTotal(d.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [page, statusFilter]);

  const handleAction = async () => {
    if (!actionModal) return;
    const token = localStorage.getItem('adminToken');
    const { type, user } = actionModal;

    const endpoints: any = {
      suspend: `/api/admin/users/${user.id}/suspend`,
      ban: `/api/admin/users/${user.id}/ban`,
      delete: `/api/admin/users/${user.id}`,
      reinstate: `/api/admin/users/${user.id}/reinstate`,
    };

    const methods: any = { suspend: 'POST', ban: 'POST', delete: 'DELETE', reinstate: 'POST' };

    await fetch(endpoints[type], {
      method: methods[type],
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ reason: actionReason }),
    });

    setActionModal(null);
    setActionReason('');
    fetchUsers();
  };

  const statusStyle: any = {
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    suspended: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    banned: 'bg-red-500/10 text-red-400 border-red-500/20',
    deleted: 'bg-gray-700 text-gray-500 border-gray-600',
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Users</h1>
        <span className="text-xs text-gray-500">{total.toLocaleString()} total</span>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-200 focus:outline-none focus:border-amber-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="text-left px-4 py-3">User</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Joined</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {loading && (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500 text-xs animate-pulse">Loading...</td></tr>
            )}
            {!loading && users.map(user => (
              <tr key={user.id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-200">{user.name || '—'}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded border ${statusStyle[user.status]}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {user.status === 'active' && (
                      <button onClick={() => setActionModal({ type: 'suspend', user })} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-amber-400" title="Suspend">
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {(user.status === 'suspended' || user.status === 'banned') && (
                      <button onClick={() => setActionModal({ type: 'reinstate', user })} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-green-400" title="Reinstate">
                        <UserCheck className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {user.status !== 'banned' && user.status !== 'deleted' && (
                      <button onClick={() => setActionModal({ type: 'ban', user })} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400" title="Ban">
                        <UserX className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {user.status !== 'deleted' && (
                      <button onClick={() => setActionModal({ type: 'delete', user })} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {actionModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-100 capitalize">{actionModal.type} User</h2>
            <p className="text-sm text-gray-400">{actionModal.user.email}</p>
            {actionModal.type !== 'reinstate' && (
              <textarea
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500 resize-none"
                placeholder="Enter reason..."
              />
            )}
            <div className="flex gap-3">
              <button onClick={() => { setActionModal(null); setActionReason(''); }} className="flex-1 py-2 rounded text-sm text-gray-400 bg-gray-800 hover:bg-gray-700">Cancel</button>
              <button
                onClick={handleAction}
                disabled={actionModal.type !== 'reinstate' && !actionReason.trim()}
                className="flex-1 py-2 rounded text-sm font-medium bg-amber-600 hover:bg-amber-700 text-gray-900 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
