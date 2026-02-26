import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  currentStep: number;
  isOnboardingActive: boolean;
  isTourActive: boolean;
  setHasCompletedOnboarding: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
  setIsOnboardingActive: (active: boolean) => void;
  setIsTourActive: (active: boolean) => void;
  startOnboarding: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  replayTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      currentStep: 0,
      isOnboardingActive: false,
      isTourActive: false,

      setHasCompletedOnboarding: (completed) =>
        set({ hasCompletedOnboarding: completed }),

      setCurrentStep: (step) => set({ currentStep: step }),

      setIsOnboardingActive: (active) => set({ isOnboardingActive: active }),

      setIsTourActive: (active) => set({ isTourActive: active }),

      startOnboarding: () =>
        set({ isOnboardingActive: true, currentStep: 0 }),

      skipOnboarding: () =>
        set({
          isOnboardingActive: false,
          hasCompletedOnboarding: true,
          currentStep: 0,
        }),

      completeOnboarding: () =>
        set({
          isOnboardingActive: false,
          hasCompletedOnboarding: true,
          currentStep: 0,
        }),

      replayTutorial: () =>
        set({
          isOnboardingActive: true,
          isTourActive: true,
          currentStep: 0,
        }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(0, state.currentStep - 1),
        })),
    }),
    {
      name: 'ajo-onboarding-storage',
    }
  )
);
