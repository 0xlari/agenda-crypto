import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function normalizeEmail(value: unknown) {
  if (typeof value !== "string") return null;

  const email = value.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return null;
  }

  return email;
}

function normalizeSource(value: unknown) {
  if (typeof value !== "string") return "site";

  return value.trim().slice(0, 80) || "site";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body?.email);
    const source = normalizeSource(body?.source);

    if (!email) {
      return NextResponse.json(
        { error: "Email valido e obrigatorio" },
        { status: 400 }
      );
    }

    const { data: existingSubscriber, error: checkError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar subscriber:", checkError.message);

      return NextResponse.json(
        { error: "Erro ao verificar email." },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: "Voce ja esta inscrito.",
      });
    }

    const { error: supabaseError } = await supabase
      .from("subscribers")
      .insert({
        email,
        source,
        status: "active",
      });

    if (supabaseError) {
      console.error("Erro Supabase subscribe:", supabaseError.message);

      return NextResponse.json(
        { error: "Erro ao salvar inscricao." },
        { status: 500 }
      );
    }

    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY!,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    if (!brevoResponse.ok) {
      console.error("Erro Brevo:", brevoResponse.status);

      return NextResponse.json(
        { error: "Salvou no Supabase, mas falhou no Brevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inscricao realizada com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral subscribe:", err);

    return NextResponse.json(
      { error: "Erro ao cadastrar email" },
      { status: 500 }
    );
  }
}
