import { NextResponse } from "next/server";
import {
  EventLinkExtractionError,
  extractEventFromUrl,
} from "@/lib/event-link-extractor";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      event_url?: unknown;
      url?: unknown;
      platform?: unknown;
    };

    const eventUrl =
      typeof body.event_url === "string"
        ? body.event_url
        : typeof body.url === "string"
          ? body.url
          : "";

    if (!eventUrl.trim()) {
      return NextResponse.json(
        { error: "Informe o link do evento." },
        { status: 400 }
      );
    }

    const event = await extractEventFromUrl(eventUrl, body.platform);

    if (!event.event_title) {
      return NextResponse.json(
        {
          error:
            "Não consegui identificar o nome do evento. Complete pelo formulário manual.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, event });
  } catch (error) {
    if (error instanceof EventLinkExtractionError) {
      return NextResponse.json(
        { error: error.publicMessage },
        { status: error.status }
      );
    }

    console.error("Erro ao extrair evento por link:", error);

    return NextResponse.json(
      { error: "Não consegui extrair esse link. Você pode preencher manualmente." },
      { status: 500 }
    );
  }
}
