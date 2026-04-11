import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { submissionId, leadStatus } = await req.json();

    if (!submissionId || !leadStatus) {
      return NextResponse.json(
        { error: "submissionId e leadStatus são obrigatórios." },
        { status: 400 }
      );
    }

    const allowed = ["new", "contacted", "negotiating", "closed", "lost"];

    if (!allowed.includes(leadStatus)) {
      return NextResponse.json(
        { error: "leadStatus inválido." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("event_submissions")
      .update({
        lead_status: leadStatus,
      })
      .eq("id", submissionId);

    if (error) {
      return NextResponse.json(
        { error: `Erro ao atualizar status: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status atualizado com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral update-lead-status:", err);
    return NextResponse.json(
      { error: "Erro interno ao atualizar status." },
      { status: 500 }
    );
  }
}