import React from 'react'
import { WalletBalance } from '../hooks/useWalletBalance'
import { formatXLM, lockedPercentage } from '../utils/formatters'

interface BalanceDisplayProps {
  balance: WalletBalance
  /** Show the available / locked / reserve breakdown bars */
  showBreakdown?: boolean
  /** Compact single-line mode for use inside the header dropdown button */
  compact?: boolean
  className?: string
}

/**
 * BalanceDisplay
 *
 * Renders the user's XLM balance.
 *
 * compact=true  →  single line for the header button
 * compact=false →  full panel with colour-coded breakdown bars
 */
export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  showBreakdown = false,
  compact = false,
  className = '',
}) => {
  const { total, available, lockedInGroups, minReserve, isLoading, error, lastUpdated } =
    balance

  // ── Compact mode (header) ─────────────────────────────────────────────────
  if (compact) {
    return (
      <span className={`flex items-center gap-1.5 ${className}`}>
        {isLoading ? (
          <span className="h-3.5 w-20 rounded bg-gray-200 animate-pulse" />
        ) : error ? (
          <span className="text-xs text-red-500">Balance unavailable</span>
        ) : (
          <span className="text-sm font-semibold text-gray-800">
            {formatXLM(available, 2)}
          </span>
        )}
      </span>
    )
  }

  // Stacked bar percentages
  const lockedPct = lockedPercentage(total, lockedInGroups)
  const reservePct = lockedPercentage(total, minReserve)
  const availablePct = Math.max(0, 100 - lockedPct - reservePct)

  // ── Full panel mode ───────────────────────────────────────────────────────
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Wallet Balance
        </span>
        {lastUpdated && !isLoading && (
          <span className="text-[10px] text-gray-400">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2 animate-pulse">
          <div className="h-7 bg-gray-100 rounded w-40" />
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <p className="text-sm text-red-500 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Data */}
      {!isLoading && !error && (
        <>
          {/* Total */}
          <div>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">
              {formatXLM(total, 4)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Total balance</p>
          </div>

          {showBreakdown && (
            <>
              {/* Stacked bar */}
              <div className="flex h-2 rounded-full overflow-hidden gap-px">
                <div
                  className="bg-blue-500 transition-all duration-500"
                  style={{ width: `${availablePct}%` }}
                  title={`Available: ${formatXLM(available)}`}
                />
                <div
                  className="bg-amber-400 transition-all duration-500"
                  style={{ width: `${lockedPct}%` }}
                  title={`Locked in groups: ${formatXLM(lockedInGroups)}`}
                />
                <div
                  className="bg-gray-200 transition-all duration-500"
                  style={{ width: `${reservePct}%` }}
                  title={`Min reserve: ${formatXLM(minReserve)}`}
                />
              </div>

              {/* Legend rows */}
              <div className="space-y-2">
                <LegendRow
                  dot="bg-blue-500"
                  label="Available"
                  sub="Spendable"
                  value={formatXLM(available, 4)}
                />
                <LegendRow
                  dot="bg-amber-400"
                  label="Locked in groups"
                  sub={`${lockedPct}% of total`}
                  value={formatXLM(lockedInGroups, 4)}
                />
                <LegendRow
                  dot="bg-gray-300"
                  label="Min. reserve"
                  sub="Network requirement"
                  value={formatXLM(minReserve, 4)}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

// ── Legend row sub-component ──────────────────────────────────────────────────

interface LegendRowProps {
  dot: string
  label: string
  sub?: string
  value: string
}

const LegendRow: React.FC<LegendRowProps> = ({ dot, label, sub, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dot}`} />
      <div>
        <p className="text-sm text-gray-700">{label}</p>
        {sub && <p className="text-[11px] text-gray-400">{sub}</p>}
      </div>
    </div>
    <span className="text-sm font-medium text-gray-900 tabular-nums">{value}</span>
  </div>
)
