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

const WIZARD_STORAGE_KEY = "agenda-wizard-completed";
const TOURS_STORAGE_KEY = "agenda-tours-seen";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [tourSeen, setTourSeen] = useState<Record<string, boolean>>({});

  // Restaurar estado do localStorage na inicialização
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Restaurar wizard completado
    const savedWizardCompleted = localStorage.getItem(WIZARD_STORAGE_KEY) === "true";
    setWizardCompleted(savedWizardCompleted);

    // Restaurar tours vistos
    const savedToursSeen = localStorage.getItem(TOURS_STORAGE_KEY);
    if (savedToursSeen) {
      try {
        setTourSeen(JSON.parse(savedToursSeen));
      } catch {
        // Se falhar ao parsear, começa com estado vazio
        setTourSeen({});
      }
    }

    setIsMounted(true);
  }, []);

  const completeWizard = useCallback(() => {
    setWizardCompleted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(WIZARD_STORAGE_KEY, "true");
    }
  }, []);

  const skipWizard = useCallback(() => {
    setWizardCompleted(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(WIZARD_STORAGE_KEY, "true");
    }
  }, []);

  const markTourSeen = useCallback((pageId: string) => {
    setTourSeen((prev) => {
      const updated = { ...prev, [pageId]: true };
      // Persistir no localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(TOURS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const resetOnboarding = useCallback(() => {
    setWizardCompleted(false);
    setTourSeen({});
    if (typeof window !== "undefined") {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      localStorage.removeItem(TOURS_STORAGE_KEY);
    }
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
