import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { id, name, email, avatar_url } = await request.json();

    if (!sameAuthenticatedUser(id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Dados obrigatorios ausentes" },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer.from("users").upsert(
      {
        id: auth.user.id,
        name: typeof name === "string" ? name : "",
        email,
        avatar_url: typeof avatar_url === "string" ? avatar_url : "",
      },
      { onConflict: "id" }
    );

    if (error) {
      return NextResponse.json(
        { error: "Nao foi possivel salvar o usuario." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar user:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
