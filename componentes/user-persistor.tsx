"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/supabase/auth-fetch";

export default function UserPersistor() {
  useEffect(() => {
    async function persistUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await authFetch("/api/save-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url || "",
        }),
      });
    }

    persistUser();
  }, []);

  return null;
}
