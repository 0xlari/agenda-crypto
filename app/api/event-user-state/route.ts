import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "userId e eventId são obrigatórios." },
        { status: 400 }
      );
    }

    const { data: saveData, error: saveError } = await supabaseAdmin
      .from("event_interactions")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .eq("type", "save")
      .limit(1);

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    const { data: responseData, error: responseError } = await supabaseAdmin
      .from("event_responses")
      .select("response")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .eq("response", "going")
      .maybeSingle();

    if (responseError) {
      return NextResponse.json(
        { error: responseError.message },
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
      { error: "Erro interno ao buscar estado do usuário no evento." },
      { status: 500 }
    );
  }
}