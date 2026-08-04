import { NextResponse } from "next/server";
import { getRecommendedEvents } from "@/lib/supabase/queries";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { userId } = await request.json();

    if (!sameAuthenticatedUser(userId, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const data = await getRecommendedEvents(auth.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro ao buscar recomendacoes:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar recomendacoes" },
      { status: 500 }
    );
  }
}
