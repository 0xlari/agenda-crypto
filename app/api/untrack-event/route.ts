import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, eventId, type } = await request.json();

    if (!userId || !eventId || !type) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("event_interactions")
      .delete()
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .eq("type", type);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
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