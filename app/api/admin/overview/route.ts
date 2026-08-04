import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/supabase/auth-server";
import { getSupabaseServer } from "@/lib/supabase/server";

async function getAdminData(supabase: ReturnType<typeof getSupabaseServer>) {
  const today = new Date().toISOString();

  const [
    { count: publishedCount },
    { count: activeCount },
    { count: goingCount },
    { count: agendaViewsCount },
  ] = await Promise.all([
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("published", true)
      .gte("end_date", today),
    supabase
      .from("event_responses")
      .select("*", { count: "exact", head: true })
      .eq("response", "going"),
    supabase
      .from("page_views")
      .select("*", { count: "exact", head: true })
      .eq("page", "agenda"),
  ]);

  const { data: pendingEvents } = await supabase
    .from("events")
    .select("id,title,city,start_date,published")
    .eq("published", false)
    .order("start_date", { ascending: true });

  const { data: leads } = await supabase
    .from("event_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  const { data: pendingSubmissions } = await supabase
    .from("event_submissions")
    .select("*")
    .eq("interest_type", "free_listing")
    .eq("status", "new")
    .order("created_at", { ascending: false });

  return {
    stats: {
      publishedCount: publishedCount || 0,
      activeCount: activeCount || 0,
      goingCount: goingCount || 0,
      agendaViewsCount: agendaViewsCount || 0,
      leadsCount: leads?.length || 0,
    },
    pendingEvents: pendingEvents || [],
    leads: leads || [],
    pendingSubmissions: pendingSubmissions || [],
  };
}

export async function GET(request: Request) {
  const auth = await requireAdminUser(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const supabase = getSupabaseServer();
    const data = await getAdminData(supabase);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao carregar admin overview:", error);
    return NextResponse.json(
      { error: "Nao foi possivel carregar o painel." },
      { status: 500 }
    );
  }
}
