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

    const { userId } = await request.json();

    if (!sameAuthenticatedUser(userId, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("user_passes")
      .select(
        `
        id,
        serial,
        pass_type,
        verified,
        events (
          id,
          title,
          slug,
          city,
          start_date
        )
      `
      )
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Nao foi possivel buscar passes." },
        { status: 400 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro ao buscar passes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar passes" },
      { status: 500 }
    );
  }
}
