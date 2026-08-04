import { NextRequest, NextResponse } from "next/server";
import {
  REFERRAL_COOKIE_MAX_AGE,
  REFERRAL_COOKIE_NAME,
  REFERRAL_VISITOR_COOKIE_NAME,
  normalizeReferralCode,
  recordReferralEvent,
} from "@/lib/referrals/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const normalizedCode = normalizeReferralCode(code);
  const visitorId =
    request.cookies.get(REFERRAL_VISITOR_COOKIE_NAME)?.value ||
    crypto.randomUUID();
  const redirectUrl = new URL("/agenda", request.url);
  const response = NextResponse.redirect(redirectUrl);

  if (!normalizedCode) {
    return response;
  }

  await recordReferralEvent({
    code: normalizedCode,
    visitorId,
    action: "general_visit",
    sourceType: "general",
    metadata: {
      route: `/r/${normalizedCode}`,
    },
  });

  response.cookies.set(REFERRAL_COOKIE_NAME, normalizedCode, {
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  response.cookies.set(REFERRAL_VISITOR_COOKIE_NAME, visitorId, {
    maxAge: REFERRAL_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
