'use client';

import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, Step, STATUS } from 'react-joyride';
import { useOnboarding } from '@/hooks/useOnboarding';

const tourSteps: Step[] = [
  {
    target: '[data-tour="wallet-connect"]',
    content: 'Connect your Freighter wallet here to get started with Ajo.',
    disableBeacon: true,
  },
  {
    target: '[data-tour="dashboard"]',
    content: 'View all your groups and their status on the dashboard.',
  },
  {
    target: '[data-tour="create-group"]',
    content: 'Create a new savings group by clicking here.',
  },
  {
    target: '[data-tour="groups-list"]',
    content: 'Browse and join existing groups from the community.',
  },
  {
    target: '[data-tour="profile"]',
    content: 'Manage your profile and settings here.',
  },
];

export default function TourGuide() {
  const { isTourActive, setIsTourActive } = useOnboarding();
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (isTourActive) {
      // Small delay to ensure DOM elements are ready
      setTimeout(() => setRun(true), 500);
    }
  }, [isTourActive]);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      setIsTourActive(false);
    }
  };

  if (!isTourActive) return null;

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#2563eb',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
        },
        buttonNext: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonBack: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        buttonSkip: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
    />
  );
}
