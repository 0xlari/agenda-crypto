import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

export async function POST(req: Request) {
  try {
    const auth = await authorizeAdmin(req);
    if (auth.error) return auth.error;

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

    const { error } = await auth.admin
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
