import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

export const dynamic = "force-dynamic";

const seriesFields = [
  "name", "slug", "description", "organizer_name", "organizer_url", "official_url",
  "image_url", "origin_city", "origin_country", "cadence", "main_focus", "audience",
  "internal_notes",
] as const;

const eventFields = [
  "title", "slug", "short_description", "description", "city", "country", "venue",
  "start_date", "end_date", "category", "audience", "source_url", "registration_url",
  "image_url", "event_time", "event_type", "level", "intent", "published", "featured",
] as const;

const intelligenceFields = [
  "organizer_name", "organizer_url", "organizer_relevance", "edition_number", "event_history",
  "event_positioning", "key_speakers", "key_companies", "key_institutions", "sponsors",
  "partners", "main_topics", "market_signals", "notable_announcements", "regional_context",
  "ecosystem_context", "competitive_events", "why_it_matters", "who_should_go", "who_should_skip",
  "business_opportunity", "networking_opportunity", "editorial_angle", "agenda_take", "side_events",
  "related_news", "relevant_links", "research_sources", "research_confidence", "research_status",
  "research_notes", "research_updated_at",
] as const;

function pick(source: Record<string, unknown> | undefined, fields: readonly string[]) {
  if (!source) return {};
  return Object.fromEntries(fields.filter((field) => field in source).map((field) => [field, source[field]]));
}

function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json({ error, details }, { status });
}

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  const [seriesResult, eventsResult, intelligenceResult, sideEventsResult] = await Promise.all([
    auth.admin.from("event_series").select("*").order("name"),
    auth.admin.from("events").select("*").is("parent_event_id", null).order("start_date", { ascending: false }),
    auth.admin.from("event_intelligence").select("*"),
    auth.admin.from("events").select("id,title,slug,start_date,parent_event_id,published").not("parent_event_id", "is", null).order("start_date"),
  ]);

  const failed = [seriesResult, eventsResult, intelligenceResult, sideEventsResult].find((result) => result.error);
  if (failed?.error) return jsonError("Não foi possível carregar a Central de Inteligência.", 500, failed.error.message);

  const intelligenceByEvent = new Map((intelligenceResult.data || []).map((row) => [row.event_id, row]));
  const sideEventsByParent = new Map<string, typeof sideEventsResult.data>();
  for (const event of sideEventsResult.data || []) {
    const items = sideEventsByParent.get(event.parent_event_id) || [];
    items.push(event);
    sideEventsByParent.set(event.parent_event_id, items);
  }

  const editions = (eventsResult.data || []).map((event) => ({
    ...event,
    intelligence: intelligenceByEvent.get(event.id) || null,
    child_events: sideEventsByParent.get(event.id) || [],
  }));

  const series = (seriesResult.data || []).map((item) => ({
    ...item,
    editions: editions.filter((event) => event.series_id === item.id),
  }));

  return NextResponse.json({
    series,
    ungrouped_events: editions.filter((event) => !event.series_id),
  });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json() as { series?: Record<string, unknown>; event_id?: string };
    const payload = pick(body.series, seriesFields);
    if (!payload.name || !payload.slug) return jsonError("Nome e slug são obrigatórios.", 400);

    const { data, error } = await auth.admin.from("event_series").insert(payload).select("*").single();
    if (error) return jsonError("Não foi possível criar o evento-mãe.", 500, error.message);

    if (body.event_id) {
      const { error: linkError } = await auth.admin.from("events").update({ series_id: data.id }).eq("id", body.event_id);
      if (linkError) return jsonError("O evento-mãe foi criado, mas a edição não foi vinculada.", 500, linkError.message);
    }

    return NextResponse.json({ series: data }, { status: 201 });
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }
}

export async function PATCH(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json() as {
      action?: "update_series" | "update_edition" | "link_edition";
      series_id?: string;
      event_id?: string;
      series?: Record<string, unknown>;
      event?: Record<string, unknown>;
      intelligence?: Record<string, unknown>;
    };

    if (body.action === "update_series" && body.series_id) {
      const { data, error } = await auth.admin
        .from("event_series").update(pick(body.series, seriesFields)).eq("id", body.series_id).select("*").single();
      if (error) return jsonError("Não foi possível atualizar a visão geral.", 500, error.message);
      return NextResponse.json({ series: data });
    }

    if (body.action === "link_edition" && body.event_id) {
      const { error } = await auth.admin.from("events").update({ series_id: body.series_id || null }).eq("id", body.event_id);
      if (error) return jsonError("Não foi possível vincular a edição.", 500, error.message);
      return NextResponse.json({ ok: true });
    }

    if (body.action === "update_edition" && body.event_id) {
      const eventPayload = pick(body.event, eventFields);
      const intelligencePayload = {
        ...pick(body.intelligence, intelligenceFields),
        event_id: body.event_id,
        research_updated_at: new Date().toISOString(),
      };
      const [eventResult, intelligenceResult] = await Promise.all([
        auth.admin.from("events").update(eventPayload).eq("id", body.event_id).select("*").single(),
        auth.admin.from("event_intelligence").upsert(intelligencePayload, { onConflict: "event_id" }).select("*").single(),
      ]);
      if (eventResult.error || intelligenceResult.error) {
        return jsonError("Não foi possível atualizar a edição.", 500, eventResult.error?.message || intelligenceResult.error?.message);
      }
      return NextResponse.json({ event: eventResult.data, intelligence: intelligenceResult.data });
    }

    return jsonError("Ação inválida.", 400);
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }
}
