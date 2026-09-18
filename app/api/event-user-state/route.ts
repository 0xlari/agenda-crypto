import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";

export async function POST(request: Request) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "userId e eventId são obrigatórios." },
        { status: 400 }
      );
    }

    const auth = await authorizeUser(request, userId);
    if (auth.error) return auth.error;

    const { data: saveData, error: saveError } = await auth.admin
      .from("event_interactions")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("event_id", eventId)
      .eq("type", "save")
      .limit(1);

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 500 });
    }

    const { data: responseData, error: responseError } = await auth.admin
      .from("event_responses")
      .select("response")
      .eq("user_id", auth.user.id)
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
