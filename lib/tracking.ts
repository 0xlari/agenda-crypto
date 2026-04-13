import { supabaseServer } from "@/lib/supabase/server";

type TrackEventInput = {
  userId: string;
  eventId: string;
  type: "view" | "save" | "rsvp_yes" | "rsvp_no" | "checkin" | "click_kaira";
};

export async function trackEventInteraction({
  userId,
  eventId,
  type,
}: TrackEventInput) {
  const { error } = await supabaseServer
    .from("event_interactions")
    .insert({
      user_id: userId,
      event_id: eventId,
      type,
    });

  if (error) {
    console.error("Erro ao salvar interação:", error.message);
  }
}