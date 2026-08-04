"use client";

import { supabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/supabase/auth-fetch";

type Props = {
  eventId: string;
  url: string;
};

export default function RegistrationClickButton({ eventId, url }: Props) {
  async function handleClick() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await authFetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          eventId,
          type: "registration_click",
        }),
      });
    } catch (error) {
      console.error("Erro ao registrar clique de inscrição:", error);
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
    >
      Inscrever-se no evento
    </a>
  );
}
