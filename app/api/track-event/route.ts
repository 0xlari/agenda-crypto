import { NextResponse } from "next/server";
import { trackEventInteraction } from "@/lib/tracking";

export async function POST(request: Request) {
  try {
    const { userId, eventId, type } = await request.json();

    if (!userId || !eventId || !type) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    await trackEventInteraction({
      userId,
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