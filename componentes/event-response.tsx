"use client";

import { useState } from "react";

export default function EventResponse({
  eventId,
}: {
  eventId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<"going" | "not_going" | null>(null);

  async function handleResponse(type: "going" | "not_going") {
    setLoading(true);

    try {
      await fetch("/api/respond", {
        method: "POST",
        body: JSON.stringify({
          event_id: eventId,
          response: type,
        }),
      });

      setSelected(type);
    } catch {
      console.error("Erro ao responder");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => handleResponse("going")}
        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
          selected === "going"
            ? "bg-[#19B5C9] text-black"
            : "border border-[#19B5C9]/25 bg-[#19B5C9]/10 text-[#19B5C9]"
        }`}
      >
        Vou
      </button>

      <button
        disabled={loading}
        onClick={() => handleResponse("not_going")}
        className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
          selected === "not_going"
            ? "bg-[#EC4899] text-white"
            : "border border-white/10 bg-white/[0.04] text-white/70"
        }`}
      >
        Não vou
      </button>
    </div>
  );
}