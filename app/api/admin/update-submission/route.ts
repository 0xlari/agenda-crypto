import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

export async function POST(req: Request) {
  try {
    const auth = await authorizeAdmin(req);
    if (auth.error) return auth.error;

    const body = await req.json();

    console.log("BODY UPDATE SUBMISSION:", body);

    const {
      submissionId,
      contact_name,
      email,
      whatsapp,
      event_title,
      event_date,
      end_date,
      event_time,
      city,
      location,
      event_link,
      short_description,
      tags,
      image_url,
      interest_type,
      internal_notes,
      agenda_highlight,
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId é obrigatório." },
        { status: 400 }
      );
    }

    const { error } = await auth.admin
      .from("event_submissions")
      .update({
        contact_name: contact_name || null,
        email: email || null,
        whatsapp: whatsapp || null,
        event_title: event_title || null,
        event_date: event_date || null,
        end_date: end_date || null,
        event_time: event_time || null,
        city: city || null,
        location: location || null,
        event_link: event_link || null,
        short_description: short_description || null,
        tags: tags || null,
        image_url: image_url || null,
        interest_type: interest_type || null,
        internal_notes: internal_notes || null,
        agenda_highlight: agenda_highlight || null,
      })
      .eq("id", submissionId);

    if (error) {
      console.error("ERRO UPDATE SUBMISSION:", error);

      return NextResponse.json(
        { error: `Erro ao atualizar submissão: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submissão atualizada com sucesso.",
    });
  } catch (err) {
    console.error("ERRO GERAL UPDATE SUBMISSION:", err);

    return NextResponse.json(
      { error: "Erro interno ao atualizar submissão." },
      { status: 500 }
    );
  }
}
