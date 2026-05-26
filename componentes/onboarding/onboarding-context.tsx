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

/**
 * Função helper para ler estado inicial do localStorage
 * Executada ANTES do render, durante a inicialização
 */
function getInitialState(): {
  wizardCompleted: boolean;
  tourSeen: Record<string, boolean>;
} {
  if (typeof window === "undefined") {
    return { wizardCompleted: false, tourSeen: {} };
  }

  const savedWizardCompleted = localStorage.getItem(WIZARD_STORAGE_KEY) === "true";
  
  let savedToursSeen: Record<string, boolean> = {};
  const toursData = localStorage.getItem(TOURS_STORAGE_KEY);
  if (toursData) {
    try {
      savedToursSeen = JSON.parse(toursData);
    } catch {
      savedToursSeen = {};
    }
  }

  return { wizardCompleted: savedWizardCompleted, tourSeen: savedToursSeen };
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Inicializar com estado do localStorage IMEDIATAMENTE
  const initialState = getInitialState();
  const [wizardCompleted, setWizardCompleted] = useState(initialState.wizardCompleted);
  const [tourSeen, setTourSeen] = useState<Record<string, boolean>>(initialState.tourSeen);

  // Apenas marca como mounted, sem resetar o estado
  useEffect(() => {
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
