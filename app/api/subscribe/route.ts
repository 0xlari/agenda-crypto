import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  getReferralProfileByCode,
  normalizeReferralCode,
  recordReferralEvent,
  type ReferralSourceType,
} from "@/lib/referrals/server";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const referralSourceTypes: ReferralSourceType[] = [
  "general",
  "agenda",
  "event",
  "trail",
  "newsletter",
];

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeSource(value: unknown) {
  if (typeof value !== "string") {
    return "site";
  }

  const source = value.trim();

  return source ? source.slice(0, 80) : "site";
}

function normalizeReferralSourceType(value: unknown): ReferralSourceType {
  return typeof value === "string" &&
    referralSourceTypes.includes(value as ReferralSourceType)
    ? (value as ReferralSourceType)
    : "newsletter";
}

async function syncBrevoContact(email: string) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);

  if (!apiKey || !Number.isInteger(listId) || listId <= 0) {
    console.warn(
      "Newsletter cadastrada no Supabase, mas Brevo nao esta configurado."
    );
    return;
  }

  try {
    const brevoResponse = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (!brevoResponse.ok) {
      const brevoData = await brevoResponse.text();
      console.error("Erro Brevo newsletter:", brevoData);
    }
  } catch (error) {
    console.error("Erro ao sincronizar newsletter com Brevo:", error);
  }
}

type SupabaseMutationError = {
  code?: string;
  message: string;
};

type SubscribersTable = {
  insert: (
    payload: Record<string, string | null>
  ) => Promise<{ error: SupabaseMutationError | null }>;
};

async function insertSubscriber(
  supabase: NonNullable<ReturnType<typeof createSupabaseClient>>,
  payload: Record<string, string | null>
) {
  const subscribers = supabase.from(
    "subscribers"
  ) as unknown as SubscribersTable;
  const { error } = await subscribers.insert(payload);

  if (
    error &&
    (error.message.includes("referral_") || error.message.includes("referred_at"))
  ) {
    return subscribers.insert({
      email: payload.email,
      source: payload.source,
      status: payload.status,
    });
  }

  return { error };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      email?: unknown;
      source?: unknown;
      referralCode?: unknown;
      referralVisitorId?: unknown;
      referralSourceType?: unknown;
      referralEventSlug?: unknown;
    };
    const email = normalizeEmail(body.email);
    const source = normalizeSource(body.source);
    const referralCode = normalizeReferralCode(body.referralCode);
    const referralVisitorId =
      typeof body.referralVisitorId === "string"
        ? body.referralVisitorId.trim().slice(0, 120)
        : "";
    const referralSourceType = normalizeReferralSourceType(
      body.referralSourceType
    );
    const referralEventSlug =
      typeof body.referralEventSlug === "string"
        ? body.referralEventSlug.trim().slice(0, 180)
        : "";

    if (!email) {
      return NextResponse.json(
        { error: "Email e obrigatorio" },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Informe um email valido" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseClient();

    if (!supabase) {
      console.error("Supabase nao configurado para newsletter.");

      return NextResponse.json(
        { error: "Nao foi possivel cadastrar agora. Tente novamente em breve." },
        { status: 500 }
      );
    }

    const { data: existingSubscriber, error: checkError } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (checkError) {
      console.error("Erro ao verificar subscriber:", checkError);

      return NextResponse.json(
        { error: "Nao foi possivel verificar este email agora." },
        { status: 500 }
      );
    }

    if (existingSubscriber) {
      await syncBrevoContact(email);

      return NextResponse.json({
        success: true,
        message: "Voce ja esta inscrito.",
      });
    }

    const referralProfile = referralCode
      ? await getReferralProfileByCode(referralCode)
      : null;
    const { error: supabaseError } = await insertSubscriber(supabase, {
      email,
      source,
      status: "active",
      referral_code: referralCode || null,
      referral_profile_id: referralProfile?.id || null,
      referral_visitor_id: referralVisitorId || null,
      referred_at: referralCode ? new Date().toISOString() : null,
    });

    if (supabaseError) {
      console.error("Erro Supabase:", supabaseError);

      if (
        supabaseError.code === "23505" ||
        supabaseError.message.toLowerCase().includes("duplicate")
      ) {
        await syncBrevoContact(email);

        return NextResponse.json({
          success: true,
          message: "Voce ja esta inscrito.",
        });
      }

      return NextResponse.json(
        { error: "Nao foi possivel salvar seu email agora." },
        { status: 500 }
      );
    }

    if (referralCode && referralVisitorId) {
      await recordReferralEvent({
        code: referralCode,
        visitorId: referralVisitorId,
        action: "newsletter_signup",
        sourceType: referralSourceType,
        eventSlug: referralEventSlug || null,
        subscriberEmail: email,
        metadata: {
          source,
        },
      });
    }

    await syncBrevoContact(email);

    return NextResponse.json({
      success: true,
      message: "Inscricao realizada com sucesso.",
    });
  } catch (err) {
    console.error("Erro geral subscribe:", err);

    return NextResponse.json(
      { error: "Erro ao cadastrar email." },
      { status: 500 }
    );
  }
}
