import "server-only";

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

export async function authorizeUser(request: Request, claimedUserId?: string | null) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);

  if (!match) return { error: jsonError("Autenticação obrigatória.", 401) };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !publicKey || !serviceKey) {
    return { error: jsonError("Configuração do servidor indisponível.", 500) };
  }

  const authClient = createClient(url, publicKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await authClient.auth.getUser(match[1]);

  if (error || !data.user) {
    return { error: jsonError("Sessão inválida ou expirada.", 401) };
  }

  if (claimedUserId && claimedUserId !== data.user.id) {
    return { error: jsonError("Você não pode acessar dados de outro usuário.", 403) };
  }

  return {
    user: data.user,
    admin: createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    }),
  };
}
