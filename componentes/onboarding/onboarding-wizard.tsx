"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useOnboarding } from "./onboarding-context";

type Step = {
  badge: string;
  title: string;
  description: string;
  highlight: string;
  cta?: string;
  ctaHref?: string;
};

const STEPS: Step[] = [
  {
    badge: "Bem-vindo",
    title: "A agenda viva do mercado cripto",
    description:
      "Acompanhe os eventos, encontros e experiências que movimentam o ecossistema blockchain, de meetups locais a conferências internacionais.",
    highlight: "Se tem data, tá na agenda.",
  },
  {
    badge: "Explore",
    title: "Encontre onde o mercado acontece",
    description:
      "Use busca, filtros e tags para descobrir eventos por cidade, categoria, formato e interesse. A Agenda te ajuda a achar o encontro certo sem perder tempo.",
    highlight: "Filtre por tema, cidade ou formato e monte sua rota.",
    cta: "Ver agenda",
    ctaHref: "/agenda",
  },
  {
    badge: "Minha Agenda",
    title: "Monte sua rota no ecossistema",
    description:
          "Salve eventos, marque onde você pretende ir e organize tudo em um só lugar. A Minha Agenda acompanha sua jornada pelos encontros que importam para você.",
    highlight:    "Adicione ao Google Calendar e desbloqueie Agenda Pass ao confirmar presença.",
  },
  {
    badge: "Divulgação",
    title: "Coloque seu evento no radar da comunidade",
    description:
      "Cadastre seu meetup, side event, conferência ou experiência web3 para passar pela curadoria da Agenda Crypto e alcançar quem realmente circula no ecossistema.",
    highlight: "Cadastro rápido. Visibilidade para a audiência certa.",
    cta: "Divulgar evento",
    ctaHref: "/divulgacao",
  },
  {
    badge: "Newsletter",
    title: "Receba a curadoria antes de todo mundo",
    description:
      "Assine a newsletter da Agenda Crypto e acompanhe os principais eventos, oportunidades e movimentos do mercado direto no seu e-mail.",
    highlight: "Pronto. Agora é só entrar no fluxo do ecossistema.",
  },
];

const BADGE_COLORS: Record<string, string> = {
  "Bem-vindo": "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#19B5C9]",
  Explore: "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#A08800]",
  "Minha Agenda": "border-[#EC4899]/30 bg-[#EC4899]/10 text-[#EC4899]",
  "Divulgação": "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#19B5C9]",
  Newsletter: "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#A08800]",
};

export default function OnboardingWizard() {
  const {
    isInitialized,
    isMounted,
    wizardCompleted,
    completeWizard,
    skipWizard,
  } = useOnboarding();

  const [phase, setPhase] = useState<"question" | "tour">("question");
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  useEffect(() => {
    if (!isInitialized || !isMounted) return;

    if (!wizardCompleted) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [isInitialized, isMounted, wizardCompleted]);

  if (!isInitialized || wizardCompleted) return null;
  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function goTo(nextStep: number, dir: "next" | "prev") {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 180);
  }

  function handleNext() {
    if (isLast) {
      handleClose();
    } else {
      goTo(step + 1, "next");
    }
  }

  function handleBack() {
    if (step > 0) goTo(step - 1, "prev");
  }

  function handleClose() {
    setVisible(false);
    setTimeout(completeWizard, 300);
  }

  function handleSkip() {
    setVisible(false);
    setTimeout(skipWizard, 300);
  }

  function handleAlreadyKnows() {
    setVisible(false);
    setTimeout(skipWizard, 300);
  }

  function handleStartTour() {
    setPhase("tour");
  }

  const translateClass = animating
    ? direction === "next"
      ? "-translate-x-4 opacity-0"
      : "translate-x-4 opacity-0"
    : "translate-x-0 opacity-100";

  return (
    <>
      <div
        className="fixed inset-0 z-9998 bg-black/70 backdrop-blur-sm"
        onClick={handleSkip}
      />

      <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#1A1A1A] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1 w-full bg-linear-to-r from-[#19B5C9] via-[#FFD600] to-[#EC4899]" />

          {phase === "question" ? (
            <div className="flex flex-col items-center px-6 pb-8 pt-8 text-center">
              <div className="relative mb-6 h-24 w-64">
                <Image
                  src="/images/logo.png"
                  alt="Agenda Crypto"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <h2 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                Boas-vindas à<br />Agenda Crypto
              </h2>

              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
                 Em menos de um minuto, veja como descobrir eventos, montar sua rota e acompanhar onde o mercado acontece.
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleAlreadyKnows}
                  className="flex-1 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/60 transition hover:border-white/20 hover:text-white/90"
                >
                  Já conheço
                </button>
                <button
                  onClick={handleStartTour}
                  className="flex-1 rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#ffe44c] hover:scale-[1.02]"
                >
                  Me mostre! →
                </button>
              </div>

              <button
                onClick={handleSkip}
                className="mt-4 text-xs font-medium text-white/25 transition hover:text-white/50"
              >
                Pular
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 pt-5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    Agenda Crypto
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                    {step + 1} / {STEPS.length}
                  </span>
                </div>
                <button
                  onClick={handleSkip}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white/35 transition hover:text-white/60"
                >
                  Pular
                </button>
              </div>

              <div
                className={`px-6 pb-2 pt-5 transition-all duration-180 ${translateClass}`}
              >
                <div className="mb-5 flex items-center gap-4">
                  <div className="relative h-10 w-28 shrink-0">
                    <Image
                      src="/images/logo.png"
                      alt="Agenda Crypto"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${BADGE_COLORS[current.badge]}`}
                  >
                    {current.badge}
                  </span>
                </div>

                <h2 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                  {current.title}
                </h2>

                <p className="mt-3 text-sm leading-relaxed text-white/62 sm:text-base">
                  {current.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/8 px-4 py-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#19B5C9]" />
                  <p className="text-[13px] font-medium text-[#19B5C9]">
                    {current.highlight}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i, i > step ? "next" : "prev")}
                    className={`rounded-full transition-all duration-300 ${
                      i === step
                        ? "w-6 h-2 bg-[#19B5C9]"
                        : i < step
                        ? "w-2 h-2 bg-[#19B5C9]/40"
                        : "w-2 h-2 bg-white/15"
                    }`}
                    aria-label={`Ir para passo ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 px-6 py-5">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/50 transition hover:border-white/20 hover:text-white/80 disabled:opacity-0 disabled:pointer-events-none"
                >
                  ← Anterior
                </button>

                <div className="flex items-center gap-2">
                  {current.cta && current.ctaHref && (
                    <a
                      href={current.ctaHref}
                      onClick={handleClose}
                      className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 transition hover:border-[#19B5C9]/30 hover:text-[#19B5C9]"
                    >
                      {current.cta} →
                    </a>
                  )}
                  <button
                    onClick={handleNext}
                    className="rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#ffe44c] hover:scale-[1.02]"
                  >
                    {isLast ? "Começar ✓" : "Próximo →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
