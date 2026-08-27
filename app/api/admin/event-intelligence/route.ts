import { NextResponse } from "next/server";
import {
  getEventIntelligence,
  upsertEventIntelligence,
} from "@/lib/supabase/event-intelligence";

export const dynamic = "force-dynamic";

function parseEventId(value: unknown) {
  if (typeof value !== "string") return null;

  const eventId = value.trim();
  return eventId.length > 0 ? eventId : null;
}

export async function GET(req: Request) {
  const eventId = parseEventId(new URL(req.url).searchParams.get("eventId"));

  if (!eventId) {
    return NextResponse.json(
      { error: "eventId é obrigatório." },
      { status: 400 }
    );
  }

  try {
    const intelligence = await getEventIntelligence(eventId);

    return NextResponse.json({ intelligence });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar inteligência.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventId = parseEventId(body?.eventId);

    if (!eventId) {
      return NextResponse.json(
        { error: "eventId é obrigatório." },
        { status: 400 }
      );
    }

    const intelligence = await upsertEventIntelligence(
      eventId,
      body?.intelligence
    );

    return NextResponse.json({ success: true, intelligence });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao salvar inteligência.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
