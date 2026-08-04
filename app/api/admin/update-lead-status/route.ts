import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdminUser } from "@/lib/supabase/auth-server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const auth = await requireAdminUser(req);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

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
      console.error("Erro ao atualizar status do lead:", error);

      return NextResponse.json(
        { error: "Nao foi possivel atualizar o status." },
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
