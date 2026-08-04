import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  calculateMascotLevel,
  calculateXpFromPasses,
  getUnlockedTraitsByPassCount,
} from "@/lib/mascot/progression";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    const { user_id } = await request.json();

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { count, error: countError } = await supabaseServer
      .from("user_passes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.user.id);

    if (countError) {
      return NextResponse.json(
        { error: "Nao foi possivel contar os passes." },
        { status: 500 }
      );
    }

    const agendaPassCount = count ?? 0;
    const level = calculateMascotLevel(agendaPassCount);
    const xp = calculateXpFromPasses(agendaPassCount);

    const { data: mascot, error: mascotError } = await supabaseServer
      .from("user_mascots")
      .select("*")
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (mascotError) {
      return NextResponse.json(
        { error: "Nao foi possivel carregar o mascote." },
        { status: 500 }
      );
    }

    if (!mascot) {
      return NextResponse.json({
        success: true,
        synced: false,
        agenda_pass_count: agendaPassCount,
        level,
        xp,
      });
    }

    const milestoneTraits = getUnlockedTraitsByPassCount(agendaPassCount);
    const currentSelectedTraits = mascot.selected_traits ?? {};
    const currentUnlockedTraits = Array.isArray(mascot.unlocked_traits)
      ? mascot.unlocked_traits
      : [];

    const updatedSelectedTraits = { ...currentSelectedTraits };

    for (const trait of milestoneTraits) {
      updatedSelectedTraits[trait.type] = trait.src;
    }

    const existingKeys = new Set(
      currentUnlockedTraits.map((trait: any) => `${trait.type}-${trait.src}`)
    );

    const newUnlockedTraits = milestoneTraits
      .filter((trait) => !existingKeys.has(`${trait.type}-${trait.src}`))
      .map((trait) => ({
        type: trait.type,
        src: trait.src,
        label: trait.label,
        milestone: trait.milestone,
        unlocked_at: new Date().toISOString(),
      }));

    const { error: updateError } = await supabaseServer
      .from("user_mascots")
      .update({
        agenda_pass_count: agendaPassCount,
        level,
        xp,
        selected_traits: updatedSelectedTraits,
        unlocked_traits: [...currentUnlockedTraits, ...newUnlockedTraits],
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", auth.user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Nao foi possivel sincronizar o mascote." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      synced: true,
      agenda_pass_count: agendaPassCount,
      level,
      xp,
      unlocked_traits: milestoneTraits,
    });
  } catch (error) {
    console.error("Erro em /api/mascot/sync:", error);
    return NextResponse.json(
      { error: "Erro interno ao sincronizar mascote." },
      { status: 500 }
    );
  }
}
