"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { MascotAvatar } from "./MascotAvatar";
import { MascotOnboarding } from "./MascotOnboarding";
import { authFetch } from "@/lib/supabase/auth-fetch";

type Mascot = {
  id: string;
  goal: string;
  vibe: string;
  interests: string[];
  level: number;
  xp: number;
  agenda_pass_count: number;
  selected_traits: Record<string, string>;
};

export function MascotCard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [mascot, setMascot] = useState<Mascot | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  async function loadUserAndMascot() {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserId(null);
        setMascot(null);
        return;
      }

      setUserId(user.id);

      await authFetch("/api/mascot/sync", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: user.id,
        }),
        });

        const response = await authFetch(
        `/api/mascot/onboarding?user_id=${user.id}`
        );

        const data = await response.json();

        if (!response.ok) {
        console.error("Erro ao buscar mascote:", data.error);
        setMascot(null);
        return;
        }

        setMascot(data.mascot);
    } catch (error) {
      console.error("Erro ao carregar mascote:", error);
      setMascot(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserAndMascot();
  }, []);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white/60">
        Carregando sua jornada...
      </div>
    );
  }

  if (!userId) {
    return null;
  }

  if (showOnboarding) {
    return (
      <MascotOnboarding
        userId={userId}
        onCreated={() => {
          setShowOnboarding(false);
          loadUserAndMascot();
        }}
      />
    );
  }

  if (!mascot) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#111] p-5 text-white">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="mb-2 text-sm text-white/50">NOVA EXPERIÊNCIA</p>

            <h2 className="text-2xl font-bold">
              Crie seu mascote da Agenda
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
              Seu mascote acompanha sua rota pelo ecossistema, evolui com seus eventos e ganha novos itens conforme você coleciona Agenda Pass.
            </p>

            <p className="mt-3 text-xs text-white/40">
              Suas escolhas ajudam a Agenda a entender seus interesses 
              e recomendar eventos mais relevantes para você.
            </p>
          </div>

          <button
            onClick={() => setShowOnboarding(true)}
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-black"
          >
            Criar meu mascote
          </button>
        </div>
      </div>
    );
  }

  const nextUnlockText =
    mascot.agenda_pass_count === 0
      ? "Confirme presença em um evento para liberar seu primeiro Agenda Pass."
      : mascot.agenda_pass_count < 3
        ? `Faltam ${3 - mascot.agenda_pass_count} Agenda Pass para desbloquear um novo background.`
        : mascot.agenda_pass_count < 5
          ? `Faltam ${5 - mascot.agenda_pass_count} Agenda Pass para desbloquear um item raro.`
          : "Você já desbloqueou itens especiais. Continue evoluindo sua jornada.";

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111] p-5 text-white">
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <MascotAvatar traits={mascot.selected_traits} size="md" />

        <div>
          <p className="mb-1 text-sm text-white/50">
            Sua jornada na Agenda
          </p>

          <h2 className="text-2xl font-bold">
            Mascote Nível {mascot.level}
          </h2>

          <p className="mt-2 text-sm text-white/70">
            Seu mascote evolui conforme você salva eventos, confirma presença e
            coleciona Agenda Pass.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-white/40">Agenda Pass</p>
              <p className="text-lg font-bold">
                {mascot.agenda_pass_count}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-white/40">XP</p>
              <p className="text-lg font-bold">{mascot.xp}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs text-white/40">Vibe</p>
              <p className="text-lg font-bold capitalize">{mascot.vibe}</p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/70">
            {nextUnlockText}
          </div>
        </div>
      </div>
    </div>
  );
}
