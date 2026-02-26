'use client';

import { useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';

const onboardingSteps = [
  {
    title: 'Welcome to Ajo!',
    description:
      'Ajo is a decentralized savings group platform. Save together, grow together with blockchain transparency.',
    icon: '👋',
  },
  {
    title: 'Connect Your Wallet',
    description:
      'Connect your Freighter wallet to get started. Your wallet is your identity and holds your funds securely.',
    icon: '👛',
  },
  {
    title: 'Create or Join a Group',
    description:
      'Start your own savings group or join an existing one. Set contribution amounts and cycle duration.',
    icon: '👥',
  },
  {
    title: 'Make Contributions',
    description:
      'Contribute your fixed amount each cycle. All transactions are recorded on the blockchain.',
    icon: '💰',
  },
  {
    title: 'Receive Payouts',
    description:
      'Members take turns receiving the full pool. Everyone gets their turn until the cycle completes.',
    icon: '🎉',
  },
];

export default function Onboarding() {
  const {
    isOnboardingActive,
    currentStep,
    skipOnboarding,
    completeOnboarding,
    nextStep,
    prevStep,
  } = useOnboarding();

  const [showVideo, setShowVideo] = useState(false);

  if (!isOnboardingActive) return null;

  const step = onboardingSteps[currentStep];
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Getting Started
            </h2>
            <button
              onClick={skipOnboarding}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Skip Tutorial
            </button>
          </div>
          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep
                    ? 'bg-blue-600'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-6">{step.icon}</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
            {step.description}
          </p>

          {/* Video Tutorial Link */}
          {currentStep === 0 && (
            <button
              onClick={() => setShowVideo(!showVideo)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-4"
            >
              {showVideo ? 'Hide' : 'Watch'} Video Tutorial
            </button>
          )}

          {showVideo && currentStep === 0 && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Ajo Tutorial"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              onClick={skipOnboarding}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isLastStep ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
