import { NextResponse } from "next/server";
import { getOrCreateReferralProfile } from "@/lib/referrals/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      userId?: unknown;
      email?: unknown;
      displayName?: unknown;
      preferredCode?: unknown;
    };

    const userId = typeof body.userId === "string" ? body.userId.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";
    const preferredCode =
      typeof body.preferredCode === "string" ? body.preferredCode.trim() : "";

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Entre com sua conta para criar seu link." },
        { status: 401 }
      );
    }

    const profile = await getOrCreateReferralProfile({
      userId,
      email,
      displayName,
      preferredCode,
    });

    return NextResponse.json({
      profile: {
        code: profile.code,
        displayName: profile.display_name,
        totalPoints: profile.total_points,
      },
    });
  } catch (error) {
    console.error("Erro em /api/referrals/me:", error);

    return NextResponse.json(
      { error: "Nao foi possivel carregar seu link agora." },
      { status: 500 }
    );
  }
}
