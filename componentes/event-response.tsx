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

  async function handleResponse(responseType: "going" | "not_going") {
    try {
      setLoading(true);

      const userResult = await supabase.auth.getUser();
      const user = userResult.data.user;

      console.log("USUÁRIO LOGADO:", user);
      console.log("EVENT ID ENVIADO:", eventId);
      console.log("RESPONSE ENVIADA:", responseType);

      if (!user) {
        alert("Você precisa estar logada para marcar presença.");
        return;
      }

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
              : "bg-white/10 text-white"
          }`}
        >
          Vou
        </button>

        <button
          onClick={() => handleResponse("not_going")}
          disabled={loading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            selected === "not_going"
              ? "bg-white text-black"
              : "bg-white/10 text-white"
          }`}
        >
          Não vou
        </button>
      </div>

      <p className="mt-2 text-sm text-white/70">
        Vão ao evento: {goingCount} pessoas
      </p>
    </div>
  );
}