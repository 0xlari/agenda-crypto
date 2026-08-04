import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { userId, eventId } = await request.json();

    if (!sameAuthenticatedUser(userId, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId e obrigatorio." },
        { status: 400 }
      );
    }

    const { data: saveData, error: saveError } = await supabaseAdmin
      .from("event_interactions")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("event_id", eventId)
      .eq("type", "save")
      .limit(1);

    if (saveError) {
      return NextResponse.json(
        { error: "Nao foi possivel carregar o estado." },
        { status: 500 }
      );
    }

    const { data: responseData, error: responseError } = await supabaseAdmin
      .from("event_responses")
      .select("response")
      .eq("user_id", auth.user.id)
      .eq("event_id", eventId)
      .eq("response", "going")
      .maybeSingle();

    if (responseError) {
      return NextResponse.json(
        { error: "Nao foi possivel carregar o estado." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      saved: !!saveData?.length,
      going: responseData?.response === "going",
    });
  } catch (error) {
    console.error("Erro em /api/event-user-state:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar estado do usuario no evento." },
      { status: 500 }
    );
  }
}
