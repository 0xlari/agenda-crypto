import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { page } = await req.json();

    if (!page) {
      return NextResponse.json(
        { error: "Page é obrigatória." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("page_views").insert({
      page,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erro ao registrar acesso." },
      { status: 500 }
    );
  }
}