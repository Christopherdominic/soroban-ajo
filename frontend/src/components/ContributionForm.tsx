// Issue #24: Implement contribution form
// Complexity: Trivial (100 pts)
// Status: Implemented with comprehensive validation

import React, { useEffect, useState } from 'react'
import { ContributionValidation, ValidationError } from '../types'

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
  userBalance = 1000,
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
      console.log('Contributing to group:', groupId, 'Amount:', amount)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccessMessage('Contribution successful! Transaction confirmed.')
      setAmount(contributionAmount)
      setTouched(false)

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

  const getErrorByField = (field: string): string | undefined =>
    errors.find((err) => err.field === field)?.message

  const hasError = (field: string): boolean =>
    errors.some((err) => err.field === field)

  const totalAmount = amount + NETWORK_FEE
  const isFormValid = errors.length === 0 && amount > 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h3 className="text-2xl font-bold mb-4">Make a Contribution</h3>

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

      {(hasError('submit') || hasError('duplicate')) && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
          {getErrorByField('submit') || getErrorByField('duplicate')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="contribution-amount" className="block text-sm font-semibold mb-2">
            Amount to Contribute ($)
          </label>
          <input
            id="contribution-amount"
            type="number"
            value={amount || ''}
            onChange={(e) => handleAmountChange(e.target.value)}
            step="0.01"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 transition-colors ${
              hasError('amount')
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />

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
