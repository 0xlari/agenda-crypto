"use client";

import { useState, useEffect } from "react";
import { useOnboarding } from "./onboarding-context";

export type TourStep = {
  title: string;
  description: string;
  icon?: string;
};

export type PageTourLabels = {
  openTip: string;
  tour: string;
  minimize: string;
  close: string;
  skip: string;
  finish: string;
  next: string;
};

type PageTourProps = {
  pageId: string;
  steps: TourStep[];
  labels?: PageTourLabels;
};

const defaultLabels: PageTourLabels = {
  openTip: "Abrir dica",
  tour: "Tour rápido",
  minimize: "Minimizar",
  close: "Fechar",
  skip: "Pular tour",
  finish: "Concluir ✓",
  next: "Próximo →",
};

export default function PageTour({
  pageId,
  steps,
  labels = defaultLabels,
}: PageTourProps) {
  const { tourSeen, markTourSeen, wizardCompleted, isMounted } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const copy = { ...defaultLabels, ...labels };

  const storageKey = `agenda-tour-${pageId}`;

  useEffect(() => {
    if (!isMounted || !wizardCompleted) return;

    const localSeen =
      typeof window !== "undefined"
        ? localStorage.getItem(storageKey) === "true"
        : false;

    const contextSeen = Boolean(tourSeen[pageId]);

    if (!localSeen && !contextSeen) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, [isMounted, wizardCompleted, tourSeen, pageId, storageKey]);

  if (!isMounted || !visible) return null;

  const total = steps.length;
  const current = steps[currentStep];
  const isLast = currentStep === total - 1;

  function finishTour() {
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, "true");
    }

    markTourSeen(pageId);
    setVisible(false);
    setLeaving(false);
  }

  function handleNext() {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleClose() {
    setLeaving(true);

    setTimeout(() => {
      finishTour();
    }, 300);
  }

  const containerClass = `
    transition-all duration-300
    ${leaving ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}
    ${minimized ? "w-12 h-12" : "w-72 sm:w-80"}
  `;

  return (
    <div className="fixed bottom-6 right-4 z-9000 sm:bottom-8 sm:right-6">
      <div
        className={`${containerClass} overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-[0_16px_48px_rgba(0,0,0,0.5)]`}
      >
        {minimized ? (
          <button
            onClick={() => setMinimized(false)}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1A1A] text-[#19B5C9] transition hover:bg-[#19B5C9]/10"
            aria-label={copy.openTip}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-white/6 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#19B5C9]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40">
                  {copy.tour}
                </span>
                <span className="text-[10px] text-white/25">
                  {currentStep + 1}/{total}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized(true)}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition hover:bg-white/6 hover:text-white/60"
                  aria-label={copy.minimize}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M5 12h14" />
                  </svg>
                </button>

                <button
                  onClick={handleClose}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition hover:bg-white/6 hover:text-white/60"
                  aria-label={copy.close}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-4 py-3.5">
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#19B5C9]" />
                <span className="h-2 w-2 rounded-full bg-[#FFD600]" />
                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
                <h4 className="ml-1 text-sm font-bold leading-tight text-white">
                  {current.title}
                </h4>
              </div>

              <p className="text-xs leading-relaxed text-white/55">
                {current.description}
              </p>
            </div>

            <div className="px-4 pb-1">
              <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/6">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#19B5C9] to-[#19B5C9]/60 transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={handleClose}
                className="text-[11px] font-medium text-white/30 transition hover:text-white/55"
              >
                {copy.skip}
              </button>

              <button
                onClick={handleNext}
                className="rounded-full bg-[#19B5C9] px-4 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#149caf]"
              >
                {isLast ? copy.finish : copy.next}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
