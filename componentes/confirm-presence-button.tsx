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
  const [checked, setChecked] = useState(false)

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

      if (!navigator.geolocation) {
        setMessage("Seu navegador não suporta geolocalização.");
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const response = await fetch("/api/checkin", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user.id,
                eventId,
                lat,
                lng,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setMessage(data.error || "Erro ao confirmar presença.");
              return;
            }

            setMessage(data.message || "Presença confirmada.");
            onSuccess?.();
          } catch (error) {
            console.error(error);
            setMessage("Erro ao enviar confirmação.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error(error);
          setLoading(false);
          setMessage("Não foi possível obter sua localização.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMessage("Erro ao iniciar confirmação.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
        <button
            onClick={handleConfirmPresence}
            disabled={loading || checked}
            className="inline-flex items-center justify-center rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-4 py-2.5 text-sm font-semibold text-[#EC4899] transition hover:bg-[#EC4899] hover:text-white disabled:opacity-60"
      >
            {checked ? "Presença confirmada ✓" : loading ? "Confirmando..." : "Confirmar presença"}
        </button>
        
      {message && (
        <p className="text-center text-sm text-white/70">
          {message}
        </p>
      )}
    </div>
  );
}