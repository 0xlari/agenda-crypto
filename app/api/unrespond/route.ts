import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { event_id, user_id } = await req.json();

    if (!event_id || !user_id) {
      return NextResponse.json(
        { error: "event_id e user_id são obrigatórios." },
        { status: 400 }
      );
    }

    const { error: responseError } = await supabaseAdmin
      .from("event_responses")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", user_id);

    if (responseError) {
      return NextResponse.json(
        { error: responseError.message },
        { status: 500 }
      );
    }

    const { error: interactionError } = await supabaseAdmin
      .from("event_interactions")
      .delete()
      .eq("event_id", event_id)
      .eq("user_id", user_id)
      .eq("type", "rsvp_yes");

    if (interactionError) {
      return NextResponse.json(
        { error: interactionError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO INTERNO /api/unrespond:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}