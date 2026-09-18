import { NextResponse } from "next/server";
import { authorizeAdmin } from "@/lib/supabase/admin-auth";
import {
  findDuplicatesInRows,
  normalizeAnnouncementPayload,
  slugify,
  toDatabasePayload,
  validateAnnouncement,
} from "@/lib/event-announcement-admin";
import type { EventAnnouncementStatus } from "@/lib/event-announcement";

export const dynamic = "force-dynamic";

function jsonError(error: string, status: number, details?: unknown) {
  return NextResponse.json({ error, details }, { status });
}

export async function GET(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  const status = new URL(request.url).searchParams.get("status");
  let query = auth.admin
    .from("event_announcements")
    .select("*")
    .order("updated_at", { ascending: false });
  if (status && status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) return jsonError("Não foi possível carregar os anúncios.", 500, error.message);
  return NextResponse.json({ announcements: data || [] });
}

async function duplicateRows(admin: NonNullable<Awaited<ReturnType<typeof authorizeAdmin>>["admin"]>) {
  const tables = [
    ["event_announcements", "id,title,slug,organizer,expected_year,official_url"],
    ["events", "id,title,slug,start_date,registration_url,source_url"],
    ["event_candidates", "id,title,start_date,event_url,source_url,organizer_name"],
    ["event_submissions", "id,event_title,event_date,event_link,contact_name"],
  ] as const;
  const entries = await Promise.all(
    tables.map(async ([table, columns]) => {
      const rows: Record<string, unknown>[] = [];
      for (let page = 0; ; page += 1) {
        const start = page * 1_000;
        const { data, error } = await admin
          .from(table)
          .select(columns as string)
          .range(start, start + 999);
        // Some deployments do not have the candidate intake table yet. Keep the other comparisons useful.
        if (error) {
          const missingCandidateTable =
            table === "event_candidates" &&
            (error.code === "42P01" || error.code === "PGRST205");
          if (missingCandidateTable) break;
          throw error;
        }
        if (!data?.length) break;
        rows.push(...(data as unknown as Record<string, unknown>[]));
        if (data.length < 1_000) break;
      }
      return [table, rows] as const;
    })
  );
  return Object.fromEntries(entries) as Parameters<typeof findDuplicatesInRows>[1];
}

export async function POST(request: Request) {
  const auth = await authorizeAdmin(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const payload = normalizeAnnouncementPayload(body.announcement);
    const targetStatus = (body.targetStatus || payload.status || "draft") as EventAnnouncementStatus;
    const allowedStatuses: EventAnnouncementStatus[] = ["draft", "review", "published", "archived"];
    if (!allowedStatuses.includes(targetStatus)) return jsonError("Status editorial inválido.", 400);

    const errors = validateAnnouncement(payload, targetStatus);
    if (errors.length) return jsonError("Revise os campos indicados.", 400, errors);

    const duplicates = findDuplicatesInRows(payload, await duplicateRows(auth.admin));
    if (body.action === "check") return NextResponse.json({ duplicates });
    if (duplicates.length && body.confirmDuplicates !== true) {
      return NextResponse.json(
        { error: "Encontramos possíveis duplicatas. Revise antes de continuar.", duplicates },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    const record = {
      ...toDatabasePayload(payload),
      status: targetStatus,
      published_at: targetStatus === "published" ? payload.published_at || now : payload.published_at,
    };

    if (body.action === "verify") {
      if (!payload.id) return jsonError("Anúncio não informado.", 400);
      record.last_verified_at = now;
    }

    if (payload.id) {
      const { data, error } = await auth.admin
        .from("event_announcements")
        .update(record)
        .eq("id", payload.id)
        .select("*")
        .single();
      if (error) return jsonError("Não foi possível atualizar o anúncio.", 500, error.message);
      return NextResponse.json({ announcement: data, duplicates });
    }

    let slug = payload.slug || slugify(`${payload.title}-${payload.expected_year}`);
    const { data: existingSlug } = await auth.admin
      .from("event_announcements")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existingSlug) slug = `${slug}-${crypto.randomUUID().slice(0, 8)}`;
    record.slug = slug;
    const { data, error } = await auth.admin
      .from("event_announcements")
      .insert(record)
      .select("*")
      .single();
    if (error) return jsonError("Não foi possível criar o anúncio.", 500, error.message);
    return NextResponse.json({ announcement: data, duplicates }, { status: 201 });
  } catch (error) {
    console.error("event-announcements admin error", error);
    return jsonError("Erro interno ao processar o anúncio.", 500);
  }
}
