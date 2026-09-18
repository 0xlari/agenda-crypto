import { NextResponse } from "next/server";
import { trackEventInteraction } from "@/lib/tracking";
import { authorizeUser } from "@/lib/supabase/user-auth";

const allowedTypes = ["view", "save", "rsvp_yes", "rsvp_no", "checkin", "click_kaira", "registration_click"] as const;

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

    await trackEventInteraction({
      userId: auth.user.id,
      eventId,
      type,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro no tracking:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar tracking" },
      { status: 500 }
    );
  }
}
