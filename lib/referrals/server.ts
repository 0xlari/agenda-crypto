import { supabaseServer } from "@/lib/supabase/server";

export const REFERRAL_COOKIE_NAME = "agenda_referral_code";
export const REFERRAL_VISITOR_COOKIE_NAME = "agenda_referral_visitor";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export type ReferralAction =
  | "general_visit"
  | "event_visit"
  | "newsletter_signup";

export type ReferralSourceType =
  | "general"
  | "agenda"
  | "event"
  | "trail"
  | "newsletter";

export type ReferralProfile = {
  id: string;
  user_id: string | null;
  email: string | null;
  display_name: string;
  code: string;
  total_points: number;
};

const POINTS_BY_ACTION: Record<ReferralAction, number> = {
  general_visit: 1,
  event_visit: 2,
  newsletter_signup: 5,
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

export function createReferralCodeSeed(name?: string | null, email?: string | null) {
  const nameCode = normalizeReferralCode(name);

  if (nameCode) {
    return nameCode;
  }

  const emailPrefix = typeof email === "string" ? email.split("@")[0] : "";
  const emailCode = normalizeReferralCode(emailPrefix);

  return emailCode || "agenda";
}

async function findProfileByUserId(userId: string) {
  const { data, error } = await supabaseServer
    .from("referral_profiles")
    .select("id, user_id, email, display_name, code, total_points")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar perfil referral:", error.message);
    return null;
  }

  return data as ReferralProfile | null;
}

export async function getReferralProfileByCode(code: string) {
  const normalizedCode = normalizeReferralCode(code);

  if (!normalizedCode) {
    return null;
  }

  const { data, error } = await supabaseServer
    .from("referral_profiles")
    .select("id, user_id, email, display_name, code, total_points")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar referral por codigo:", error.message);
    return null;
  }

  return data as ReferralProfile | null;
}

export async function getOrCreateReferralProfile({
  userId,
  email,
  displayName,
  preferredCode,
}: {
  userId: string;
  email?: string | null;
  displayName?: string | null;
  preferredCode?: string | null;
}) {
  const existingProfile = await findProfileByUserId(userId);

  if (existingProfile) {
    return existingProfile;
  }

  const baseCode =
    normalizeReferralCode(preferredCode) ||
    createReferralCodeSeed(displayName, email);
  const safeDisplayName = displayName?.trim() || email || "Agenda Crypto";

  for (let index = 0; index < 10; index += 1) {
    const code = index === 0 ? baseCode : `${baseCode}-${index + 1}`;

    const { data, error } = await supabaseServer
      .from("referral_profiles")
      .insert({
        user_id: userId,
        email: email || null,
        display_name: safeDisplayName,
        code,
      })
      .select("id, user_id, email, display_name, code, total_points")
      .single();

    if (!error && data) {
      return data as ReferralProfile;
    }

    if (error?.code === "23505") {
      continue;
    }

    console.error("Erro ao criar perfil referral:", error?.message);
    throw new Error("Nao foi possivel criar o link de indicacao.");
  }

  throw new Error("Nao foi possivel gerar um codigo unico.");
}

export async function recordReferralEvent({
  code,
  visitorId,
  action,
  sourceType,
  eventId,
  eventSlug,
  subscriberEmail,
  metadata = {},
}: {
  code: string;
  visitorId: string;
  action: ReferralAction;
  sourceType: ReferralSourceType;
  eventId?: string | null;
  eventSlug?: string | null;
  subscriberEmail?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const normalizedCode = normalizeReferralCode(code);
  const safeVisitorId = visitorId.trim().slice(0, 120);

  if (!normalizedCode || !safeVisitorId) {
    return { recorded: false, duplicate: false, profile: null };
  }

  const profile = await getReferralProfileByCode(normalizedCode);

  if (!profile) {
    return { recorded: false, duplicate: false, profile: null };
  }

  const points = POINTS_BY_ACTION[action];
  const dedupeKey = [
    action,
    profile.id,
    safeVisitorId,
    eventSlug || "general",
    subscriberEmail || "",
  ].join(":");

  const { error } = await supabaseServer.from("referral_events").insert({
    profile_id: profile.id,
    referred_visitor_id: safeVisitorId,
    action,
    points,
    source_type: sourceType,
    event_id: eventId || null,
    event_slug: eventSlug || null,
    subscriber_email: subscriberEmail || null,
    dedupe_key: dedupeKey,
    metadata,
  });

  if (error) {
    if (error.code === "23505") {
      return { recorded: false, duplicate: true, profile };
    }

    console.error("Erro ao registrar referral:", error.message);
    return { recorded: false, duplicate: false, profile };
  }

  return { recorded: true, duplicate: false, profile };
}
