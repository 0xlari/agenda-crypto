"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

type OnboardingContextValue = {
  wizardCompleted: boolean;
  tourSeen: Record<string, boolean>;
  completeWizard: () => void;
  skipWizard: () => void;
  markTourSeen: (pageId: string) => void;
  resetOnboarding: () => void;
  isMounted: boolean;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [tourSeen, setTourSeen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // O onboarding reinicia a cada carregamento da aplicação.
    setWizardCompleted(false);
    setTourSeen({});
    setIsMounted(true);
  }, []);

  const completeWizard = useCallback(() => {
    setWizardCompleted(true);
  }, []);

  const skipWizard = useCallback(() => {
    setWizardCompleted(true);
  }, []);

  const markTourSeen = useCallback((pageId: string) => {
    setTourSeen((prev) => {
      return { ...prev, [pageId]: true };
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setWizardCompleted(false);
    setTourSeen({});
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        wizardCompleted,
        tourSeen,
        completeWizard,
        skipWizard,
        markTourSeen,
        resetOnboarding,
        isMounted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
