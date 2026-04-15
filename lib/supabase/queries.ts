import { supabaseServer } from "./server";

function nowIso() {
  return new Date().toISOString();
}

export async function getPublishedEvents(tag?: string) {
  const today = new Date().toISOString().split("T")[0];

  let query = supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .order("start_date", { ascending: true });

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar eventos:", error.message);
    return [];
  }

  return data;
}

export async function getFeaturedEvents() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Erro ao buscar eventos em destaque:", error.message);
    return [];
  }

  return data;
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabaseServer
    .from("events")
    .select(`
      id,
      title,
      slug,
      short_description,
      description,
      city,
      venue,
      start_date,
      end_date,
      event_time,
      registration_url,
      image_url,
      tags,
      category,
      event_type,
      level,
      intent,
      audience,
      source_url,
      agenda_highlight,
      parent_event_id
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar evento:", error.message);
    return null;
  }

  return data;
}

export async function getChildEvents(parentId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .eq("parent_event_id", parentId)
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Erro ao buscar side events:", error.message);
    return [];
  }

  return data;
}

export async function getUserAgenda(userId: string) {
  const { data, error } = await supabaseServer
    .from("event_interactions")
    .select(`
      type,
      events (*)
    `)
    .eq("user_id", userId)
    .in("type", ["save", "rsvp_yes"]);

  if (error) {
    console.error("Erro ao buscar agenda:", error);
    return [];
  }

  return data;
}

export async function getRelatedEvents(event: any) {
  if (!event) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .neq("id", event.id)
    .eq("published", true)
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .limit(20);

  if (error) {
    console.error("Erro ao buscar relacionados:", error);
    return [];
  }

  const scored = (data || []).map((item: any) => {
    let score = 0;

    if (item.category === event.category) score += 3;
    if (item.event_type === event.event_type) score += 2;
    if (item.city === event.city) score += 2;

    if (
      item.parent_event_id &&
      event.parent_event_id &&
      item.parent_event_id === event.parent_event_id
    ) {
      score += 4;
    }

    if (item.level && event.level && item.level === event.level) {
      score += 1;
    }

    return { ...item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 6);
}

export async function getRecommendedEvents(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data: interactions, error: interactionsError } = await supabaseServer
    .from("event_interactions")
    .select(`
      type,
      event_id,
      events (
        id,
        title,
        slug,
        city,
        category,
        event_type,
        level,
        parent_event_id
      )
    `)
    .eq("user_id", userId)
    .in("type", ["save", "rsvp_yes"]);

  if (interactionsError) {
    console.error("Erro ao buscar interações do usuário:", interactionsError);
    return [];
  }

  if (!interactions || interactions.length === 0) {
    return [];
  }

  const interactedEventIds = interactions.map((item: any) => item.event_id);

  const categories = [
    ...new Set(
      interactions
        .map((item: any) => item.events?.category)
        .filter(Boolean)
    ),
  ];

  const cities = [
    ...new Set(
      interactions
        .map((item: any) => item.events?.city)
        .filter(Boolean)
    ),
  ];

  const eventTypes = [
    ...new Set(
      interactions
        .map((item: any) => item.events?.event_type)
        .filter(Boolean)
    ),
  ];

  let query = supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .or(`end_date.gte.${today},and(end_date.is.null,start_date.gte.${today})`)
    .limit(30);

  if (interactedEventIds.length > 0) {
    query = query.not(
      "id",
      "in",
      `(${interactedEventIds.map((id: string) => `"${id}"`).join(",")})`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Erro ao buscar recomendados:", error);
    return [];
  }

  const scored = (data || []).map((event: any) => {
    let score = 0;

    if (categories.includes(event.category)) score += 3;
    if (eventTypes.includes(event.event_type)) score += 2;
    if (cities.includes(event.city)) score += 2;
    if (event.parent_event_id) score += 2;
    if (event.level === "advanced") score += 1;

    return { ...event, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 6);
}