"use client";
import { useEffect, useState } from "react";

interface Stats {
  totalEvents: number;
  eventsByType: { type: string; count: number }[];
  eventsByCategory: { category: string; count: number }[];
  errorsBySeverity: { severity: string; count: number }[];
  recentEvents: any[];
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load analytics data");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0e27] text-green-400 font-mono flex items-center justify-center">
      <p className="animate-pulse">Loading analytics...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0a0e27] text-red-400 font-mono flex items-center justify-center">
      <p>{error}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0a0e27] text-green-400 font-mono p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 border-b border-green-500/30 pb-4">
          <h1 className="text-xl font-bold tracking-widest">◆ ANALYTICS DASHBOARD</h1>
          <p className="text-green-600 text-xs mt-1">Real-time metrics and event tracking</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "TOTAL EVENTS", value: stats?.totalEvents || 0 },
            { label: "EVENT TYPES", value: stats?.eventsByType?.length || 0 },
            { label: "CATEGORIES", value: stats?.eventsByCategory?.length || 0 },
            { label: "ERRORS", value: stats?.errorsBySeverity?.reduce((s, e) => s + Number(e.count), 0) || 0 },
          ].map(({ label, value }) => (
            <div key={label} className="border border-green-500/30 rounded p-4">
              <p className="text-green-600 text-xs mb-1">{label}</p>
              <p className="text-green-400 text-2xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Events by Type */}
          <div className="border border-green-500/30 rounded p-4">
            <h2 className="text-green-400 text-sm mb-3">[ EVENTS BY TYPE ]</h2>
            {stats?.eventsByType?.length === 0 ? (
              <p className="text-green-700 text-sm">No data yet</p>
            ) : (
              stats?.eventsByType?.map((e) => (
                <div key={e.type} className="flex justify-between py-1 border-b border-green-500/10">
                  <span className="text-green-300 text-sm">{e.type}</span>
                  <span className="text-green-500 text-sm">{e.count}</span>
                </div>
              ))
            )}
          </div>

          {/* Events by Category */}
          <div className="border border-green-500/30 rounded p-4">
            <h2 className="text-green-400 text-sm mb-3">[ EVENTS BY CATEGORY ]</h2>
            {stats?.eventsByCategory?.length === 0 ? (
              <p className="text-green-700 text-sm">No data yet</p>
            ) : (
              stats?.eventsByCategory?.map((e) => (
                <div key={e.category} className="flex justify-between py-1 border-b border-green-500/10">
                  <span className="text-green-300 text-sm">{e.category}</span>
                  <span className="text-green-500 text-sm">{e.count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Errors by Severity */}
        <div className="border border-green-500/30 rounded p-4 mb-6">
          <h2 className="text-green-400 text-sm mb-3">[ ERRORS BY SEVERITY ]</h2>
          <div className="grid grid-cols-4 gap-3">
            {["low", "medium", "high", "critical"].map((sev) => {
              const found = stats?.errorsBySeverity?.find((e) => e.severity === sev);
              const colors: Record<string, string> = {
                low: "text-green-400",
                medium: "text-yellow-400",
                high: "text-orange-400",
                critical: "text-red-400",
              };
              return (
                <div key={sev} className="border border-green-500/30 rounded p-3 text-center">
                  <p className={`text-xs mb-1 ${colors[sev]}`}>{sev.toUpperCase()}</p>
                  <p className={`text-xl font-bold ${colors[sev]}`}>{found?.count || 0}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="border border-green-500/30 rounded p-4">
          <h2 className="text-green-400 text-sm mb-3">[ RECENT EVENTS ]</h2>
          {stats?.recentEvents?.length === 0 ? (
            <p className="text-green-700 text-sm">No events yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {stats?.recentEvents?.map((e, i) => (
                <div key={i} className="flex justify-between text-xs py-1 border-b border-green-500/10">
                  <span className="text-green-500">{e.type}</span>
                  <span className="text-green-300">{e.category} / {e.action}</span>
                  <span className="text-green-700">{new Date(e.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
