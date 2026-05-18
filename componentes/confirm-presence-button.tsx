"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
  startDate?: string | null;
  endDate?: string | null;
  onSuccess?: () => void;
};

export default function ConfirmPresenceButton({
  eventId,
  startDate,
  endDate,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function checkExistingPresence() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("checkins")
        .select("id")
        .eq("user_id", user.id)
        .eq("event_id", eventId)
        .eq("validated", true)
        .maybeSingle();

      if (data?.id) {
        setConfirmed(true);
      }
    }

    checkExistingPresence();
  }, [eventId]);

  function getEventStatus() {
    if (!startDate) return "available";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate || startDate}T00:00:00`);

    if (today < start) return "before";
    if (today > end) return "after";

    return "during";
  }

  const eventStatus = getEventStatus();
  const canRegisterPresence = eventStatus === "during";

  async function handleConfirmPresence() {
    try {
      setLoading(true);
      setMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Faça login para registrar presença.");
        setConfirmModalOpen(false);
        return;
      }

      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Erro ao registrar presença.");
        return;
      }

      setConfirmed(true);
      setMessage("Você esteve aqui. Agenda Pass desbloqueado.");
      setConfirmModalOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar confirmação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        {confirmed ? (
          <button
            disabled
            className="flex min-h-[52px] w-full items-center justify-center rounded-full border border-[#19B5C9]/30 bg-[#19B5C9] px-4 py-3 text-center text-sm font-black text-black disabled:opacity-90"
          >
            Você esteve aqui ✓
          </button>
        ) : canRegisterPresence ? (
          <div className="group relative w-full">
            <button
              onClick={() => setConfirmModalOpen(true)}
              disabled={loading}
              className="flex min-h-[52px] w-full items-center justify-center rounded-full border border-[#EC4899]/30 bg-[#EC4899] px-4 py-3 text-center text-sm font-black text-white transition active:scale-[0.98] hover:brightness-110 disabled:opacity-70"
            >
              Registrar presença
            </button>

            <div className="pointer-events-none absolute -top-16 left-1/2 z-20 hidden w-[240px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#212121] px-4 py-3 text-center text-[11px] leading-relaxed text-white/65 shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-hover:block">
              Registre sua presença apenas se você realmente estiver no evento.
            </div>
          </div>
        ) : (
          <div className="group relative w-full">
            <button
              disabled
              className="flex min-h-[52px] w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-bold text-white/45"
            >
              Check-in no dia do evento
            </button>

            <div className="pointer-events-none absolute -top-16 left-1/2 z-20 hidden w-[250px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#212121] px-4 py-3 text-center text-[11px] leading-relaxed text-white/65 shadow-[0_12px_40px_rgba(0,0,0,0.45)] group-hover:block">
              No dia do evento, volte aqui para registrar que você realmente foi.
            </div>
          </div>
        )}

        {message && (
          <p className="text-center text-xs leading-relaxed text-white/55">
            {message}
          </p>
        )}
      </div>

      {mounted &&
        confirmModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
            <div className="relative w-full max-w-[390px] overflow-hidden rounded-[32px] border border-[#EC4899]/20 bg-[#212121] p-6 text-center text-white shadow-[0_20px_100px_rgba(0,0,0,0.75)]">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#EC4899]/15 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#19B5C9]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#EC4899]/25 bg-[#EC4899]/10 text-2xl">
                  🎟️
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#EC4899]">
                  Agenda Pass
                </p>

                <h3 className="mt-3 text-2xl font-black leading-tight">
                  Registrar presença
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  Registre sua presença apenas se você realmente estiver no evento.
                </p>

                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs leading-6 text-white/55">
                    Em breve, essa etapa será validada por localização. Por enquanto,
                    ela ajuda a manter seus Agenda Pass mais confiáveis.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleConfirmPresence}
                    disabled={loading}
                    className="rounded-full bg-[#EC4899] px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-60"
                  >
                    {loading ? "Registrando..." : "Estou no evento"}
                  </button>

                  <button
                    onClick={() => setConfirmModalOpen(false)}
                    disabled={loading}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/55 transition hover:text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}