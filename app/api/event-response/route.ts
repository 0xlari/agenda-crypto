import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  calculateMascotLevel,
  calculateXpFromPasses,
  getUnlockedTraitByPassCount,
} from "@/lib/mascot/progression";

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
        { error: "event_id é obrigatório." },
        { status: 400 }
      );
    }

    /*
      CASO 1:
      Se o front mandar apenas event_id,
      essa rota continua funcionando como contador de "vou".
    */
    if (!user_id && !response && !action) {
      const { data, error } = await supabaseAdmin
        .from("event_responses")
        .select("response")
        .eq("event_id", event_id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const going = (data ?? []).filter(
        (item) => item.response === "going" || item.response === "confirmed"
      ).length;

      return NextResponse.json({
        going,
      });
    }

    /*
      Daqui pra baixo precisa de usuário,
      porque vamos salvar resposta individual.
    */
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id é obrigatório para salvar resposta." },
        { status: 400 }
      );
    }

    /*
      Busca se esse usuário já respondeu esse evento.
      Isso evita duplicar presença e evita somar Agenda Pass mais de uma vez.
    */
    const { data: existingResponse, error: existingError } = await supabaseAdmin
      .from("event_responses")
      .select("id, response")
      .eq("event_id", event_id)
      .eq("user_id", user_id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json(
        { error: existingError.message },
        { status: 500 }
      );
    }

    /*
      Define qual resposta vamos salvar.
      - "going" = pessoa marcou "vou"
      - "confirmed" = pessoa confirmou presença no evento
    */
    const nextResponse =
      action === "confirm_presence" || response === "confirmed"
        ? "confirmed"
        : response === "not_going"
          ? "not_going"
          : "going";

    /*
      Atualiza ou cria resposta do evento.
      Não uso upsert aqui para não depender de constraint única no banco.
    */
    if (existingResponse?.id) {
      const { error: updateError } = await supabaseAdmin
        .from("event_responses")
        .update({
          response: nextResponse,
        })
        .eq("id", existingResponse.id);

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("event_responses")
        .insert({
          event_id,
          user_id,
          response: nextResponse,
        });

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    /*
      Só evolui mascote quando for confirmação real de presença.
      E só soma se a pessoa ainda NÃO tinha confirmado esse evento antes.
    */
    const shouldEvolveMascot =
      nextResponse === "confirmed" && existingResponse?.response !== "confirmed";

    let mascotUpdated = false;
    let unlockedTrait = null;

    if (shouldEvolveMascot) {
      const { data: currentMascot, error: mascotError } = await supabaseAdmin
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

      /*
        Se a pessoa ainda não criou mascote, não quebra o fluxo.
        A presença é confirmada normalmente.
      */
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
          .eq("user_id", user_id);

        if (updateMascotError) {
          return NextResponse.json(
            { error: updateMascotError.message },
            { status: 500 }
          );
        }

        mascotUpdated = true;
      }
    }

    /*
      Recalcula o contador atualizado.
    */
    const { data: countData, error: countError } = await supabaseAdmin
      .from("event_responses")
      .select("response")
      .eq("event_id", event_id);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
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