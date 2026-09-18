import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

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
    const auth = await authorizeAdmin(req);
    if (auth.error) return auth.error;

    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId é obrigatório." },
        { status: 400 }
      );
    }

    const { data: submission, error: submissionError } = await auth.admin
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

    const { error: eventInsertError } = await auth.admin.from("events").insert({
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
        ? submission.tags.map((tag: string) => tag.trim())
        : submission.tags
          ? submission.tags.split(",").map((tag: string) => tag.trim())
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

    const { error: updateSubmissionError } = await auth.admin
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
