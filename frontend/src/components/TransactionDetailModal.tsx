import React from 'react'
import { Transaction } from '../types'
import { X, ExternalLink, ShieldCheck, AlertCircle, Clock } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { useEscapeKey } from '@/hooks/useKeyboardNavigation'

interface TransactionDetailModalProps {
    transaction: Transaction | null
    isOpen: boolean
    onClose: () => void
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    transaction,
    isOpen,
    onClose,
}) => {
    const { resolvedTheme } = useTheme()
    const modalRef = useFocusTrap(isOpen)
    useEscapeKey(onClose, isOpen)

    if (!isOpen || !transaction) return null

    // Ensure hash exists; fallback to id if dealing with mock data
    const hash = ('hash' in transaction ? transaction.hash : undefined) || transaction.id

    // Construct Stellar Expert URL (assuming testnet for now)
    const stellarExpertUrl = `https://stellar.expert/explorer/testnet/tx/${hash}`

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
            case 'confirmed':
                return <ShieldCheck className="w-6 h-6 text-green-500" />
            case 'pending':
                return <Clock className="w-6 h-6 text-amber-500" />
            case 'failed':
                return <AlertCircle className="w-6 h-6 text-red-500" />
            default:
                return <ShieldCheck className="w-6 h-6 text-blue-500" />
        }
    }

    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'payout' || type === 'refund' ? '+' : '-'
        const colorClass = type === 'payout' || type === 'refund' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
        return <span className={clsx("font-bold text-lg", colorClass)}>{sign}{amount} XLM</span>
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            <div
                ref={modalRef as React.RefObject<HTMLDivElement>}
                className={clsx(
                    "relative w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200",
                    resolvedTheme === 'dark' ? "bg-gray-900 border border-gray-800" : "bg-white"
                )}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                    <h3 id="modal-title" className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        Transaction Details
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
                                {getStatusIcon(transaction.status)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                                    {transaction.type}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            {formatAmount(transaction.amount, transaction.type)}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {format(new Date(transaction.date || transaction.timestamp), 'PPpp')}
                                </p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-xs text-gray-400 mb-1">Group ID</p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                    {transaction.groupId || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-400 mb-1">Member Address</p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                                {transaction.member}
                            </p>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                            <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
                            <p className="text-sm font-mono text-gray-900 dark:text-white break-all mb-2">
                                {`${hash || 'N/A'}`}
                            </p>
                            <a
                                href={stellarExpertUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="View transaction on Stellar Expert (opens in new tab)"
                            >
                                View on Stellar Expert <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}
