"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
  onSuccess?: () => void;
};

export default function ConfirmPresenceButton({ eventId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmStep, setConfirmStep] = useState(false);

  async function handleConfirmPresence() {
    try {
      setLoading(true);
      setMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Faça login para confirmar presença.");
        setLoading(false);
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

      setMessage(data.message || "Presença confirmada.");
      onSuccess?.();
      setConfirmStep(false);
    } catch (error) {
      console.error(error);
      setMessage("Erro ao enviar confirmação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {!confirmStep ? (
        <button
          onClick={() => setConfirmStep(true)}
          className="inline-flex items-center justify-center rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-4 py-2.5 text-sm font-semibold text-[#EC4899] transition hover:bg-[#EC4899] hover:text-white"
        >
          Confirmar presença
        </button>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
          <p className="text-sm font-medium text-white/80">
            Confirme presença apenas se você estiver realmente no evento.
          </p>

          <p className="mt-2 text-xs leading-relaxed text-white/40">
            Em breve, a confirmação será validada por localização.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleConfirmPresence}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-full bg-[#EC4899] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Confirmando..." : "Estou no evento"}
            </button>

            <button
              onClick={() => setConfirmStep(false)}
              disabled={loading}
              className="text-xs text-white/40 transition hover:text-white/70"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {message && (
        <p className="text-center text-sm text-white/70">
          {message}
        </p>
      )}
    </div>
  );
}