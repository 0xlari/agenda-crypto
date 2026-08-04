import { NextResponse } from "next/server";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const auth = await requireAuthenticatedUser(req);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabaseAdmin = getSupabaseServer();
    const { event_id, user_id } = await req.json();

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!event_id) {
      return NextResponse.json(
        { error: "event_id e obrigatorio." },
        { status: 400 }
      );
    }

    const { error: responseError } = await supabaseAdmin
      .from("event_responses")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", auth.user.id);

    if (responseError) {
      return NextResponse.json(
        { error: "Nao foi possivel remover a resposta." },
        { status: 500 }
      );
    }

    const { error: interactionError } = await supabaseAdmin
      .from("event_interactions")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", auth.user.id)
      .eq("type", "rsvp_yes");

    if (interactionError) {
      return NextResponse.json(
        { error: "Nao foi possivel remover a interacao." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO INTERNO /api/unrespond:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
