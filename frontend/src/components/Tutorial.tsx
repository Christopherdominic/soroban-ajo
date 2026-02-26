import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'

interface TutorialStep {
  title: string
  description: string
  highlight?: string
}

const steps: TutorialStep[] = [
  {
    title: 'Welcome to Soroban Ajo',
    description:
      'A decentralized rotational savings platform on Stellar. Join groups, contribute regularly, and receive payouts in rotation.',
  },
  {
    title: 'Connect Your Wallet',
    description:
      'Click the wallet button in the top right to connect your Stellar wallet and start participating.',
    highlight: 'wallet',
  },
  {
    title: 'Create or Join Groups',
    description:
      'Create a new savings group or browse existing groups to join. Set contribution amounts and cycle duration.',
    highlight: 'create',
  },
  {
    title: 'Track Your Progress',
    description: 'View your groups, contribution status, and upcoming payouts from the dashboard.',
    highlight: 'dashboard',
  },
]

export function Tutorial() {
  const { resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setIsOpen(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleClose()
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  if (!isOpen) return null

  const step = steps[currentStep]

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      data-theme={resolvedTheme}
    >
      <div className="theme-surface rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-sm"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Skip
            </button>
          </div>
          <div className="w-full rounded-full h-2" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
                background: 'var(--color-primary)',
              }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
          {step.title}
        </h2>
        <p className="mb-6" style={{ color: 'var(--color-text-muted)' }}>
          {step.description}
        </p>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded"
              style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            >
              Back
            </button>
          )}
          <button onClick={handleNext} className="flex-1 theme-btn">
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
