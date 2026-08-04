import { NextResponse } from "next/server";
import {
  recordReferralEvent,
  type ReferralAction,
  type ReferralSourceType,
} from "@/lib/referrals/server";

const actions: ReferralAction[] = [
  "general_visit",
  "event_visit",
  "newsletter_signup",
];
const sourceTypes: ReferralSourceType[] = [
  "general",
  "agenda",
  "event",
  "trail",
  "newsletter",
];

function isReferralAction(value: unknown): value is ReferralAction {
  return typeof value === "string" && actions.includes(value as ReferralAction);
}

function isReferralSourceType(value: unknown): value is ReferralSourceType {
  return (
    typeof value === "string" &&
    sourceTypes.includes(value as ReferralSourceType)
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      code?: unknown;
      visitorId?: unknown;
      action?: unknown;
      sourceType?: unknown;
      eventId?: unknown;
      eventSlug?: unknown;
    };

    if (
      typeof body.code !== "string" ||
      typeof body.visitorId !== "string" ||
      !isReferralAction(body.action) ||
      !isReferralSourceType(body.sourceType)
    ) {
      return NextResponse.json(
        { error: "Dados de referral invalidos." },
        { status: 400 }
      );
    }

    const result = await recordReferralEvent({
      code: body.code,
      visitorId: body.visitorId,
      action: body.action,
      sourceType: body.sourceType,
      eventId: typeof body.eventId === "string" ? body.eventId : null,
      eventSlug: typeof body.eventSlug === "string" ? body.eventSlug : null,
      metadata: {
        route: "client-referral-track",
      },
    });

    return NextResponse.json({
      success: true,
      recorded: result.recorded,
      duplicate: result.duplicate,
    });
  } catch (error) {
    console.error("Erro em /api/referrals/track:", error);

    return NextResponse.json(
      { error: "Nao foi possivel registrar referral agora." },
      { status: 500 }
    );
  }
}
