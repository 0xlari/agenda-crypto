import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { event_id } = await request.json();

    if (!event_id) {
      return NextResponse.json(
        { error: "event_id é obrigatório." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("event_responses")
      .select("response")
      .eq("event_id", event_id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const going = data.filter((item) => item.response === "going").length;

    return NextResponse.json({
      going,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}