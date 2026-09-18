import { authorizeAdmin } from "@/lib/supabase/admin-auth";
import { getAdminDashboardData } from "@/lib/supabase/admin-queries";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  try {
    return Response.json(await getAdminDashboardData());
  } catch (error) {
    console.error("admin dashboard metrics error", error);
    return Response.json({ error: "Não foi possível carregar os indicadores." }, { status: 500 });
  }
}
