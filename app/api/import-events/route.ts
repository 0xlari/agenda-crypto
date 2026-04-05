import { supabaseServer } from "@/lib/supabase/server";

function parseBool(value: string) {
  return String(value).trim().toLowerCase() === "true";
}

function parseTags(value: string) {
  if (!value) return [];
  return value.split(",").map((tag) => tag.trim()).filter(Boolean);
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

    // valida se tem colunas mínimas
    if (!headers.includes("title") || !headers.includes("slug")) {
      return Response.json(
        { error: "A planilha precisa ter pelo menos as colunas 'title' e 'slug'." },
        { status: 400 }
      );
    }

    const events = [];
    let skipped = 0;

    for (const line of lines.slice(1)) {
      const values = line.split(",");

      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || "";
      });

      // validação mínima
      if (!row.title || !row.slug) {
        skipped++;
        continue;
      }

      events.push({
        title: row.title,
        slug: row.slug,
        short_description: row.short_description,
        description: row.description,
        city: row.city,
        country: row.country || "Brazil",
        venue: row.venue,
        is_online: parseBool(row.is_online),
        start_date: row.start_date,
        end_date: row.end_date || null,
        category: row.category,
        audience: row.audience,
        tags: parseTags(row.tags),
        source_url: row.source_url,
        registration_url: row.registration_url,
        featured: parseBool(row.featured),
        published: parseBool(row.published),
        image_url: row.image_url,
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
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
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