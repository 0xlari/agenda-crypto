import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import {
  calculateMascotLevel,
  calculateXpFromPasses,
  getUnlockedTraitsByPassCount,
} from "@/lib/mascot/progression";

export async function POST(request: Request) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { error: "user_id é obrigatório." },
        { status: 400 }
      );
    }

    const { count, error: countError } = await supabaseServer
      .from("user_passes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user_id);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 500 }
      );
    }

    const agendaPassCount = count ?? 0;
    const level = calculateMascotLevel(agendaPassCount);
    const xp = calculateXpFromPasses(agendaPassCount);

    const { data: mascot, error: mascotError } = await supabaseServer
      .from("user_mascots")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (mascotError) {
      return NextResponse.json(
        { error: mascotError.message },
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

    /*
      Aplica no visual atual os traits desbloqueados por marco.
      Exemplo:
      6 passes:
      - sticker inicial
      - background especial
      - aura rara
    */
    const updatedSelectedTraits = {
      ...currentSelectedTraits,
    };

    for (const trait of milestoneTraits) {
      updatedSelectedTraits[trait.type] = trait.src;
    }

    /*
      Evita duplicar os traits na lista de desbloqueados.
    */
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

    const updatedUnlockedTraits = [
      ...currentUnlockedTraits,
      ...newUnlockedTraits,
    ];

    const { error: updateError } = await supabaseServer
      .from("user_mascots")
      .update({
        agenda_pass_count: agendaPassCount,
        level,
        xp,
        selected_traits: updatedSelectedTraits,
        unlocked_traits: updatedUnlockedTraits,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
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