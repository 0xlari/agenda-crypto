import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";

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

    const { data: rejectedSubmission, error } = await auth.admin
      .from("event_submissions")
      .update({
        status: "rejected",
        rejected_at: new Date().toISOString(),
      })
      .eq("id", submissionId)
      .select("id,status")
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: `Erro ao rejeitar submissão: ${error.message}` },
        { status: 500 }
      );
    }

    if (!rejectedSubmission) {
      return NextResponse.json(
        { error: "Submissão não encontrada para rejeição." },
        { status: 404 }
      );
    }

    if (rejectedSubmission.status !== "rejected") {
      return NextResponse.json(
        { error: "A submissão não foi marcada como rejeitada." },
        { status: 500 }
      );
    }

    revalidatePath("/admin");

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
