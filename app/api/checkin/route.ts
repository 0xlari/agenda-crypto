import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function generateSerial() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `AC-${y}${m}${d}-${rand}`;
}

export async function POST(request: Request) {
  try {
    const { userId, eventId } = await request.json();

    if (!userId || !eventId) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes." },
        { status: 400 }
      );
    }

    const { data: event, error: eventError } = await supabaseServer
      .from("events")
      .select("id, title, slug, event_type")
      .eq("id", eventId)
      .maybeSingle();

    if (eventError) {
      return NextResponse.json(
        { error: `Erro ao buscar evento: ${eventError.message}` },
        { status: 400 }
      );
    }

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado." },
        { status: 404 }
      );
    }

    const validPassTypes = ["conference", "side_event", "online", "happy_hour"];

    const passType = validPassTypes.includes(event.event_type)
      ? event.event_type
      : "conference";

    const { data: existingCheckin } = await supabaseServer
      .from("checkins")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .maybeSingle();

    if (!existingCheckin) {
      const { error: checkinError } = await supabaseServer
        .from("checkins")
        .insert({
          user_id: userId,
          event_id: eventId,
          validated: true,
        });

      if (checkinError) {
        return NextResponse.json(
          { error: `Erro ao salvar check-in: ${checkinError.message}` },
          { status: 400 }
        );
      }
    }

    const { data: existingInteraction } = await supabaseServer
      .from("event_interactions")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .eq("type", "checkin")
      .maybeSingle();

    if (!existingInteraction) {
      const { error: interactionError } = await supabaseServer
        .from("event_interactions")
        .insert({
          user_id: userId,
          event_id: eventId,
          type: "checkin",
        });

      if (interactionError) {
        return NextResponse.json(
          { error: `Erro ao salvar interação: ${interactionError.message}` },
          { status: 400 }
        );
      }
    }

    const { data: existingPass } = await supabaseServer
      .from("user_passes")
      .select("id")
      .eq("user_id", userId)
      .eq("event_id", eventId)
      .maybeSingle();

    if (!existingPass) {
      const { error: passError } = await supabaseServer
        .from("user_passes")
        .insert({
          user_id: userId,
          event_id: eventId,
          pass_type: passType,
          serial: generateSerial(),
          verified: true,
        });

      if (passError) {
        return NextResponse.json(
          { error: `Erro ao criar pass: ${passError.message}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      validated: true,
      message: "Presença confirmada e Agenda Pass dropado com sucesso.",
    });
  } catch (error) {
    console.error("Erro no check-in:", error);
    return NextResponse.json(
      { error: "Erro interno ao realizar check-in." },
      { status: 500 }
    );
  }
}