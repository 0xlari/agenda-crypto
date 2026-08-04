import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

function normalizePage(value: unknown) {
  if (typeof value !== "string") return null;

  const page = value.trim();

  if (!page || page.length > 180) return null;

  return page;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const page = normalizePage(body?.page);

    if (!page) {
      return NextResponse.json(
        { error: "Page e obrigatoria." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const { error } = await supabase.from("page_views").insert({
      page,
    });

    if (error) {
      console.error("Erro ao registrar page view:", error.message);

      return NextResponse.json(
        { error: "Erro ao registrar acesso." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro geral page-view:", err);

    return NextResponse.json(
      { error: "Erro ao registrar acesso." },
      { status: 500 }
    );
  }
}
