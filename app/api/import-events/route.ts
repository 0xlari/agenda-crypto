import { supabaseServer } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/geocode";
import {
  UNKNOWN_COUNTRY,
  getCountryByCity,
  getCountryByValue,
  resolveEventCountry,
} from "@/lib/event-country";

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

    const requiredHeaders = ["title", "slug", "city", "country"];
    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );

    if (missingHeaders.length > 0) {
      return Response.json(
        {
          error: `A planilha precisa das colunas: ${requiredHeaders.join(
            ", "
          )}. Faltando: ${missingHeaders.join(", ")}.`,
        },
        { status: 400 }
      );
    }

    const events: Record<string, any>[] = [];
    let skipped = 0;
    let inferredCountries = 0;
    let correctedCountries = 0;
    const countryErrors: string[] = [];

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

      const isOnline = parseBool(row.is_online);
      const cityCountry = getCountryByCity(row.city);
      const providedCountry = getCountryByValue(row.country);
      const resolvedCountry = resolveEventCountry({
        city: row.city,
        country: row.country,
        isOnline,
      });

      if (!isOnline && resolvedCountry.key === UNKNOWN_COUNTRY.key) {
        countryErrors.push(`${row.title} (${row.city || "sem cidade"})`);
        continue;
      }

      if (!row.country?.trim() && resolvedCountry.storageName) {
        inferredCountries++;
      } else if (
        cityCountry &&
        (!providedCountry || providedCountry.key !== cityCountry.key)
      ) {
        correctedCountries++;
      }

      const fullAddress = row.address?.trim() || null;

      let lat: number | null = null;
      let lng: number | null = null;

      if (fullAddress) {
        try {
          const coords = await geocodeAddress(fullAddress);
          lat = coords.lat;
          lng = coords.lng;
        } catch (error) {
          console.error("Erro ao geocodificar endereço:", fullAddress, error);
        }
      }

      events.push({
        title: row.title?.trim() || null,
        slug: row.slug?.trim() || null,
        short_description: row.short_description?.trim() || null,
        description: row.description?.trim() || null,
        city: row.city?.trim() || null,
        country: resolvedCountry.storageName,
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
        is_online: isOnline,
        source_url: row.source_url?.trim() || null,
        event_type: row.event_type?.trim() || (parseBool(row.is_side_event) ? "side_event" : "main_event"),
        level: row.level?.trim() || null,
        intent: (row.intent || row.Intent)?.trim() || null,
        is_big_event: parseBool(row.is_big_event),
        is_side_event: parseBool(row.is_side_event),
        parent_event_id: parentEventId,
        address: fullAddress,
        lat,
        lng,
      });
    }

    if (countryErrors.length > 0) {
      return Response.json(
        {
          error: `Preencha a coluna country para: ${countryErrors
            .slice(0, 5)
            .join(", ")}${countryErrors.length > 5 ? "..." : ""}.`,
        },
        { status: 400 }
      );
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
      message: `${events.length} eventos importados. ${skipped} ignorados. ${inferredCountries} países inferidos e ${correctedCountries} corrigidos pela cidade.`,
    });
  } catch (err) {
    console.error("Erro ao importar eventos:", err);

    return Response.json(
      { error: "Erro interno ao importar eventos." },
      { status: 500 }
    );
  }
}
