import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/supabase/auth-server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const auth = await requireAdminUser(req);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const supabase = getSupabaseServer();
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
      console.error("Erro ao rejeitar submissao:", error);

      return NextResponse.json(
        { error: "Nao foi possivel rejeitar a submissao." },
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
