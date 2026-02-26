import React, { useEffect, useRef } from 'react'
import { TransactionSimulation } from '../services/soroban'
import { formatXLM, formatFee, hasSufficientBalance } from '../utils/formatters'

// ── Types ─────────────────────────────────────────────────────────────────────

export type TxType =
  | 'contribution'
  | 'withdrawal'
  | 'create_group'
  | 'join_group'
  | 'payout'

export interface TxPreviewData {
  type: TxType
  /** Short title shown at the top e.g. "Monthly Contribution" */
  title: string
  /** XLM amount being sent/locked */
  amountXLM: number
  /** Ajo group name (if applicable) */
  groupName?: string
  /** Any extra key/value rows to show in the details table */
  details?: Array<{ label: string; value: string }>
}

interface TransactionPreviewProps {
  isOpen: boolean
  onClose: () => void
  /** Called when user clicks "Sign & Submit" */
  onConfirm: () => void
  transaction: TxPreviewData | null
  /** Result from simulateSorobanTransaction() — null while simulating */
  simulation: TransactionSimulation | null
  isSimulating: boolean
  /** True while the real transaction is being signed/submitted */
  isSubmitting: boolean
  /** balance.available from useWalletBalance */
  availableBalanceXLM: number
}

// ── Icon config per tx type ───────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  TxType,
  { label: string; badgeClass: string; iconPath: string }
> = {
  contribution: {
    label: 'Contribution',
    badgeClass: 'bg-blue-100 text-blue-700',
    iconPath: 'M12 4v16m8-8H4',
  },
  withdrawal: {
    label: 'Withdrawal',
    badgeClass: 'bg-purple-100 text-purple-700',
    iconPath: 'M3 12h18M12 4l8 8-8 8',
  },
  create_group: {
    label: 'Create Group',
    badgeClass: 'bg-green-100 text-green-700',
    iconPath: 'M12 4v16m8-8H4',
  },
  join_group: {
    label: 'Join Group',
    badgeClass: 'bg-amber-100 text-amber-700',
    iconPath:
      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  },
  payout: {
    label: 'Payout',
    badgeClass: 'bg-green-100 text-green-700',
    iconPath:
      'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * TransactionPreview
 *
 * Full-screen modal (mobile: bottom sheet, desktop: centred) that shows
 * transaction details, gas fee estimate, total cost, and expected outcome
 * before the user signs.
 *
 * Usage:
 *   1. User clicks a submit button in ContributionForm / GroupCreationForm
 *   2. Build the transaction (don't sign yet)
 *   3. Call simulateSorobanTransaction(tx.toXDR(), "...outcome...")
 *   4. Set simulation result + open this modal
 *   5. onConfirm → actually sign and submit
 */
export const TransactionPreview: React.FC<TransactionPreviewProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  simulation,
  isSimulating,
  isSubmitting,
  availableBalanceXLM,
}) => {
  const backdropRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen || !transaction) return null

  const cfg = TYPE_CONFIG[transaction.type]
  const gasFeeXLM = simulation?.success ? simulation.feeXLM : 0
  const totalXLM = transaction.amountXLM + gasFeeXLM
  const insufficient = !hasSufficientBalance(
    availableBalanceXLM,
    transaction.amountXLM,
    gasFeeXLM
  )

  const canConfirm =
    !isSimulating && !isSubmitting && simulation?.success === true && !insufficient

  return (
    // Backdrop
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-preview-title"
    >
      {/* Panel */}
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass}`}>
              {cfg.label}
            </span>
            <p id="tx-preview-title" className="text-sm font-semibold text-gray-800">
              {transaction.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 rounded"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4 space-y-4">
          {/* Amount */}
          <div className="text-center py-2">
            <p className="text-3xl font-bold text-gray-900">
              {formatXLM(transaction.amountXLM, 4)}
            </p>
            {transaction.groupName && (
              <p className="text-sm text-gray-500 mt-1">
                {transaction.type === 'payout' ? 'received from' : 'to'}{' '}
                <span className="font-medium text-gray-700">{transaction.groupName}</span>
              </p>
            )}
          </div>

          {/* Details table */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">

            {/* Custom rows */}
            {transaction.details?.map(({ label, value }) => (
              <Row key={label} label={label} value={value} />
            ))}

            {/* Gas fee */}
            <Row
              label="Gas fee"
              value={
                isSimulating ? (
                  <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin" />
                    Estimating…
                  </span>
                ) : simulation?.success ? (
                  formatFee(simulation.feeStroops)
                ) : simulation?.error ? (
                  <span className="text-red-500 text-xs">{simulation.error}</span>
                ) : (
                  '—'
                )
              }
            />

            {/* Total */}
            <Row
              label="Total cost"
              highlight
              value={
                isSimulating ? (
                  <span className="inline-block h-4 w-28 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <span className="font-semibold text-gray-900">{formatXLM(totalXLM, 4)}</span>
                )
              }
            />

            {/* Expected outcome */}
            {simulation?.success && simulation.expectedOutcome && (
              <Row
                label="Expected outcome"
                value={
                  <span className="text-green-600 text-xs font-medium">
                    {simulation.expectedOutcome}
                  </span>
                }
              />
            )}
          </div>

          {/* Insufficient balance warning */}
          {insufficient && !isSimulating && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
              <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-red-700">Insufficient balance</p>
                <p className="text-xs text-red-600 mt-0.5">
                  You need {formatXLM(totalXLM, 4)} but only have{' '}
                  {formatXLM(availableBalanceXLM, 4)} available.
                </p>
              </div>
            </div>
          )}

          {/* Simulation warning (non-balance errors) */}
          {!isSimulating && simulation?.error && !insufficient && (
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-amber-700">Simulation warning: {simulation.error}</p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canConfirm}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Signing…
              </>
            ) : (
              'Sign & Submit'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Table row helper ──────────────────────────────────────────────────────────

interface RowProps {
  label: string
  value: React.ReactNode
  highlight?: boolean
}

const Row: React.FC<RowProps> = ({ label, value, highlight }) => (
  <div
    className={`flex items-center justify-between px-4 py-3 ${
      highlight ? 'bg-gray-50' : 'bg-white'
    }`}
  >
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm text-gray-800 text-right max-w-[60%] break-words">{value}</span>
  </div>
)
