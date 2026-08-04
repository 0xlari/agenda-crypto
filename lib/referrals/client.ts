import type { ReferralSourceType } from "@/lib/referrals/server";

export const REFERRAL_STORAGE_KEY = "agenda_crypto_referral";
export const REFERRAL_VISITOR_STORAGE_KEY = "agenda_crypto_referral_visitor";
export const REFERRAL_COOKIE_NAME = "agenda_referral_code";
export const REFERRAL_VISITOR_COOKIE_NAME = "agenda_referral_visitor";
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

export type StoredReferral = {
  code: string;
  sourceType: ReferralSourceType;
  eventSlug?: string | null;
  capturedAt: string;
};

export function normalizeReferralCode(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Max-Age=${THIRTY_DAYS_IN_SECONDS}; Path=/; SameSite=Lax`;
}

function getCookie(name: string) {
  return document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`))
    ?.split("=")[1];
}

export function getReferralVisitorId() {
  if (typeof window === "undefined") {
    return "";
  }

  const storedVisitorId = window.localStorage.getItem(
    REFERRAL_VISITOR_STORAGE_KEY
  );

  if (storedVisitorId) {
    setCookie(REFERRAL_VISITOR_COOKIE_NAME, storedVisitorId);
    return storedVisitorId;
  }

  const cookieVisitorId = getCookie(REFERRAL_VISITOR_COOKIE_NAME);

  if (cookieVisitorId) {
    const visitorId = decodeURIComponent(cookieVisitorId);
    window.localStorage.setItem(REFERRAL_VISITOR_STORAGE_KEY, visitorId);
    return visitorId;
  }

  const visitorId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(REFERRAL_VISITOR_STORAGE_KEY, visitorId);
  setCookie(REFERRAL_VISITOR_COOKIE_NAME, visitorId);

  return visitorId;
}

export function saveReferralContext({
  code,
  sourceType,
  eventSlug,
}: {
  code: string;
  sourceType: ReferralSourceType;
  eventSlug?: string | null;
}) {
  if (typeof window === "undefined") {
    return null;
  }

  const normalizedCode = normalizeReferralCode(code);

  if (!normalizedCode) {
    return null;
  }

  const referral: StoredReferral = {
    code: normalizedCode,
    sourceType,
    eventSlug: eventSlug || null,
    capturedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(REFERRAL_STORAGE_KEY, JSON.stringify(referral));
  setCookie(REFERRAL_COOKIE_NAME, normalizedCode);

  return referral;
}

export function getStoredReferralContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.localStorage.getItem(REFERRAL_STORAGE_KEY);

  if (!stored) {
    const cookieCode = getCookie(REFERRAL_COOKIE_NAME);
    const code = normalizeReferralCode(
      cookieCode ? decodeURIComponent(cookieCode) : ""
    );

    return code
      ? {
          code,
          sourceType: "general",
          eventSlug: null,
          capturedAt: new Date().toISOString(),
        }
      : null;
  }

  try {
    const parsed = JSON.parse(stored) as StoredReferral;

    if (!normalizeReferralCode(parsed.code)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
