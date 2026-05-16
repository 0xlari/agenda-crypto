"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
  onSuccess?: () => void;
};

export default function ConfirmPresenceButton({ eventId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleConfirmPresence() {
    try {
      setLoading(true);
      setMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Faça login para confirmar presença.");
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
        setMessage(data.error || "Erro ao confirmar presença.");
        return;
      }

      setConfirmed(true);
      setMessage(data.message || "Presença confirmada.");
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
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setConfirmModalOpen(true)}
          disabled={loading || confirmed}
          className={`
            flex min-h-[52px] w-full items-center justify-center rounded-full px-4 py-3
            text-center text-sm font-black transition active:scale-[0.98] disabled:opacity-70
            ${
              confirmed
                ? "border border-[#19B5C9]/30 bg-[#19B5C9] text-black"
                : "border border-[#EC4899]/30 bg-[#EC4899] text-white hover:brightness-110"
            }
          `}
        >
          {confirmed ? "Você esteve aqui ✓" : "Confirmar presença"}
        </button>

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
                  Confirmar presença
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/65">
                  Confirme apenas se você realmente estiver no evento.
                </p>

                <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs leading-6 text-white/55">
                    Em breve, a confirmação será validada por localização. Por enquanto,
                    essa etapa ajuda a manter seus Agenda Pass mais confiáveis.
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleConfirmPresence}
                    disabled={loading}
                    className="rounded-full bg-[#EC4899] px-5 py-3 text-sm font-black text-white transition hover:brightness-110 disabled:opacity-60"
                  >
                    {loading ? "Confirmando..." : "Estou no evento"}
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