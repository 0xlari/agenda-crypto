import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  calculateMascotLevel,
  calculateXpFromPasses,
  getUnlockedTraitByPassCount,
} from "@/lib/mascot/progression";
import {
  requireAuthenticatedUser,
  sameAuthenticatedUser,
} from "@/lib/supabase/auth-server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_id, user_id, response, action } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: "event_id e obrigatorio." },
        { status: 400 }
      );
    }

    if (!user_id && !response && !action) {
      const { data, error } = await supabaseAdmin
        .from("event_responses")
        .select("response")
        .eq("event_id", event_id);

      if (error) {
        return NextResponse.json(
          { error: "Nao foi possivel carregar a contagem." },
          { status: 500 }
        );
      }

      const going = (data ?? []).filter(
        (item) => item.response === "going" || item.response === "confirmed"
      ).length;

      return NextResponse.json({ going });
    }

    const auth = await requireAuthenticatedUser(request);

    if (!auth.ok) {
      return NextResponse.json({ error: auth.message }, { status: auth.status });
    }

    if (!sameAuthenticatedUser(user_id, auth.user.id)) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const { data: existingResponse, error: existingError } = await supabaseAdmin
      .from("event_responses")
      .select("id, response")
      .eq("event_id", event_id)
      .eq("user_id", auth.user.id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: "Nao foi possivel carregar a resposta." },
        { status: 500 }
      );
    }

    const nextResponse =
      action === "confirm_presence" || response === "confirmed"
        ? "confirmed"
        : response === "not_going"
          ? "not_going"
          : "going";

    if (existingResponse?.id) {
      const { error: updateError } = await supabaseAdmin
        .from("event_responses")
        .update({ response: nextResponse })
        .eq("id", existingResponse.id)
        .eq("user_id", auth.user.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Nao foi possivel atualizar a resposta." },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("event_responses")
        .insert({
          event_id,
          user_id: auth.user.id,
          response: nextResponse,
        });

      if (insertError) {
        return NextResponse.json(
          { error: "Nao foi possivel criar a resposta." },
          { status: 500 }
        );
      }
    }

    const shouldEvolveMascot =
      nextResponse === "confirmed" && existingResponse?.response !== "confirmed";

    let mascotUpdated = false;
    let unlockedTrait = null;

    if (shouldEvolveMascot) {
      const { data: currentMascot, error: mascotError } = await supabaseAdmin
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

      if (currentMascot) {
        const newPassCount = (currentMascot.agenda_pass_count ?? 0) + 1;
        const newLevel = calculateMascotLevel(newPassCount);
        const newXp = calculateXpFromPasses(newPassCount);

        unlockedTrait = getUnlockedTraitByPassCount(newPassCount);

        const selectedTraits = currentMascot.selected_traits ?? {};
        const unlockedTraits = currentMascot.unlocked_traits ?? [];

        let updatedSelectedTraits = selectedTraits;
        let updatedUnlockedTraits = unlockedTraits;

        if (unlockedTrait) {
          updatedSelectedTraits = {
            ...selectedTraits,
            [unlockedTrait.type]: unlockedTrait.src,
          };

          updatedUnlockedTraits = [
            ...unlockedTraits,
            {
              type: unlockedTrait.type,
              src: unlockedTrait.src,
              label: unlockedTrait.label,
              unlocked_at: new Date().toISOString(),
            },
          ];
        }

        const { error: updateMascotError } = await supabaseAdmin
          .from("user_mascots")
          .update({
            agenda_pass_count: newPassCount,
            level: newLevel,
            xp: newXp,
            selected_traits: updatedSelectedTraits,
            unlocked_traits: updatedUnlockedTraits,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", auth.user.id);

        if (updateMascotError) {
          return NextResponse.json(
            { error: "Nao foi possivel atualizar o mascote." },
            { status: 500 }
          );
        }

        mascotUpdated = true;
      }
    }

    const { data: countData, error: countError } = await supabaseAdmin
      .from("event_responses")
      .select("response")
      .eq("event_id", event_id);

    if (countError) {
      return NextResponse.json(
        { error: "Nao foi possivel recalcular a contagem." },
        { status: 500 }
      );
    }

    const going = (countData ?? []).filter(
      (item) => item.response === "going" || item.response === "confirmed"
    ).length;

    return NextResponse.json({
      success: true,
      response: nextResponse,
      going,
      mascotUpdated,
      unlockedTrait,
    });
  } catch (error) {
    console.error("Erro em /api/event-response:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
