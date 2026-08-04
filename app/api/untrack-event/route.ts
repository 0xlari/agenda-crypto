import { NextResponse } from "next/server";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabaseAdmin = getSupabaseServer();
    const { userId, eventId, type } = await request.json();

    if (!sameAuthenticatedUser(userId, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!eventId || !type) {
      return NextResponse.json(
        { error: "Dados obrigatorios ausentes" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("event_interactions")
      .delete()
      .eq("user_id", auth.user.id)
      .eq("event_id", eventId)
      .eq("type", type);

    if (error) {
      return NextResponse.json(
        { error: "Nao foi possivel remover a interacao." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no untracking:", error);
    return NextResponse.json(
      { error: "Erro interno ao remover tracking" },
      { status: 500 }
    );
  }
}
