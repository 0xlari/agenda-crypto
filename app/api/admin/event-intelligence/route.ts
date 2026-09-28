import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

export const dynamic = "force-dynamic";

const seriesFields = [
  "name",
  "slug",
  "description",
  "organizer_name",
  "organizer_url",
  "official_url",
  "image_url",
  "origin_city",
  "origin_country",
  "cadence",
  "main_focus",
  "audience",
  "internal_notes",
] as const;

const eventFields = [
  "title",
  "slug",
  "short_description",
  "description",
  "city",
  "country",
  "venue",
  "start_date",
  "end_date",
  "category",
  "audience",
  "source_url",
  "registration_url",
  "image_url",
  "event_time",
  "event_type",
  "level",
  "intent",
  "published",
  "featured",
] as const;

const intelligenceFields = [
  "organizer_name",
  "organizer_url",
  "organizer_relevance",
  "edition_number",
  "event_history",
  "event_positioning",
  "key_speakers",
  "key_companies",
  "key_institutions",
  "sponsors",
  "partners",
  "main_topics",
  "market_signals",
  "notable_announcements",
  "regional_context",
  "ecosystem_context",
  "competitive_events",
  "why_it_matters",
  "who_should_go",
  "who_should_skip",
  "business_opportunity",
  "networking_opportunity",
  "editorial_angle",
  "agenda_take",
  "side_events",
  "related_news",
  "relevant_links",
  "research_sources",
  "research_confidence",
  "research_status",
  "research_notes",
  "research_updated_at",
] as const;

const announcementFields = [
  "title",
  "slug",
  "organizer",
  "country",
  "city",
  "expected_year",
  "expected_period",
  "official_url",
  "sources",
  "summary",
  "agenda_insight",
  "internal_notes",
  "image_url",
  "confidence",
  "start_date",
  "end_date",
  "event_time",
  "venue",
  "registration_url",
  "category",
  "event_type",
  "audience",
] as const;

function pick(
  source: Record<string, unknown> | undefined,
  fields: readonly string[],
) {
  if (!source) return {};
  return Object.fromEntries(
    fields
      .filter((field) => field in source)
      .map((field) => [field, source[field]]),
  );
}

function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json({ error, details }, { status });
}

