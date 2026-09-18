import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes" },
        { status: 400 }
      );
    }

    const auth = await authorizeUser(request, id);
    if (auth.error) return auth.error;

    const email = auth.user.email;
    if (!email) {
      return NextResponse.json({ error: "E-mail da conta indisponível." }, { status: 400 });
    }

    const metadata = auth.user.user_metadata || {};

    const { error } = await auth.admin
      .from("users")
      .upsert(
        {
          id: auth.user.id,
          name: metadata.full_name || metadata.name || email.split("@")[0],
          email,
          avatar_url: metadata.avatar_url || metadata.picture || null,
        },
        { onConflict: "id" }
      );

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar user:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}
