import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      contact_name,
      email,
      whatsapp,
      event_title,
      event_date,
      end_date,
      city,
      location,
      event_link,
      short_description,
      tags,
      image_url,
      interest_type,
      event_time,
      agenda_highlight,
    } = body;

    if (!contact_name || !email || !event_title) {
      return NextResponse.json(
        { error: "Preencha nome, email e nome do evento." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("event_submissions").insert({
      contact_name,
      email,
      whatsapp: whatsapp || null,
      event_title,
      event_date: event_date || null,
      end_date: end_date || null,
      event_time: event_time || null,
      agenda_highlight: agenda_highlight || null,
      event_link: event_link || null,
      city: city || null,
      location: location || null,
      short_description: short_description || null,
      tags: tags || null,
      image_url: image_url || null,
      interest_type: interest_type || "free_listing",
      status: "new",
    });

    if (error) {
      console.error("Erro ao salvar submissão:", error);
      return NextResponse.json(
        { error: `Erro ao salvar no Supabase: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recebemos seu evento. Vamos analisar as informações.",
    });
  } catch (err) {
    console.error("Erro geral event-submissions:", err);
    return NextResponse.json(
      { error: "Erro ao enviar formulário." },
      { status: 500 }
    );
  }
}