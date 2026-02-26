'use client';

import { useEffect, useState } from 'react';
import { Save, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [config, setConfig] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const fetchConfig = () => {
    const token = localStorage.getItem('adminToken');
    fetch('/api/admin/config', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setConfig)
      .finally(() => setLoading(false));
  };

  useEffect(fetchConfig, []);

  const save = async (section: string, endpoint: string, body: unknown) => {
    setSaving(section);
    const token = localStorage.getItem('adminToken');
    await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    setSaving(null);
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
    fetchConfig();
  };

  const maintenance = config.maintenance_mode || { enabled: false, message: '' };
  const flags = config.feature_flags || {};
  const fees = config.fee_settings || {};
  const defaultFlags = ['new_user_registration', 'group_creation', 'withdrawals', 'notifications', 'referrals'];

  if (loading) return <div className="text-gray-500 text-sm animate-pulse">Loading configuration...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-xl font-bold text-gray-100">System Configuration</h1>

      <div className={`bg-gray-900 border rounded-lg p-5 ${maintenance.enabled ? 'border-amber-500/40' : 'border-gray-800'}`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-200">Maintenance Mode</h2>
            <p className="text-xs text-gray-500 mt-0.5">Take the platform offline for all users</p>
          </div>
          {maintenance.enabled && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-200">Enable maintenance mode</div>
          <button
            onClick={() => save('maintenance', '/api/admin/config/maintenance', { enabled: !maintenance.enabled, message: maintenance.message })}
            className={maintenance.enabled ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}
          >
            {maintenance.enabled ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
          </button>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-1">Feature Flags</h2>
        <p className="text-xs text-gray-500 mb-4">Enable or disable platform features</p>
        <div className="space-y-3">
          {defaultFlags.map(flag => (
            <div key={flag} className="flex items-center justify-between">
              <div className="text-sm text-gray-300 capitalize">{flag.replace(/_/g, ' ')}</div>
              <button
                onClick={() => save('flags', '/api/admin/config/feature-flags', { flag, enabled: !flags[flag] })}
                className={flags[flag] !== false ? 'text-green-400' : 'text-gray-600 hover:text-gray-400'}
              >
                {flags[flag] !== false ? <ToggleRight className="w-7 h-7" /> : <ToggleLeft className="w-7 h-7" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-200 mb-1">Fee Settings</h2>
        <p className="text-xs text-gray-500 mb-4">Configure platform fees</p>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: 'platformFeePercent', label: 'Platform Fee %', placeholder: '1.5' },
            { key: 'withdrawalFee', label: 'Withdrawal Fee', placeholder: '0.50' },
            { key: 'minFee', label: 'Minimum Fee', placeholder: '0.10' },
            { key: 'maxFee', label: 'Maximum Fee', placeholder: '50' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</label>
              <input
                type="number"
                step="0.01"
                id={`fee-${key}`}
                defaultValue={fees[key]}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const newFees: any = {};
            ['platformFeePercent', 'withdrawalFee', 'minFee', 'maxFee'].forEach(k => {
              const el = document.getElementById(`fee-${k}`) as HTMLInputElement;
              if (el?.value) newFees[k] = parseFloat(el.value);
            });
            save('fees', '/api/admin/config/fees', newFees);
          }}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-sm text-gray-200 rounded hover:bg-gray-700"
        >
          <Save className="w-4 h-4" />
          {saving === 'fees' ? 'Saving...' : saved === 'fees' ? '✓ Saved' : 'Save Fees'}
        </button>
      </div>
    </div>
  );
}
