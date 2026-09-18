import { NextResponse } from "next/server";
import { authorizeUser } from "@/lib/supabase/user-auth";
import { getInitialTraits } from "@/lib/mascot/getInitialMascot";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { user_id, goal, vibe, interests } = body;

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id é obrigatório." },
        { status: 400 }
      );
    }

    const auth = await authorizeUser(request, user_id);
    if (auth.error) return auth.error;

    if (!goal || !vibe) {
      return NextResponse.json(
        { error: "goal e vibe são obrigatórios." },
        { status: 400 }
      );
    }

    const selectedTraits = getInitialTraits(vibe);

    const { data, error } = await auth.admin
      .from("user_mascots")
      .upsert(
        {
          user_id: auth.user.id,
          goal,
          vibe,
          interests: interests ?? [],
          level: 1,
          xp: 0,
          agenda_pass_count: 0,
          selected_traits: selectedTraits,
          unlocked_traits: Object.values(selectedTraits),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Erro Supabase ao criar mascote:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mascot: data,
    });
  } catch (error) {
    console.error("Erro em /api/mascot/onboarding:", error);

    return NextResponse.json(
      { error: "Erro interno ao criar mascote." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id é obrigatório." },
        { status: 400 }
      );
    }

    const auth = await authorizeUser(request, user_id);
    if (auth.error) return auth.error;

    const { data, error } = await auth.admin
      .from("user_mascots")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (error) {
      console.error("Erro Supabase ao buscar mascote:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mascot: data,
    });
  } catch (error) {
    console.error("Erro ao buscar mascote:", error);

    return NextResponse.json(
      { error: "Erro interno ao buscar mascote." },
      { status: 500 }
    );
  }
}
