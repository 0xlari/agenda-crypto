"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
  onSuccess?: () => void;
};

export default function ConfirmPresenceButton({ eventId, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleConfirmPresence() {
    try {
      setLoading(true);
      setMessage(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("Faça login para confirmar presença.");
        return;
      }

      if (!navigator.geolocation) {
        setMessage("Seu navegador não suporta geolocalização.");
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
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setConfirmed(false);
              setMessage(data.error || "Erro ao confirmar presença.");
              return;
            }

            setConfirmed(true);
            setMessage(data.message || "Presença confirmada.");
            onSuccess?.();
          } catch (error) {
            console.error(error);
            setConfirmed(false);
            setMessage("Erro ao enviar confirmação.");
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error(error);
          setConfirmed(false);
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
      setConfirmed(false);
      setMessage("Erro ao iniciar confirmação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleConfirmPresence}
        disabled={loading || confirmed}
        className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
          confirmed
            ? "bg-green-500 text-white"
            : "border border-[#EC4899]/30 bg-[#EC4899]/10 text-[#EC4899] hover:bg-[#EC4899] hover:text-white"
        }`}
      >
        {confirmed
          ? "Pass dropado ✓"
          : loading
          ? "Confirmando..."
          : "Confirmar presença"}
      </button>

      {confirmed && (
        <div className="animate-pulse text-center text-sm text-green-400">
          🎟️ Agenda Pass desbloqueado!
        </div>
      )}

      {message && (
        <p className="text-center text-sm text-white/70">{message}</p>
      )}
    </div>
  );
}