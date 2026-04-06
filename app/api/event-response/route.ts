import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { user_id, event_id, response } = await request.json();

    if (!user_id || !event_id || !response) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    if (!["going", "not_going"].includes(response)) {
      return NextResponse.json(
        { error: "Resposta inválida." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("event_responses")
      .upsert(
        {
          user_id,
          event_id,
          response,
        },
        {
          onConflict: "user_id,event_id",
        }
      );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}