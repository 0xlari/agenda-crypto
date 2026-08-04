import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
