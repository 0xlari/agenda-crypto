import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId é obrigatório." }, { status: 400 });
    }

    const auth = await authorizeUser(request, userId);
    if (auth.error) return auth.error;

    const { data, error } = await auth.admin
      .from("user_passes")
      .select(`
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
      `)
      .eq("user_id", auth.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar passes" },
      { status: 500 }
    );
  }
}
