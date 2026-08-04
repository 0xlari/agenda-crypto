import { NextResponse } from "next/server";

import { requireAdminUser } from "@/lib/supabase/auth-server";
import { getAdminDashboardData } from "@/lib/supabase/admin-queries";

export async function GET(request: Request) {
  const auth = await requireAdminUser(request);

  if (!auth.ok) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  try {
    const data = await getAdminDashboardData();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Admin dashboard fetch failed", error);

    return NextResponse.json(
      { error: "Nao foi possivel carregar o dashboard." },
      { status: 500 }
    );
  }
}