async function uniqueEventSlug(admin: SupabaseClient, baseSlug: string) {
  const normalized =
    baseSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "evento";

  for (let suffix = 0; suffix < 100; suffix += 1) {
    const candidate = suffix === 0 ? normalized : `${normalized}-${suffix + 1}`;
    const { data, error } = await admin
      .from("events")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (error) throw error;
    if (!data) return candidate;
  }
  throw new Error("Não foi possível gerar um slug único para a edição.");
}

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  const [seriesResult, eventsResult, intelligenceResult, announcementsResult] =
    await Promise.all([
      auth.admin.from("event_series").select("*").order("name"),
      // A Central precisa exibir também eventos-filhos (por exemplo, fóruns de uma week).
      // parent_event_id descreve a relação entre eventos, não se a edição possui inteligência própria.
      auth.admin
        .from("events")
        .select("*")
        .order("start_date", { ascending: false }),
      auth.admin.from("event_intelligence").select("*"),
      auth.admin
        .from("event_announcements")
        .select("*")
        .neq("status", "archived")
        .order("expected_year", { ascending: true }),
    ]);

  const failed = [
    seriesResult,
    eventsResult,
    intelligenceResult,
    announcementsResult,
  ].find((result) => result.error);
  if (failed?.error)
    return jsonError(
      "Não foi possível carregar a Central de Inteligência.",
      500,
      failed.error.message,
    );

  const intelligenceByEvent = new Map(
    (intelligenceResult.data || []).map((row) => [row.event_id, row]),
  );
  const sideEventsByParent = new Map<
    string,
    Array<{
      id: string;
      title: string;
      slug: string;
      start_date: string;
      parent_event_id: string;
      published: boolean;
    }>
  >();
  for (const event of eventsResult.data || []) {
    if (!event.parent_event_id) continue;
    const items = sideEventsByParent.get(event.parent_event_id) || [];
    items.push({
      id: event.id,
      title: event.title,
      slug: event.slug,
      start_date: event.start_date,
      parent_event_id: event.parent_event_id,
      published: event.published,
    });
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
    announcements: (announcementsResult.data || []).filter(
      (announcement) => announcement.series_id === item.id,
    ),
  }));

  return NextResponse.json({
    series,
    ungrouped_events: editions.filter((event) => !event.series_id),
    ungrouped_announcements: (announcementsResult.data || []).filter(
      (announcement) => !announcement.series_id,
    ),
  });
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = (await request.json()) as {
      series?: Record<string, unknown>;
      event_id?: string;
    };
    const payload = pick(body.series, seriesFields);
    if (!payload.name || !payload.slug)
      return jsonError("Nome e slug são obrigatórios.", 400);

    const { data, error } = await auth.admin
      .from("event_series")
      .insert(payload)
      .select("*")
      .single();
    if (error)
      return jsonError(
        "Não foi possível criar o evento-mãe.",
        500,
        error.message,
      );

    if (body.event_id) {
      const { error: linkError } = await auth.admin
        .from("events")
        .update({ series_id: data.id })
        .eq("id", body.event_id);
      if (linkError)
        return jsonError(
          "O evento-mãe foi criado, mas a edição não foi vinculada.",
          500,
          linkError.message,
        );
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
    const body = (await request.json()) as {
      action?:
        | "update_series"
        | "update_edition"
        | "update_announcement"
        | "promote_announcement_to_draft"
        | "link_edition"
        | "link_announcement"
        | "update_review_status";
      series_id?: string;
      event_id?: string;
      announcement_id?: string;
      series?: Record<string, unknown>;
      event?: Record<string, unknown>;
      announcement?: Record<string, unknown>;
      intelligence?: Record<string, unknown>;
      review_status?: "retry_required" | "reviewed";
    };

    if (body.action === "update_series" && body.series_id) {
      const { data, error } = await auth.admin
        .from("event_series")
        .update(pick(body.series, seriesFields))
        .eq("id", body.series_id)
        .select("*")
        .single();
      if (error)
        return jsonError(
          "Não foi possível atualizar a visão geral.",
          500,
          error.message,
        );
      return NextResponse.json({ series: data });
    }

    if (body.action === "link_edition" && body.event_id) {
      const { error } = await auth.admin
        .from("events")
        .update({ series_id: body.series_id || null })
        .eq("id", body.event_id);
      if (error)
        return jsonError(
          "Não foi possível vincular a edição.",
          500,
          error.message,
        );
      return NextResponse.json({ ok: true });
    }

    if (body.action === "link_announcement" && body.event_id) {
      const { error } = await auth.admin
        .from("event_announcements")
        .update({ series_id: body.series_id || null })
        .eq("id", body.event_id);
      if (error)
        return jsonError(
          "Não foi possível vincular o anúncio do Vem aí.",
          500,
          error.message,
        );
      return NextResponse.json({ ok: true });
    }

    if (body.action === "update_announcement" && body.announcement_id) {
      const payload = pick(body.announcement, announcementFields);
      const { data, error } = await auth.admin
        .from("event_announcements")
        .update(payload)
        .eq("id", body.announcement_id)
        .select("*")
        .single();
      if (error)
        return jsonError(
          "Não foi possível atualizar o anúncio do Vem aí.",
          500,
          error.message,
        );
      return NextResponse.json({ announcement: data });
    }

    if (
      body.action === "promote_announcement_to_draft" &&
      body.announcement_id
    ) {
      const { data: announcement, error: announcementError } = await auth.admin
        .from("event_announcements")
        .select("*")
        .eq("id", body.announcement_id)
        .single();
      if (announcementError || !announcement) {
        return jsonError(
          "Anúncio do Vem aí não encontrado.",
          404,
          announcementError?.message,
        );
      }
      if (announcement.promoted_event_id) {
        return jsonError("Este anúncio já possui uma edição vinculada.", 409);
      }
      if (!announcement.series_id) {
        return jsonError(
          "Vincule o anúncio a um evento-mãe antes de criar a edição.",
          400,
        );
      }
      if (!announcement.start_date) {
        return jsonError(
          "Preencha a data inicial antes de criar a edição.",
          400,
        );
      }

      const slug = await uniqueEventSlug(auth.admin, announcement.slug);
      const eventPayload = {
        title: announcement.title,
        slug,
        short_description: announcement.summary,
        description: announcement.summary,
        city: announcement.city,
        country: announcement.country,
        venue: announcement.venue,
        start_date: announcement.start_date,
        end_date: announcement.end_date,
        event_time: announcement.event_time,
        category: announcement.category,
        event_type: announcement.event_type,
        audience: announcement.audience,
        source_url: announcement.official_url,
        registration_url:
          announcement.registration_url || announcement.official_url,
        image_url: announcement.image_url,
        series_id: announcement.series_id,
        published: false,
        featured: false,
      };
      const { data: event, error: eventError } = await auth.admin
        .from("events")
        .insert(eventPayload)
        .select("*")
        .single();
      if (eventError || !event)
        return jsonError(
          "Não foi possível criar a edição rascunho.",
          500,
          eventError?.message,
        );

      const { error: linkError } = await auth.admin
        .from("event_announcements")
        .update({ promoted_event_id: event.id })
        .eq("id", announcement.id);
      if (linkError)
        return jsonError(
          "A edição foi criada, mas o anúncio não pôde ser vinculado.",
          500,
          linkError.message,
        );

      const { error: intelligenceError } = await auth.admin
        .from("event_intelligence")
        .upsert(
          {
            event_id: event.id,
            organizer_name: announcement.organizer,
            research_status: "not_started",
            research_notes:
              "Edição rascunho criada a partir do anúncio do Vem aí.",
            research_updated_at: new Date().toISOString(),
          },
          { onConflict: "event_id" },
        );
      if (intelligenceError) {
        return jsonError(
          "A edição foi criada e vinculada, mas a inteligência inicial não pôde ser preparada.",
          500,
          intelligenceError.message,
        );
      }

      return NextResponse.json({ event }, { status: 201 });
    }

    if (
      body.action === "update_review_status" &&
      body.event_id &&
      body.review_status
    ) {
      const { data, error } = await auth.admin
        .from("event_intelligence")
        .update({
          research_status: body.review_status,
          research_updated_at: new Date().toISOString(),
        })
        .eq("event_id", body.event_id)
        .select("*")
        .single();
      if (error)
        return jsonError(
          "Não foi possível atualizar o status da revisão.",
          500,
          error.message,
        );
      return NextResponse.json({ intelligence: data });
    }

    if (body.action === "update_edition" && body.event_id) {
      const eventPayload = pick(body.event, eventFields);
      const intelligencePayload = {
        ...pick(body.intelligence, intelligenceFields),
        event_id: body.event_id,
        research_updated_at: new Date().toISOString(),
      };
      const [eventResult, intelligenceResult] = await Promise.all([
        auth.admin
          .from("events")
          .update(eventPayload)
          .eq("id", body.event_id)
          .select("*")
          .single(),
        auth.admin
          .from("event_intelligence")
          .upsert(intelligencePayload, { onConflict: "event_id" })
          .select("*")
          .single(),
      ]);
      if (eventResult.error || intelligenceResult.error) {
        return jsonError(
          "Não foi possível atualizar a edição.",
          500,
          eventResult.error?.message || intelligenceResult.error?.message,
        );
      }

      if (eventPayload.published === true) {
        const { error: announcementError } = await auth.admin
          .from("event_announcements")
          .update({ status: "promoted" })
          .eq("promoted_event_id", body.event_id);
        if (announcementError)
          return jsonError(
            "A edição foi salva, mas o anúncio do Vem aí não foi finalizado.",
            500,
            announcementError.message,
          );
      } else if (eventPayload.published === false) {
        const { error: announcementError } = await auth.admin
          .from("event_announcements")
          .update({ status: "published" })
          .eq("promoted_event_id", body.event_id)
          .eq("status", "promoted");
        if (announcementError)
          return jsonError(
            "A edição foi salva, mas o anúncio do Vem aí não foi reativado.",
            500,
            announcementError.message,
          );
      }
      return NextResponse.json({
        event: eventResult.data,
        intelligence: intelligenceResult.data,
      });
    }

    return jsonError("Ação inválida.", 400);
  } catch {
    return jsonError("Corpo da requisição inválido.", 400);
  }
}
