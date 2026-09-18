import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY RECEBIDO EM /api/respond:", body);

    const { event_id, user_id, response } = body;

    if (!event_id || !user_id || !response) {
      return NextResponse.json(
        { error: "event_id, user_id e response são obrigatórios." },
        { status: 400 }
      );
    }

    if (!(["going", "not_going"] as const).includes(response)) {
      return NextResponse.json({ error: "Resposta inválida." }, { status: 400 });
    }

    const auth = await authorizeUser(req, user_id);
    if (auth.error) return auth.error;

    const { error } = await auth.admin
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
      console.error("ERRO AO SALVAR EM event_responses:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO INTERNO /api/respond:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
