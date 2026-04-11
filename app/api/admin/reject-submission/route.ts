import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { submissionId } = await req.json();

    if (!submissionId) {
      return NextResponse.json(
        { error: "submissionId é obrigatório." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("event_submissions")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (error) {
      return NextResponse.json(
        { error: `Erro ao rejeitar submissão: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submissão rejeitada com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral reject-submission:", err);
    return NextResponse.json(
      { error: "Erro interno ao rejeitar submissão." },
      { status: 500 }
    );
  }
}