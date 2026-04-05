import { supabaseServer } from "@/lib/supabase/server";

function nowIso() {
  return new Date().toISOString();
}

export async function getPublishedEvents(tag?: string) {
  const now = nowIso();

  let query = supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .or(`end_date.gte.${now},and(end_date.is.null,start_date.gte.${now})`)
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
  const now = nowIso();

  const { data, error } = await supabaseServer
    .from("events")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .or(`end_date.gte.${now},and(end_date.is.null,start_date.gte.${now})`)
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
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar evento:", error.message);
    return null;
  }

  return data;
}