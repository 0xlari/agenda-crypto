import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getInitialTraits, type MascotVibe } from "@/lib/mascot/getInitialMascot";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

function parseInterests(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

const MASCOT_VIBES = new Set<MascotVibe>([
  "street",
  "cyber",
  "cute",
  "futuristic",
  "minimal",
  "surprise",
]);

function parseMascotVibe(value: unknown) {
  if (typeof value !== "string") return null;

  return MASCOT_VIBES.has(value as MascotVibe) ? (value as MascotVibe) : null;
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { user_id, goal, vibe, interests } = await request.json();

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const parsedVibe = parseMascotVibe(vibe);

    if (typeof goal !== "string" || !parsedVibe) {
      return NextResponse.json(
        { error: "goal e vibe sao obrigatorios." },
        { status: 400 }
      );
    }

    const selectedTraits = getInitialTraits(parsedVibe);

    const { data, error } = await supabaseServer
      .from("user_mascots")
      .upsert(
        {
          user_id: auth.user.id,
          goal,
          vibe: parsedVibe,
          interests: parseInterests(interests),
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
        { error: "Nao foi possivel criar o mascote." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, mascot: data });
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
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { data, error } = await supabaseServer
      .from("user_mascots")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (error) {
      console.error("Erro Supabase ao buscar mascote:", error);
      return NextResponse.json(
        { error: "Nao foi possivel buscar o mascote." },
        { status: 500 }
      );
    }

    return NextResponse.json({ mascot: data });
  } catch (error) {
    console.error("Erro ao buscar mascote:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar mascote." },
      { status: 500 }
    );
  }
}
