import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId é obrigatório." },
        { status: 400 }
      );
    }

    const { data: submission, error: submissionError } = await supabase
      .from("event_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission) {
      return NextResponse.json(
        { error: "Submissão não encontrada." },
        { status: 404 }
      );
    }

    const baseSlug = normalizeSlug(submission.event_title || "evento");
    const slug = `${baseSlug}-${Date.now()}`;

    const { error: eventInsertError } = await supabase.from("events").insert({
      title: submission.event_title,
      slug,
      short_description: submission.short_description || null,
      description: submission.short_description || null,
      city: submission.city || null,
      country: "Brazil",
      venue: submission.location || null,
      is_online:
        submission.location?.toLowerCase().includes("online") || false,
      start_date: submission.event_date || null,
      end_date: submission.event_date || null,
      category: submission.tags || null,
      tags: submission.tags || null,
      registration_url: submission.event_link || null,
      image_url: submission.image_url || null,
      featured: false,
      published: true,
    });

    if (eventInsertError) {
      console.error("Erro ao criar evento:", eventInsertError);
      return NextResponse.json(
        { error: `Erro ao criar evento: ${eventInsertError.message}` },
        { status: 500 }
      );
    }

    const { error: updateSubmissionError } = await supabase
      .from("event_submissions")
      .update({
        status: "approved",
      })
      .eq("id", submissionId);

    if (updateSubmissionError) {
      console.error("Erro ao atualizar submissão:", updateSubmissionError);
      return NextResponse.json(
        { error: `Evento criado, mas falhou ao atualizar submissão: ${updateSubmissionError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Evento aprovado e publicado com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral approve-submission:", err);
    return NextResponse.json(
      { error: "Erro interno ao aprovar submissão." },
      { status: 500 }
    );
  }
}