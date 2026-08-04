"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/supabase/auth-fetch";

type Props = {
  eventId: string;
};

export default function EventViewTracker({ eventId }: Props) {
  useEffect(() => {
    async function trackView() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await authFetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
          type: "view",
        }),
      });
    }

    trackView();
  }, [eventId]);

  return null;
}
