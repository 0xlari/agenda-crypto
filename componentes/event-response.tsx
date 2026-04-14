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
      <div className="flex gap-3">
        <button
          onClick={() => handleResponse("going")}
          disabled={loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === "going"
              ? "bg-[#19B5C9] text-black"
              : "bg-white/10 text-white hover:bg-[#19B5C9] hover:text-white"
          }`}
        >
          Vou
        </button>

        <button
          onClick={() => handleResponse("not_going")}
          disabled={loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === "not_going"
              ? "bg-[#EC4899] text-white"
              : "bg-white/10 text-white hover:bg-[#EC4899] hover:text-white"
          }`}
        >
          Não vou
        </button>
      </div>

      <button
        onClick={handleSave}
        className="mt-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        Salvar
      </button>

      <p className="mt-2 text-sm text-white/70">
        Vão ao evento: {goingCount} pessoas
      </p>
    </div>
  );
}