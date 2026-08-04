import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const INTEREST_TYPES = new Set(["free_listing", "featured", "partnership"]);

function text(value: unknown, maxLength: number) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed ? trimmed.slice(0, maxLength) : null;
}

function email(value: unknown) {
  const normalized = text(value, 254)?.toLowerCase();

  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return null;
  }

  return normalized;
}

function url(value: unknown) {
  const normalized = text(value, 500);

  if (!normalized) return null;

  try {
    const parsed = new URL(normalized);

    return ["http:", "https:"].includes(parsed.protocol) ? normalized : null;
  } catch {
    return null;
  }
}

function optionalDate(value: unknown) {
  const normalized = text(value, 40);

  if (!normalized) return null;

  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const contactName = text(body?.contact_name, 160);
    const contactEmail = email(body?.email);
    const eventTitle = text(body?.event_title, 220);

    if (!contactName || !contactEmail || !eventTitle) {
      return NextResponse.json(
        { error: "Preencha nome, email valido e nome do evento." },
        { status: 400 }
      );
    }

    const interestType =
      typeof body?.interest_type === "string" &&
      INTEREST_TYPES.has(body.interest_type)
        ? body.interest_type
        : "free_listing";

    const { error } = await supabase.from("event_submissions").insert({
      contact_name: contactName,
      email: contactEmail,
      whatsapp: text(body?.whatsapp, 80),
      event_title: eventTitle,
      event_date: optionalDate(body?.event_date),
      end_date: optionalDate(body?.end_date),
      event_time: text(body?.event_time, 80),
      agenda_highlight: text(body?.agenda_highlight, 500),
      event_link: url(body?.event_link),
      city: text(body?.city, 120),
      location: text(body?.location, 220),
      short_description: text(body?.short_description, 1200),
      tags: text(body?.tags, 500),
      image_url: url(body?.image_url),
      interest_type: interestType,
      status: "new",
    });

    if (error) {
      console.error("Erro ao salvar submissao:", error.message);

      return NextResponse.json(
        { error: "Erro ao salvar submissao." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recebemos seu evento. Vamos analisar as informacoes.",
    });
  } catch (err) {
    console.error("Erro geral event-submissions:", err);

    return NextResponse.json(
      { error: "Erro ao enviar formulario." },
      { status: 500 }
    );
  }
}
