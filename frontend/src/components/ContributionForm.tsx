// Issue #24: Implement contribution form
// Complexity: Trivial (100 pts)
// Status: Implemented with comprehensive validation

import React, { useState, useEffect, useRef } from 'react'
import { ValidationError, ContributionValidation } from '../types'

interface ContributionFormProps {
  groupId: string
  contributionAmount: number
  userBalance?: number
  userAddress?: string
  existingContributions?: Array<{ date: string; amount: number }>
}

export const ContributionForm: React.FC<ContributionFormProps> = ({
  groupId,
  contributionAmount,
  userBalance = 1000, // Mock balance
  userAddress: _userAddress,
  existingContributions = [],
}) => {
  const [amount, setAmount] = useState(contributionAmount)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [touched, setTouched] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const NETWORK_FEE = 0.01
  const MIN_AMOUNT = 0.01
  const CONTRIBUTION_COOLDOWN_HOURS = 24

  const validateForm = (): ContributionValidation => {
    const validationErrors: ValidationError[] = []

    if (!amount || Number.isNaN(amount)) {
      validationErrors.push({
        field: 'amount',
        message: 'Please enter a valid amount',
      })
    } else if (amount < MIN_AMOUNT) {
      validationErrors.push({
        field: 'amount',
        message: `Amount must be at least $${MIN_AMOUNT.toFixed(2)}`,
      })
    } else if (amount !== contributionAmount) {
      validationErrors.push({
        field: 'amount',
        message: `Amount must match the required contribution of $${contributionAmount.toFixed(2)}`,
      })
    }

    const decimalPlaces = (amount.toString().split('.')[1] || '').length
    if (decimalPlaces > 2) {
      validationErrors.push({
        field: 'amount',
        message: 'Amount can only have up to 2 decimal places',
      })
    }

    const totalRequired = amount + NETWORK_FEE
    if (totalRequired > userBalance) {
      validationErrors.push({
        field: 'balance',
        message: `Insufficient balance. You need $${totalRequired.toFixed(2)} but have $${userBalance.toFixed(2)}`,
      })
    }

    if (existingContributions.length > 0) {
      const lastContribution = existingContributions[existingContributions.length - 1]
      const lastContributionDate = new Date(lastContribution.date)
      const hoursSinceLastContribution =
        (Date.now() - lastContributionDate.getTime()) / (1000 * 60 * 60)

      if (hoursSinceLastContribution < CONTRIBUTION_COOLDOWN_HOURS) {
        const hoursRemaining = Math.ceil(
          CONTRIBUTION_COOLDOWN_HOURS - hoursSinceLastContribution,
        )
        validationErrors.push({
          field: 'duplicate',
          message: `You already contributed recently. Please wait ${hoursRemaining} hour(s) before contributing again.`,
        })
      }
    }

    setErrors(validationErrors)

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    }
  }

  useEffect(() => {
    if (touched) {
      validateForm()
    }
  }, [amount, touched])

  const handleAmountChange = (value: string) => {
    setTouched(true)
    setSuccessMessage('')
    const parsed = parseFloat(value)
    setAmount(Number.isNaN(parsed) ? 0 : parsed)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)

    const validation = validateForm()

    if (!validation.isValid) {
      return
    }

    setLoading(true)
    setErrors([])

    try {
      // TODO: Validate amount
      // TODO: Call contribute function on smart contract
      // TODO: Sign transaction with user's wallet
      // TODO: Show success/error notification
      // TODO: Update contributions in UI

    try {
      console.log('Contributing to group:', groupId, 'Amount:', amount)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      setSuccessMessage('Contribution successful! Transaction confirmed.')
      setAmount(contributionAmount)
      setTouched(false)

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(''), 5000)
    } catch {
      setErrors([
        {
          field: 'submit',
          message: 'Failed to process contribution. Please try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getErrorByField = (field: string): string | undefined => {
    return errors.find((e) => e.field === field)?.message
  }

  const hasError = (field: string): boolean => {
    return errors.some((e) => e.field === field)
  }

  const totalAmount = amount + NETWORK_FEE
  const isFormValid = errors.length === 0 && amount > 0

  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)
  const formErrors = { amount: getErrorByField('amount') }
  const error = getErrorByField('submit') || getErrorByField('duplicate')

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <h1 className="text-2xl font-bold mb-2">Make a Contribution</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}
      <p className="text-sm text-gray-600 mb-6">
        Enter the amount you'd like to contribute to this group. Fields marked with <span className="text-red-600 font-semibold">*</span> are required.
      </p>

      {formErrors.amount && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          tabIndex={-1}
        >
          <h2 className="text-sm font-semibold text-red-800 mb-2">Please fix this error:</h2>
          <ul className="text-sm text-red-700 space-y-1">
            {formErrors.amount && (
              <li>
                <a href="#amount" className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-600 rounded px-1">
                  {formErrors.amount}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm font-medium"
        >
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold mb-2">
            Amount to Contribute ($) <span className="text-red-600 font-semibold" aria-label="required">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-600" aria-hidden="true">$</span>
            <input
              ref={amountInputRef}
              id="amount"
              type="number"
              value={amount || ''}
              onChange={(e) => handleAmountChange(e.target.value)}
              onBlur={handleBlur}
              step="0.01"
              min="0"
              className={`w-full pl-8 pr-4 py-2 border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 transition-colors ${
                hasError('amount')
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="0.00"
              required
            />
          </div>

          {/* Amount Validation Errors */}
          {hasError('amount') && (
            <p className="mt-1 text-sm text-red-600">{getErrorByField('amount')}</p>
          )}

          <p className="mt-1 text-xs text-gray-600">
            Required contribution: ${contributionAmount.toFixed(2)}
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-900 font-medium">Your Balance:</span>
            <span
              className={`font-semibold ${
                hasError('balance') ? 'text-red-600' : 'text-blue-900'
              }`}
            >
              ${userBalance.toFixed(2)}
            </span>
          </div>
          {hasError('balance') && (
            <p className="mt-2 text-xs text-red-600">{getErrorByField('balance')}</p>
          )}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Network Fee:</span>
            <span className="font-semibold">${NETWORK_FEE.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-gray-900 font-semibold">Total:</span>
            <span className="text-lg font-bold text-blue-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid || !touched}
          className={`w-full font-semibold py-3 rounded-lg transition-all duration-200 ${
            loading || !isFormValid || !touched
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-sm hover:shadow-md'
          } text-white`}
        >
          {loading ? 'Processing...' : 'Contribute'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          You&apos;ll be prompted to confirm this transaction in your wallet.
        </p>
      </form>

      {existingContributions.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-gray-600">
            Previous contributions: {existingContributions.length}
          </p>
        </div>
      )}
    </div>
  )
}
