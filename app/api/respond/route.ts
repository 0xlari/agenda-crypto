import { NextResponse } from "next/server";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";
import { getSupabaseServer } from "@/lib/supabase/server";

const allowedResponses = new Set(["going", "not_going"]);

export async function POST(req: Request) {
  try {
    const auth = await requireAuthenticatedUser(req);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabaseAdmin = getSupabaseServer();
    const { event_id, user_id, response } = await req.json();

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!event_id || !allowedResponses.has(response)) {
      return NextResponse.json(
        { error: "Dados de resposta invalidos." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("event_responses")
      .upsert(
        {
          event_id,
          user_id: auth.user.id,
          response,
        },
        {
          onConflict: "event_id,user_id",
        }
      );

    if (error) {
      console.error("Erro ao salvar resposta de evento:", error);
      return NextResponse.json(
        { error: "Nao foi possivel salvar a resposta." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO INTERNO /api/respond:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
