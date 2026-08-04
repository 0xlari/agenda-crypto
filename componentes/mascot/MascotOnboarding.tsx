"use client";

import { useState } from "react";
import { MascotAvatar } from "./MascotAvatar";
import { getInitialTraits } from "@/lib/mascot/getInitialMascot";
import { authFetch } from "@/lib/supabase/auth-fetch";

type MascotOnboardingProps = {
  userId: string;
  onCreated?: () => void;
};

const goals = [
  {
    id: "learn",
    title: "Aprender sobre o mercado",
    description: "Para acompanhar tendências, conceitos e novidades.",
  },
  {
    id: "network",
    title: "Fazer networking",
    description: "Para conhecer pessoas, comunidades e oportunidades.",
  },
  {
    id: "opportunities",
    title: "Encontrar oportunidades",
    description: "Para descobrir vagas, negócios, parcerias e projetos.",
  },
  {
    id: "build",
    title: "Construir projetos",
    description: "Para participar de hackathons, builders e produtos.",
  },
  {
    id: "invest",
    title: "Investir melhor",
    description: "Para acompanhar mercado, DeFi, Bitcoin e narrativas.",
  },
  {
    id: "community",
    title: "Conhecer comunidades",
    description: "Para se conectar com meetups e movimentos locais.",
  },
  {
    id: "main_events",
    title: "Ir nos principais eventos",
    description: "Para não perder conferências e encontros importantes.",
  },
];

const interestsOptions = [
  "Bitcoin",
  "Ethereum",
  "Web3",
  "DeFi",
  "IA + Blockchain",
  "Games",
  "NFTs",
  "Startups",
  "Carreira",
  "Regulação",
  "Comunidades",
  "Hackathons",
  "Stablecoins",
  "Tokenização",
  "Segurança",
  "Mulheres em Web3",
];

const vibes = [
  {
    id: "street",
    title: "Street",
    description: "Urbano, marcante e cheio de presença.",
  },
  {
    id: "cyber",
    title: "Cyber",
    description: "Digital, intenso e com energia web3.",
  },
  {
    id: "cute",
    title: "Cute",
    description: "Leve, carismático e divertido.",
  },
  {
    id: "futuristic",
    title: "Futurista",
    description: "Tecnológico, brilhante e explorador.",
  },
  {
    id: "minimal",
    title: "Minimalista",
    description: "Limpo, direto e elegante.",
  },
  {
    id: "surprise",
    title: "Surpresa",
    description: "A Agenda monta uma combinação para você.",
  },
];

export function MascotOnboarding({
  userId,
  onCreated,
}: MascotOnboardingProps) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [vibe, setVibe] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest]
    );
  }

  async function createMascot() {
    if (!goal || !vibe || !userId) return;

    setLoading(true);

    try {
      const response = await authFetch("/api/mascot/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          goal,
          vibe,
          interests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro da API ao criar mascote:", data);
        throw new Error(data.error || "Erro ao criar mascote");
      }

      onCreated?.();
    } catch (error) {
      console.error("Erro ao criar mascote:", error);
      alert("Não foi possível criar seu mascote agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111] p-5 text-white shadow-xl">
      {step === 0 && (
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm text-white/50">Agenda Crypto</p>
            <h2 className="text-2xl font-bold">
              Seu companheiro de jornada no ecossistema
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Cada evento conta um pedaço da sua trajetória. Crie seu mascote para acompanhar sua evolução, 
              colecionar Agenda Pass e desbloquear itens conforme você participa dos encontros do mercado.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            Suas respostas ajudam a personalizar 
            sua experiência e melhorar suas recomendações.
          </div>

          <button
            onClick={() => setStep(1)}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black"
          >
            Começar
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">
              O que você mais busca nos eventos crypto?
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Isso ajuda a Agenda a entender sua jornada e indicar eventos mais relevantes para você.
            </p>
          </div>

          <div className="grid gap-3">
            {goals.map((item) => (
              <button
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  goal === item.id
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <p className="font-semibold">{item.title}</p>
                <p
                  className={`mt-1 text-sm ${
                    goal === item.id ? "text-black/70" : "text-white/50"
                  }`}
                >
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          <button
            disabled={!goal}
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">
              Quais temas devem guiar seu mascote?
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Escolha os assuntos que você quer acompanhar de perto na Agenda Crypto.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {interestsOptions.map((item) => {
              const selected = interests.includes(item);

              return (
                <button
                  key={item}
                  onClick={() => toggleInterest(item)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    selected
                      ? "border-white bg-white text-black"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-white/40">
            Você pode mudar seus interesses depois.
          </p>

          <button
            disabled={interests.length === 0}
            onClick={() => setStep(3)}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold">
              Qual vibe combina com sua jornada?
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Essa escolha define o visual inicial do seu mascote.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {vibes.map((item) => (
              <button
                key={item.id}
                onClick={() => setVibe(item.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  vibe === item.id
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                <p className="font-semibold">{item.title}</p>
                <p
                  className={`mt-1 text-sm ${
                    vibe === item.id ? "text-black/70" : "text-white/50"
                  }`}
                >
                  {item.description}
                </p>
              </button>
            ))}
          </div>

          <button
            disabled={!vibe}
            onClick={() => setStep(4)}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            Gerar meu mascote
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-5 text-center">
          <div className="flex justify-center">
            <MascotAvatar traits={getInitialTraits(vibe as any)} size="lg" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Seu mascote nasceu</h2>
            <p className="mt-2 text-sm text-white/60">
              Ele começa no nível 1 e evolui conforme você confirma presença, 
              coleciona Agenda Pass e escolhe novos caminhos 
              dentro do ecossistema.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p>Nível 1</p>
            <p>Agenda Pass: 0</p>
            <p>Vibe: {vibe}</p>
          </div>

          <button
            disabled={loading}
            onClick={createMascot}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar mascote"}
          </button>
        </div>
      )}
    </div>
  );
}
