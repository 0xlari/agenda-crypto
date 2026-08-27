import {
  normalizeEventIntelligenceInput,
  type EventIntelligencePayload,
  type EventIntelligenceRecord,
} from "@/lib/event-intelligence";
import { supabaseServer } from "@/lib/supabase/server";

export async function getEventIntelligence(eventId: string) {
  const { data, error } = await supabaseServer
    .from("event_intelligence")
    .select("*")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as EventIntelligenceRecord | null;
}

export async function getEventWithIntelligence(eventId: string) {
  const { data, error } = await supabaseServer
    .from("events")
    .select(
      `
      *,
      event_intelligence (*)
    `
    )
    .eq("id", eventId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function upsertEventIntelligence(
  eventId: string,
  input: unknown
) {
  const payload: EventIntelligencePayload =
    normalizeEventIntelligenceInput(input);

  const { data, error } = await supabaseServer
    .from("event_intelligence")
    .upsert(
      {
        event_id: eventId,
        ...payload,
      },
      { onConflict: "event_id" }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as EventIntelligenceRecord;
}
