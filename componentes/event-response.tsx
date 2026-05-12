"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
};

export default function EventResponse({ eventId }: Props) {
  const [selected, setSelected] = useState<"going" | "not_going" | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goingCount, setGoingCount] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  async function requireLogin() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setFeedback("Faça o login para salvar ou marcar presença na sua agenda.");
      return null;
    }

    return user;
  }

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  }

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

  async function handleSave() {
    try {
      setLoading(true);
      setFeedback(null);

      const user = await requireLogin();

      if (!user) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/track-event", {
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

      if (!response.ok) {
        setFeedback("Não foi possível salvar este evento agora.");
        return;
      }

      setSaved(true);
      setFeedback("Evento salvo na sua Minha Agenda para acompanhar depois.");
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setFeedback("Erro ao salvar evento.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResponse(responseType: "going" | "not_going") {
    try {
      setLoading(true);
      setFeedback(null);

      const user = await requireLogin();

      if (!user) {
        setLoading(false);
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
        setFeedback(data.error || "Erro ao salvar resposta.");
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
          type: responseType === "going" ? "rsvp_yes" : "rsvp_no",
        }),
      });

      setSelected(responseType);
      await loadCounts();

      if (responseType === "going") {
        setFeedback("Você marcou que vai. Veja este evento na sua Minha Agenda.");
      } else {
        setFeedback("Resposta registrada.");
      }
    } catch (error) {
      console.error("Erro ao responder evento:", error);
      setFeedback("Erro ao conectar com o servidor.");
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
  <div className="mt-5 space-y-3">
    <div className="grid grid-cols-[1fr_72px_82px] gap-2">
      <a
        href={`/agenda/${eventId}`}
        className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-bold text-black transition hover:scale-[1.02]"
      >
        Ver evento
      </a>

      <button
        onClick={() => handleResponse("going")}
        disabled={loading}
        className={`inline-flex h-10 items-center justify-center rounded-full text-xs font-bold transition disabled:opacity-60 ${
          selected === "going"
            ? "bg-[#19B5C9] text-black"
            : "border border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#19B5C9] hover:bg-[#19B5C9] hover:text-black"
        }`}
      >
        Vou
      </button>

      <button
        onClick={handleSave}
        disabled={loading}
        className={`inline-flex h-10 items-center justify-center rounded-full text-xs font-bold transition disabled:opacity-60 ${
          saved
            ? "bg-[#FFD600] text-black"
            : "border border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600] hover:bg-[#FFD600] hover:text-black"
        }`}
      >
        {saved ? "Salvo" : "Salvar"}
      </button>
    </div>
  </div>
);
}