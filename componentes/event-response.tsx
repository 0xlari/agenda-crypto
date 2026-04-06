"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ResponseType = "going" | "not_going" | null;

export default function EventResponse({ eventId }: { eventId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<ResponseType>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  let mounted = true;

  async function loadResponse() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!mounted) return;

    if (!user) {
      setUserId(null);
      return;
    }

    setUserId(user.id);

    const { data } = await supabase
      .from("event_responses")
      .select("response")
      .eq("user_id", user.id)
      .eq("event_id", eventId)
      .maybeSingle();

    if (!mounted) return;

    if (data?.response) {
      setSelected(data.response as ResponseType);
    }
  }

    loadResponse();

    return () => {
      mounted = false;
    };
  }, [eventId]);

  const handleResponse = async (response: "going" | "not_going") => {
    if (!userId) {
      alert("Faça login para marcar eventos.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/event-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          event_id: eventId,
          response,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Erro ao salvar resposta.");
        return;
      }

      setSelected(response);
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center gap-2">
      <button
        disabled={loading}
        onClick={() => handleResponse("going")}
        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
          selected === "going"
            ? "bg-[#19B5C9] text-black"
            : "border border-[#19B5C9]/25 bg-[#19B5C9]/10 text-[#19B5C9]"
        } ${loading ? "opacity-60" : ""}`}
      >
        {selected === "going" ? "Vou ✓" : "Vou"}
      </button>

      <button
        disabled={loading}
        onClick={() => handleResponse("not_going")}
        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
          selected === "not_going"
            ? "bg-[#EC4899] text-white"
            : "border border-white/10 bg-white/[0.04] text-white/70"
        } ${loading ? "opacity-60" : ""}`}
      >
        {selected === "not_going" ? "Não vou ✓" : "Não vou"}
      </button>
    </div>
  );
}