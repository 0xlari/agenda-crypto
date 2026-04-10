import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório" },
        { status: 400 }
      );
    }

    const { data: existingSubscriber, error: checkError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar subscriber:", checkError);

      return NextResponse.json(
        { error: `Erro ao verificar email no Supabase: ${checkError.message}` },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        message: "Você já está inscrito 😉",
      });
    }

    const { error: supabaseError } = await supabase
      .from("subscribers")
      .insert({
        email,
        source: source || "site",
        status: "active",
      });

    if (supabaseError) {
      console.error("Erro Supabase:", supabaseError);

      return NextResponse.json(
        { error: `Erro ao salvar no Supabase: ${supabaseError.message}` },
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
      const brevoData = await brevoResponse.text();
      console.error("Erro Brevo:", brevoData);

      return NextResponse.json(
        { error: "Salvou no Supabase, mas falhou no Brevo." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Inscrição realizada com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral subscribe:", err);

    return NextResponse.json(
      { error: "Erro ao cadastrar email" },
      { status: 500 }
    );
  }
}