import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { countryForStorage } from "@/lib/event-country";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function parseBool(value: unknown) {
  if (typeof value === "boolean") return value;
  return String(value || "").trim().toLowerCase() === "true";
}

function parseTags(value: unknown) {
  if (Array.isArray(value)) return value;

  if (!value) return [];

  return String(value)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");
    const expectedToken = process.env.EVENTS_API_TOKEN;

    if (!expectedToken) {
      return NextResponse.json(
        { error: "EVENTS_API_TOKEN não configurado no servidor." },
        { status: 500 }
      );
    }

    if (authorization !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Não autorizado." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        { error: "title e slug são obrigatórios." },
        { status: 400 }
      );
    }

    const isOnline = parseBool(body.is_online);

    const event = {
      title: body.title?.trim(),
      slug: body.slug?.trim(),
      short_description: body.short_description?.trim() || null,
      description: body.description?.trim() || null,
      city: body.city?.trim() || null,
      country: countryForStorage({
        city: body.city,
        country: body.country,
        isOnline,
      }),
      venue: body.venue?.trim() || null,
      start_date: body.start_date?.trim() || null,
      end_date: body.end_date?.trim() || null,
      event_time: body.event_time?.trim() || null,
      registration_url: body.registration_url?.trim() || null,
      image_url: body.image_url?.trim() || null,
      tags: parseTags(body.tags),
      category: body.category?.trim() || null,
      audience: body.audience?.trim() || null,
      agenda_highlight: body.agenda_highlight?.trim() || null,
      published: parseBool(body.published),
      featured: parseBool(body.featured),
      is_online: isOnline,
      source_url: body.source_url?.trim() || null,
      event_type: body.event_type?.trim() || "main_event",
      level: body.level?.trim() || null,
      intent: body.intent?.trim() || null,
      is_big_event: parseBool(body.is_big_event),
      is_side_event: parseBool(body.is_side_event),
      parent_event_id: body.parent_event_id || null,
      address: body.address?.trim() || null,
      lat: body.lat ?? null,
      lng: body.lng ?? null,
    };

    const { data, error } = await supabaseAdmin
      .from("events")
      .upsert(event, { onConflict: "slug" })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Evento criado ou atualizado com sucesso.",
      data,
    });
  } catch (error) {
    console.error("Erro em /api/events/upsert:", error);

    return NextResponse.json(
      { error: "Erro interno ao criar ou atualizar evento." },
      { status: 500 }
    );
  }
}
