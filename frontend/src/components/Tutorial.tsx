import { useState, useEffect } from 'react'

interface TutorialStep {
  title: string
  description: string
  highlight?: string
}

const steps: TutorialStep[] = [
  {
    title: 'Welcome to Soroban Ajo',
    description: 'A decentralized rotational savings platform on Stellar. Join groups, contribute regularly, and receive payouts in rotation.',
  },
  {
    title: 'Connect Your Wallet',
    description: 'Click the wallet button in the top right to connect your Stellar wallet and start participating.',
    highlight: 'wallet',
  },
  {
    title: 'Create or Join Groups',
    description: 'Create a new savings group or browse existing groups to join. Set contribution amounts and cycle duration.',
    highlight: 'create',
  },
  {
    title: 'Track Your Progress',
    description: 'View your groups, contribution status, and upcoming payouts from the dashboard.',
    highlight: 'dashboard',
  },
]

export function Tutorial() {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Skip
            </button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h2>
        <p className="text-gray-600 mb-6">{step.description}</p>

        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
