import { authorizeAdmin } from "@/lib/supabase/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  const today = new Date().toISOString();
  const results = await Promise.all([
    auth.admin.from("events").select("id", { count: "exact", head: true }).eq("published", true),
    auth.admin.from("events").select("id", { count: "exact", head: true }).eq("published", true).gte("end_date", today),
    auth.admin.from("event_responses").select("id", { count: "exact", head: true }).eq("response", "going"),
    auth.admin.from("page_views").select("id", { count: "exact", head: true }).eq("page", "agenda"),
    auth.admin.from("events").select("id,title,city,start_date,published").eq("published", false).order("start_date", { ascending: true }),
    auth.admin.from("event_submissions").select("id,contact_name,email,whatsapp,event_title,interest_type,created_at,lead_status").or("status.is.null,status.neq.rejected").order("created_at", { ascending: false }).limit(20),
    auth.admin.from("event_submissions").select("id,contact_name,email,whatsapp,event_title,event_date,end_date,event_time,event_link,city,location,short_description,tags,created_at,lead_status,image_url,interest_type,internal_notes,agenda_highlight").eq("interest_type", "free_listing").eq("status", "new").order("created_at", { ascending: false }),
  ]);

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    console.error("admin overview query failed", failed.error);
    return Response.json({ error: "Não foi possível carregar o painel." }, { status: 500 });
  }

  const [published, active, going, agendaViews, pending, recentLeads, submissions] = results;

  return Response.json({
    stats: {
      publishedCount: published.count || 0,
      activeCount: active.count || 0,
      goingCount: going.count || 0,
      agendaViewsCount: agendaViews.count || 0,
      leadsCount: recentLeads.data?.length || 0,
    },
    pendingEvents: pending.data || [],
    leads: recentLeads.data || [],
    pendingSubmissions: submissions.data || [],
  });
}
