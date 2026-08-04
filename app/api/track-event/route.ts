import { NextResponse } from "next/server";
import { trackEventInteraction } from "@/lib/tracking";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { userId, eventId, type } = await request.json();

    if (!sameAuthenticatedUser(userId, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!eventId || !type) {
      return NextResponse.json(
        { error: "Dados obrigatorios ausentes" },
        { status: 400 }
      );
    }

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
