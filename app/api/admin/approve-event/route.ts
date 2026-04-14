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

function normalizeDate(dateStr?: string | null) {
  if (!dateStr) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr;
  }

  const brMatch = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brMatch) {
    const [, day, month, year] = brMatch;
    return `${year}-${month}-${day}`;
  }

  return null;
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

    const slug = `${normalizeSlug(submission.event_title || "evento")}-${Date.now()}`;

    const { error: eventInsertError } = await supabase.from("events").insert({
      title: submission.event_title,
      slug,
      short_description: submission.short_description || null,
      description: submission.short_description || null,
      city: submission.city || null,
      venue: submission.location || null,
      start_date: submission.event_date || null,
      end_date: submission.end_date || submission.event_date || null,
      event_time: submission.event_time || null,
      registration_url: submission.event_link || null,
      tags: Array.isArray(submission.tags)
        ? submission.tags.map((tag) => tag.trim())
        : submission.tags
          ? submission.tags.split(",").map((tag) => tag.trim())
          : [],
      image_url: submission.image_url || null,
      agenda_highlight: submission.agenda_highlight || null,
      published: true,
      featured: false,
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
      .update({ status: "approved" })
      .eq("id", submissionId);

    if (updateSubmissionError) {
      console.error("Erro ao atualizar submissão:", updateSubmissionError);
      return NextResponse.json(
        {
          error: `Evento criado, mas falhou ao atualizar submissão: ${updateSubmissionError.message}`,
        },
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