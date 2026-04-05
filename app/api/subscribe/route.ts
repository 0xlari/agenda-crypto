import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return Response.json(
        { error: "Email é obrigatório." },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer
      .from("subscribers")
      .insert([{ email, source: "site" }]);

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return Response.json(
      { message: "Inscrição realizada com sucesso." },
      { status: 200 }
    );
  } catch {
    return Response.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}