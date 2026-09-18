import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";

const allowedTypes = ["view", "save", "rsvp_yes", "rsvp_no", "checkin", "click_kaira", "registration_click"];

export async function POST(request: Request) {
  try {
    const { userId, eventId, type } = await request.json();

    if (!userId || !eventId || !type) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(type)) {
      return NextResponse.json({ error: "Tipo de interação inválido." }, { status: 400 });
    }

    const auth = await authorizeUser(request, userId);
    if (auth.error) return auth.error;

    const { error } = await auth.admin
      .from("event_interactions")
      .delete()
      .eq("user_id", auth.user.id)
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
