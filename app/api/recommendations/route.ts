import { NextResponse } from "next/server";
import { getRecommendedEvents } from "@/lib/supabase/queries";
import { authorizeUser } from "@/lib/supabase/user-auth";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const auth = await authorizeUser(request, userId);
    if (auth.error) return auth.error;

    const data = await getRecommendedEvents(auth.user.id);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar recomendações" },
      { status: 500 }
    );
  }
}
