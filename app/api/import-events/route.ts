import { supabaseServer } from "@/lib/supabase/server";

function parseBool(value?: string) {
  return String(value || "").trim().toLowerCase() === "true";
}

function parseTags(value?: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sheetUrl = body.sheetUrl?.trim();

    if (!sheetUrl) {
      return Response.json(
        { error: "URL da planilha é obrigatória." },
        { status: 400 }
      );
    }

    const response = await fetch(sheetUrl);

    if (!response.ok) {
      return Response.json(
        { error: "Não foi possível acessar a planilha." },
        { status: 400 }
      );
    }

    const csvText = await response.text();

    const lines = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      return Response.json(
        { error: "A planilha está vazia ou inválida." },
        { status: 400 }
      );
    }

    const headers = lines[0].split(",").map((h) => h.trim());

    if (!headers.includes("title") || !headers.includes("slug")) {
      return Response.json(
        {
          error:
            "A planilha precisa ter pelo menos as colunas 'title' e 'slug'.",
        },
        { status: 400 }
      );
    }

    const events: Record<string, any>[] = [];
    let skipped = 0;

    for (const line of lines.slice(1)) {
      const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim().replace(/^"|"$/g, "") || "";
      });

      if (!row.title || !row.slug) {
        skipped++;
        continue;
      }

      let parentEventId: string | null = null;

      if (row.parent_slug?.trim()) {
        const { data: parentEvent, error: parentError } = await supabaseServer
          .from("events")
          .select("id")
          .eq("slug", row.parent_slug.trim())
          .maybeSingle();

        if (parentError) {
          console.error(
            "Erro ao buscar parent event:",
            row.parent_slug,
            parentError
          );
        }

        if (parentEvent?.id) {
          parentEventId = parentEvent.id;
        }
      }

      events.push({
        title: row.title?.trim() || null,
        slug: row.slug?.trim() || null,
        short_description: row.short_description?.trim() || null,
        description: row.description?.trim() || null,
        city: row.city?.trim() || null,
        venue: row.venue?.trim() || null,
        start_date: row.start_date?.trim() || null,
        end_date: row.end_date?.trim() || null,
        event_time: row.event_time?.trim() || null,
        registration_url: row.registration_url?.trim() || null,
        image_url: row.image_url?.trim() || null,
        tags: parseTags(row.tags),
        category: row.category?.trim() || null,
        audience: row.audience?.trim() || null,
        agenda_highlight: row.agenda_highlight?.trim() || null,
        published: parseBool(row.published),
        featured: parseBool(row.featured),
        is_online: parseBool(row.is_online),
        source_url: row.source_url?.trim() || null,
        event_type: row.event_type?.trim() || "main_event",
        level: row.level?.trim() || null,
        intent: (row.intent || row.Intent)?.trim() || null,
        is_big_event: parseBool(row.is_big_event),
        is_side_event: parseBool(row.is_side_event),
        parent_event_id: parentEventId,
      });
    }

    if (events.length === 0) {
      return Response.json(
        { error: "Nenhum evento válido encontrado." },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("events")
      .upsert(events, { onConflict: "slug" });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({
      message: `${events.length} eventos importados. ${skipped} ignorados.`,
    });
  } catch (err) {
    console.error("Erro ao importar eventos:", err);

    return Response.json(
      { error: "Erro interno ao importar eventos." },
      { status: 500 }
    );
  }
}