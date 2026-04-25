"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
};

export default function EventResponse({ eventId }: Props) {
  const [selected, setSelected] = useState<"going" | "not_going" | null>(null);
  const [loading, setLoading] = useState(false);
  const [goingCount, setGoingCount] = useState(0);

  async function loadCounts() {
    try {
      const response = await fetch("/api/event-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGoingCount(data.going || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem:", error);
    }
  }

  // 🔥 TRACK SAVE
  async function handleSave() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Faça login para salvar eventos.");
        return;
      }

      await fetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
          type: "save",
        }),
      });

      alert("Evento salvo com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    }
  }

  // 🔥 TRACK RSVP
  async function handleResponse(responseType: "going" | "not_going") {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Você precisa estar logada para marcar presença.");
        return;
      }

      // 👉 salva resposta
      const response = await fetch("/api/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: user.id,
          response: responseType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao salvar resposta");
        return;
      }

      // 👉 TRACK (AQUI É O CERTO)
      await fetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
          type: responseType === "going" ? "rsvp_yes" : "rsvp_no",
        }),
      });

      setSelected(responseType);
      await loadCounts();
    } catch (error) {
      console.error("Erro ao responder evento:", error);
      alert("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadCounts();
    }
  }, [eventId]);

  return (
  <div className="mt-4">
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleResponse("going")}
        disabled={loading}
        className={`flex-1 rounded-full px-4 py-2 text-xs font-bold transition ${
          selected === "going"
            ? "bg-[#19B5C9] text-black"
            : "bg-[#19B5C9]/15 text-[#19B5C9] hover:bg-[#19B5C9] hover:text-black"
        }`}
      >
        {loading ? "Salvando..." : "Vou"}
      </button>

      <button
        onClick={handleSave}
        className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white transition hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10 hover:text-[#FFD600]"
      >
        Salvar
      </button>
    </div>

    <p className="mt-3 text-center text-xs text-white/50">
      Vão ao evento: {goingCount} pessoas
    </p>
  </div>
);
}