"use client";

import { supabase } from "@/lib/supabase/client";

export async function authorizedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return new Response(JSON.stringify({ error: "Autenticação obrigatória." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${data.session.access_token}`);

  return fetch(input, { ...init, headers });
}
