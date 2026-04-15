import { NextResponse } from "next/server";
import { getRecommendedEvents } from "@/lib/supabase/queries";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    const data = await getRecommendedEvents(userId);

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Erro ao buscar recomendações:", error);
    return NextResponse.json(
      { error: "Erro interno ao buscar recomendações" },
      { status: 500 }
    );
  }
}