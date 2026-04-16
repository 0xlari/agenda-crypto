import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    const { data, error } = await supabaseServer
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar passes" },
      { status: 500 }
    );
  }
}