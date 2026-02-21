// Issue #21: Build group creation form
// Complexity: Trivial (100 pts)
// Status: Placeholder

import React, { useState, useRef, useEffect } from 'react'

interface GroupFormData {
  groupName: string
  description: string
  cycleLength: number
  contributionAmount: number
  maxMembers: number
  frequency: 'weekly' | 'monthly'
  duration: number
  invitedMembers: string[]
}

interface FormErrors {
  groupName?: string
  description?: string
  cycleLength?: string
  contributionAmount?: string
  maxMembers?: string
}

interface GroupCreationFormProps {
  onSuccess?: () => void
}

export const GroupCreationForm: React.FC<GroupCreationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: '',
    description: '',
    cycleLength: 30,
    contributionAmount: 100,
    maxMembers: 10,
    frequency: 'monthly',
    duration: 12,
    invitedMembers: [],
  })
  const [memberInput, setMemberInput] = useState('')

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const groupNameRef = useRef<HTMLInputElement>(null)
  
  const hasErrors = Object.keys(errors).length > 0

  // Focus on error summary when errors occur after submission
  useEffect(() => {
    if (submitted && Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus()
    }
  }, [errors, submitted])

  const validateField = (name: string, value: any): string | undefined => {
    switch (name) {
      case 'groupName':
        if (!value?.trim()) return 'Group name is required'
        if (value.trim().length < 3) return 'Group name must be at least 3 characters'
        if (value.trim().length > 100) return 'Group name must not exceed 100 characters'
        return undefined

      case 'description':
        if (value && value.length > 500) return 'Description must not exceed 500 characters'
        return undefined

      case 'cycleLength':
        if (!value) return 'Cycle length is required'
        if (value < 1) return 'Cycle length must be at least 1 day'
        if (value > 365) return 'Cycle length must not exceed 365 days'
        return undefined

      case 'contributionAmount':
        if (!value) return 'Contribution amount is required'
        if (value <= 0) return 'Contribution amount must be greater than 0'
        if (value > 1000000) return 'Contribution amount must not exceed 1,000,000'
        return undefined

      case 'maxMembers':
        if (!value) return 'Max members is required'
        if (value < 2) return 'Group must allow at least 2 members'
        if (value > 50) return 'Group cannot exceed 50 members'
        return undefined

      default:
        return undefined
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTouched({ ...touched, [name]: true })
    const error = validateField(name, value)
    setErrors({ ...errors, [name]: error })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: name === 'groupName' || name === 'description' ? value : parseFloat(value) || value })

    // Clear error if field was touched and now has valid input
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors({ ...errors, [name]: error })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof GroupFormData])
      if (error) newErrors[key as keyof FormErrors] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddMember = () => {
    if (memberInput.trim() && !formData.invitedMembers.includes(memberInput.trim())) {
      setFormData({
        ...formData,
        invitedMembers: [...formData.invitedMembers, memberInput.trim()]
      })
      setMemberInput('')
    }
  }

  const handleRemoveMember = (member: string) => {
    setFormData({
      ...formData,
      invitedMembers: formData.invitedMembers.filter(m => m !== member)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)

    if (!validateForm()) {
      // Announce error to screen readers
      errorSummaryRef.current?.focus()
      return
    }

    setLoading(true)
    try {
      // TODO: Submit form data to smart contract
      // Steps:
      // 1. Validate form data
      // 2. Call create_group on Soroban contract
      // 3. Show success notification
      // 4. Redirect to group detail page
      console.log('Create group:', formData)
      onSuccess?.()
    } catch (err) {
      console.error('Failed to create group:', err)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Create a New Group</h1>
      <p className="text-sm text-gray-600 mb-6">
        Fill out the form below to create a new Ajo group. Fields marked with <span className="text-red-600 font-semibold">*</span> are required.
      </p>

      {hasErrors && (
        <div
          ref={errorSummaryRef}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          tabIndex={-1}
        >
          <h2 className="text-sm font-semibold text-red-800 mb-2">
            {Object.keys(errors).length === 1 ? 'Please fix this error:' : `Please fix ${Object.keys(errors).length} errors:`}
          </h2>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              error && (
                <li key={field}>
                  <a href={`#${field}`} className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-600 rounded px-1">
                    {error}
                  </a>
                </li>
              )
            ))}
          </ul>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="groupName" className="block text-sm font-semibold mb-2">
            Group Name <span className="text-red-600 font-semibold" aria-label="required">*</span>
          </label>
          <input
            ref={groupNameRef}
            id="groupName"
            name="groupName"
            type="text"
            value={formData.groupName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="e.g., Market Women Ajo"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              touched.groupName && errors.groupName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            aria-required="true"
            aria-invalid={touched.groupName && !!errors.groupName}
            aria-describedby={`groupName-help${touched.groupName && errors.groupName ? ' groupName-error' : ''}`}
            required
          />
          <p id="groupName-help" className="mt-2 text-xs text-gray-600">
            Enter a descriptive name for your group (3-100 characters)
          </p>
          {touched.groupName && errors.groupName && (
            <p id="groupName-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
              ⚠️ {errors.groupName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold mb-2">
            Description <span className="text-gray-500 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe your group's purpose..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              touched.description && errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            rows={3}
            aria-invalid={touched.description && !!errors.description}
            aria-describedby={`description-help${touched.description && errors.description ? ' description-error' : ''}`}
          />
          <p id="description-help" className="mt-2 text-xs text-gray-600">
            Provide context about your group&apos;s goals and purpose (max 500 characters)
          </p>
          {touched.description && errors.description && (
            <p id="description-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
              ⚠️ {errors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="cycleLength" className="block text-sm font-semibold mb-2">
              Cycle Length (days) <span className="text-red-600 font-semibold" aria-label="required">*</span>
            </label>
            <input
              id="cycleLength"
              name="cycleLength"
              type="number"
              value={formData.cycleLength}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                touched.cycleLength && errors.cycleLength ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              min="1"
              max="365"
              aria-required="true"
              aria-invalid={touched.cycleLength && !!errors.cycleLength}
              aria-describedby={`cycleLength-help${touched.cycleLength && errors.cycleLength ? ' cycleLength-error' : ''}`}
              required
            />
            <p id="cycleLength-help" className="mt-2 text-xs text-gray-600">
              How many days between each payout cycle (1-365)
            </p>
            {touched.cycleLength && errors.cycleLength && (
              <p id="cycleLength-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
                ⚠️ {errors.cycleLength}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="contributionAmount" className="block text-sm font-semibold mb-2">
              Contribution Amount ($) <span className="text-red-600 font-semibold" aria-label="required">*</span>
            </label>
            <input
              id="contributionAmount"
              name="contributionAmount"
              type="number"
              step="0.01"
              value={formData.contributionAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                touched.contributionAmount && errors.contributionAmount ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              min="0"
              max="1000000"
              aria-required="true"
              aria-invalid={touched.contributionAmount && !!errors.contributionAmount}
              aria-describedby={`contributionAmount-help${touched.contributionAmount && errors.contributionAmount ? ' contributionAmount-error' : ''}`}
              required
            />
            <p id="contributionAmount-help" className="mt-2 text-xs text-gray-600">
              Amount each member must contribute per cycle
            </p>
            {touched.contributionAmount && errors.contributionAmount && (
              <p id="contributionAmount-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
                ⚠️ {errors.contributionAmount}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="maxMembers" className="block text-sm font-semibold mb-2">
            Max Members <span className="text-red-600 font-semibold" aria-label="required">*</span>
          </label>
          <input
            id="maxMembers"
            name="maxMembers"
            type="number"
            value={formData.maxMembers}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              touched.maxMembers && errors.maxMembers ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            min="2"
            max="50"
            aria-required="true"
            aria-invalid={touched.maxMembers && !!errors.maxMembers}
            aria-describedby={`maxMembers-help${touched.maxMembers && errors.maxMembers ? ' maxMembers-error' : ''}`}
            required
          />
          <p id="maxMembers-help" className="mt-2 text-xs text-gray-600">
            Maximum number of members allowed in this group (2-50)
          </p>
          {touched.maxMembers && errors.maxMembers && (
            <p id="maxMembers-error" className="mt-1 text-sm text-red-600 font-medium" role="alert">
              ⚠️ {errors.maxMembers}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'weekly' | 'monthly' })}
              className="w-full px-4 py-2 border rounded-lg"
              required
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Duration (cycles)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="1"
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Invite Members</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMember())}
              placeholder="Enter wallet address, email, or username"
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={handleAddMember}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Add
            </button>
          </div>
          {formData.invitedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.invitedMembers.map((member) => (
                <span
                  key={member}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Group Name:</span>
              <span className="font-medium">{formData.groupName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Frequency:</span>
              <span className="font-medium capitalize">{formData.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium">{formData.duration} cycles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contribution:</span>
              <span className="font-medium">${formData.contributionAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Max Members:</span>
              <span className="font-medium">{formData.maxMembers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Invited Members:</span>
              <span className="font-medium">{formData.invitedMembers.length}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-busy={loading}
          aria-label={loading ? 'Creating group, please wait' : 'Create group'}
        >
          {loading ? 'Creating Group...' : 'Create Group'}
        </button>
      </form>
    </div>
  )
}
