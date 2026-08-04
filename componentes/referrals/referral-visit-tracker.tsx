"use client";

import { useEffect } from "react";
import {
  getReferralVisitorId,
  normalizeReferralCode,
  saveReferralContext,
} from "@/lib/referrals/client";

type ReferralVisitTrackerProps = {
  eventId: string;
  eventSlug: string;
  hasTrail: boolean;
  referralCode?: string | null;
};

export default function ReferralVisitTracker({
  eventId,
  eventSlug,
  hasTrail,
  referralCode,
}: ReferralVisitTrackerProps) {

  useEffect(() => {
    const code = normalizeReferralCode(referralCode);

    if (!code) {
      return;
    }

    const sourceType = hasTrail ? "trail" : "event";
    const visitorId = getReferralVisitorId();

    saveReferralContext({
      code,
      sourceType,
      eventSlug,
    });

    fetch("/api/referrals/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        visitorId,
        action: "event_visit",
        sourceType,
        eventId,
        eventSlug,
      }),
    }).catch((error) => {
      console.error("Erro ao registrar visita referral:", error);
    });
  }, [eventId, eventSlug, hasTrail, referralCode]);

  return null;
}
