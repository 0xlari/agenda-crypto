import { supabaseServer } from "@/lib/supabase/server";

export async function getAdminDashboardData() {
  const { data: overviewData, error: overviewError } = await supabaseServer
    .from("admin_overview_summary")
    .select("*")
    .single();

  if (overviewError) {
    throw new Error(overviewError.message);
  }

  const { data: hotEvents, error: hotEventsError } = await supabaseServer
    .from("admin_event_analytics_summary")
    .select("*")
    .order("intelligence_score", { ascending: false })
    .limit(10);

  if (hotEventsError) {
    throw new Error(hotEventsError.message);
  }

  const totalViews = Number(overviewData?.total_views ?? 0);
  const totalUniqueLoggedViews = Number(
    overviewData?.total_unique_logged_views ?? 0
  );
  const totalSaves = Number(overviewData?.total_saves ?? 0);
  const totalGoing = Number(overviewData?.total_going ?? 0);
  const totalCheckins = Number(overviewData?.total_checkins ?? 0);
  const totalPasses = Number(overviewData?.total_passes ?? 0);
  const totalRegistrationClicks = Number(
    overviewData?.total_registration_clicks ?? 0
  );

  const totalIntentions = totalSaves + totalGoing;

  const intentRate =
    totalViews > 0
      ? Number(((totalIntentions / totalViews) * 100).toFixed(2))
      : 0;

  const loggedUserIntentRate =
    totalUniqueLoggedViews > 0
      ? Number(((totalIntentions / totalUniqueLoggedViews) * 100).toFixed(2))
      : 0;

  const showUpRate =
    totalGoing > 0
      ? Number(((totalCheckins / totalGoing) * 100).toFixed(2))
      : 0;

  return {
    overview: {
      activeEvents: overviewData?.active_events ?? 0,
      publishedEvents: overviewData?.published_events ?? 0,
      totalUsers: overviewData?.total_users ?? 0,
      totalViews,
      totalUniqueLoggedViews,
      totalSaves,
      totalGoing,
      totalIntentions,
      totalCheckins,
      totalPasses,
      totalRegistrationClicks,
      pendingSubmissions: overviewData?.pending_submissions ?? 0,
      totalSubscribers: overviewData?.total_subscribers ?? 0,
      intentRate,
      loggedUserIntentRate,
      showUpRate,
    },
    hotEvents: hotEvents ?? [],
  };
}