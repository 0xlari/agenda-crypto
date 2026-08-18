import Link from "next/link";
import AdminDashboard from "@/componentes/admin-dashboard";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getAdminData() {
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
    .or("status.is.null,status.neq.rejected")
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

export default async function AdminPage() {
  const data = await getAdminData();

  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#19B5C9]">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Painel da Agenda Crypto</h1>
            <p className="mt-3 text-white/60">
              Operação, leads e visão geral do produto em um só lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/import-events"
              className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black"
            >
              Importar eventos
            </Link>

            <Link
              href="/agenda"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Ver agenda
            </Link>
          </div>
        </div>

        <AdminDashboard
          stats={data.stats}
          pendingEvents={data.pendingEvents}
          leads={data.leads}
          pendingSubmissions={data.pendingSubmissions}
        />
      </div>
    </main>
  );
}
