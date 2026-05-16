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

  /*
   * INTERAÇÕES LOGADAS
   */

  const { data: loggedInteractionsData, error: loggedInteractionsError } =
    await supabaseServer
      .from("event_interactions")
      .select("user_id")
      .not("user_id", "is", null);

  if (loggedInteractionsError) {
    throw new Error(loggedInteractionsError.message);
  }

  const totalLoggedInteractions = loggedInteractionsData.length;

  const totalActiveUsers = new Set(
    loggedInteractionsData.map((item) => item.user_id)
  ).size;

  /*
   * PASSES ÚNICOS
   */

  const { data: uniquePassUsersData, error: uniquePassUsersError } =
    await supabaseServer
      .from("user_passes")
      .select("user_id")
      .eq("verified", true);

  if (uniquePassUsersError) {
    throw new Error(uniquePassUsersError.message);
  }

  const totalUsersWithPass = new Set(
    uniquePassUsersData.map((item) => item.user_id)
  ).size;

  /*
   * TOP CIDADES
   */

  const { data: cityEventsData, error: cityEventsError } =
    await supabaseServer
      .from("events")
      .select("city")
      .eq("published", true);

  if (cityEventsError) {
    throw new Error(cityEventsError.message);
  }

  const cityMap = new Map<string, number>();

  cityEventsData.forEach((event) => {
    if (!event.city) return;

    cityMap.set(event.city, (cityMap.get(event.city) || 0) + 1);
  });

  const topCities = Array.from(cityMap.entries())
    .map(([city, total]) => ({
      city,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  /*
   * TOP CATEGORIAS
   */

  const { data: categoryEventsData, error: categoryEventsError } =
    await supabaseServer
      .from("events")
      .select("category")
      .eq("published", true);

  if (categoryEventsError) {
    throw new Error(categoryEventsError.message);
  }

  const categoryMap = new Map<string, number>();

  categoryEventsData.forEach((event) => {
    if (!event.category) return;

    categoryMap.set(
      event.category,
      (categoryMap.get(event.category) || 0) + 1
    );
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  /*
   * MÉTRICAS PRINCIPAIS
   */

  const totalViews = Number(overviewData?.total_views ?? 0);

  const totalUniqueLoggedViews = Number(
    overviewData?.total_unique_logged_views ?? 0
  );

  const totalSaves = Number(overviewData?.total_saves ?? 0);

  const totalGoing = Number(overviewData?.total_going ?? 0);

  const totalCheckins = Number(
    overviewData?.total_checkins ?? 0
  );

  const totalPasses = Number(
    overviewData?.total_passes ?? 0
  );

  const totalRegistrationClicks = Number(
    overviewData?.total_registration_clicks ?? 0
  );

  const totalIntentions = totalSaves + totalGoing;

  /*
   * TAXAS
   */

  const intentRate =
    totalViews > 0
      ? Number(
          ((totalIntentions / totalViews) * 100).toFixed(2)
        )
      : 0;

  const actionsPerLoggedUser =
    totalUniqueLoggedViews > 0
      ? Number(
          (totalIntentions / totalUniqueLoggedViews).toFixed(2)
        )
      : 0;

  const showUpRate =
    totalGoing > 0
      ? Number(
          ((totalCheckins / totalGoing) * 100).toFixed(2)
        )
      : 0;

  const registrationCtr =
    totalViews > 0
      ? Number(
          (
            (totalRegistrationClicks / totalViews) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    overview: {
      activeEvents: overviewData?.active_events ?? 0,

      publishedEvents:
        overviewData?.published_events ?? 0,

      totalUsers:
        overviewData?.total_users ?? 0,

      totalActiveUsers,

      totalLoggedInteractions,

      totalUsersWithPass,

      totalViews,

      totalUniqueLoggedViews,

      totalSaves,

      totalGoing,

      totalIntentions,

      totalCheckins,

      totalPasses,

      totalRegistrationClicks,

      pendingSubmissions:
        overviewData?.pending_submissions ?? 0,

      totalSubscribers:
        overviewData?.total_subscribers ?? 0,

      intentRate,

      actionsPerLoggedUser,

      showUpRate,

      registrationCtr,
    },

    hotEvents: hotEvents ?? [],

    topCities,

    topCategories,
  };
}