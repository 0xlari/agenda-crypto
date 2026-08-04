import { createClient } from "@supabase/supabase-js";

type AuthResult =
  | { ok: true; user: { id: string; app_metadata?: { role?: string } } }
  | { ok: false; status: 401 | 403 | 500; message: string };

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function requireAuthenticatedUser(
  request: Request
): Promise<AuthResult> {
  const token = getBearerToken(request);

  if (!token) {
    return { ok: false, status: 401, message: "Sessao obrigatoria." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return {
      ok: false,
      status: 500,
      message: "Configuracao de autenticacao indisponivel.",
    };
  }

  const supabase = createClient(
    supabaseUrl,
    publishableKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false, status: 401, message: "Sessao invalida." };
  }

  return {
    ok: true,
    user: {
      id: user.id,
      app_metadata: user.app_metadata as { role?: string } | undefined,
    },
  };
}

export async function requireAdminUser(request: Request) {
  const auth = await requireAuthenticatedUser(request);

  if (!auth.ok) {
    return auth;
  }

  if (auth.user.app_metadata?.role !== "admin") {
    return { ok: false as const, status: 403 as const, message: "Acesso negado." };
  }

  return auth;
}

export function sameAuthenticatedUser(
  providedUserId: unknown,
  authenticatedUserId: string
) {
  return !providedUserId || providedUserId === authenticatedUserId;
}
