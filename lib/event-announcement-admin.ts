import type {
  EventAnnouncement,
  EventAnnouncementDuplicate,
  EventAnnouncementInsert,
  EventAnnouncementSource,
} from "@/lib/event-announcement";

type UnknownRecord = Record<string, unknown>;

const HTTP_URL = /^https?:\/\/[^\s]+$/i;
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export type AnnouncementPayload = EventAnnouncementInsert & {
  id?: string;
};

export function normalizeAnnouncementPayload(value: unknown): AnnouncementPayload {
  const input = (value && typeof value === "object" ? value : {}) as UnknownRecord;
  const text = (key: string) =>
    typeof input[key] === "string" ? input[key].trim() : "";
  const nullableText = (key: string) => text(key) || null;
  const sources = Array.isArray(input.sources)
    ? input.sources.map((source) => {
        const item = (source && typeof source === "object" ? source : {}) as UnknownRecord;
        return {
          url: typeof item.url === "string" ? item.url.trim() : "",
          type: typeof item.type === "string" ? item.type : "other",
          date: typeof item.date === "string" ? item.date : "",
        } as EventAnnouncementSource;
      })
    : [];

  return {
    id: text("id") || undefined,
    title: text("title"),
    slug: text("slug") || slugify(`${text("title")}-${text("expected_year")}`),
    organizer: text("organizer"),
    country: text("country"),
    city: nullableText("city"),
    expected_year: Number(input.expected_year),
    expected_period: nullableText("expected_period"),
    official_url: text("official_url"),
    sources,
    summary: nullableText("summary"),
    agenda_insight: nullableText("agenda_insight"),
    internal_notes: nullableText("internal_notes"),
    image_url: nullableText("image_url"),
    confidence:
      input.confidence === "medium" || input.confidence === "high"
        ? input.confidence
        : "low",
    status:
      input.status === "review" ||
      input.status === "published" ||
      input.status === "archived"
        ? input.status
        : "draft",
    last_verified_at: nullableText("last_verified_at"),
    next_verification_at: nullableText("next_verification_at"),
    published_at: nullableText("published_at"),
    promoted_event_id: nullableText("promoted_event_id"),
  };
}

export function validateAnnouncement(
  payload: AnnouncementPayload,
  targetStatus = payload.status || "draft"
) {
  const errors: string[] = [];
  const year = new Date().getUTCFullYear();

  if (!payload.title) errors.push("Informe o título.");
  if (payload.title.length > 300) errors.push("O título deve ter no máximo 300 caracteres.");
  if (!payload.organizer) errors.push("Informe um organizador identificável.");
  if (payload.organizer.length > 200) errors.push("O organizador deve ter no máximo 200 caracteres.");
  if (!payload.country) errors.push("Informe o país.");
  if (payload.country && (payload.country.length < 2 || payload.country.length > 100)) {
    errors.push("O país deve ter entre 2 e 100 caracteres.");
  }
  if (payload.city && payload.city.length > 150) errors.push("A cidade deve ter no máximo 150 caracteres.");
  if (payload.expected_period && payload.expected_period.length > 100) {
    errors.push("O período esperado deve ter no máximo 100 caracteres.");
  }
  if (!Number.isInteger(payload.expected_year) || payload.expected_year < year) {
    errors.push(`O ano não pode ser anterior a ${year}.`);
  }
  if (!HTTP_URL.test(payload.official_url)) {
    errors.push("Informe uma URL oficial válida (http ou https).");
  }
  if (payload.official_url.length > 2048) errors.push("A URL oficial é muito longa.");
  if (payload.image_url && !HTTP_URL.test(payload.image_url)) {
    errors.push("A URL da imagem precisa usar http ou https.");
  }
  payload.sources?.forEach((source, index) => {
    if (!HTTP_URL.test(source.url)) errors.push(`A URL da fonte ${index + 1} é inválida.`);
    if (!DATE_ONLY.test(source.date)) errors.push(`A data da fonte ${index + 1} é inválida.`);
    if (!(["official", "press", "social", "other"] as string[]).includes(source.type)) {
      errors.push(`O tipo da fonte ${index + 1} é inválido.`);
    }
  });
  if (targetStatus === "published" && !payload.sources?.some((source) => source.type === "official")) {
    errors.push("A publicação exige ao menos uma fonte oficial.");
  }
  if (
    payload.next_verification_at &&
    Number.isNaN(new Date(payload.next_verification_at).getTime())
  ) {
    errors.push("A data da próxima verificação é inválida.");
  }

  return [...new Set(errors)];
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 190);
}

function normalized(value: unknown) {
  return typeof value === "string"
    ? value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim()
    : "";
}

function recordValue(row: UnknownRecord, keys: string[]) {
  for (const key of keys) if (row[key] !== null && row[key] !== undefined) return row[key];
  return null;
}

function recordYear(row: UnknownRecord) {
  const direct = recordValue(row, ["expected_year", "year"]);
  if (typeof direct === "number") return direct;
  if (typeof direct === "string" && /^\d{4}$/.test(direct)) return Number(direct);
  const date = recordValue(row, ["start_date", "event_date", "date"]);
  const match = typeof date === "string" ? date.match(/\b(20\d{2})\b/) : null;
  return match ? Number(match[1]) : null;
}

export function findDuplicatesInRows(
  payload: AnnouncementPayload,
  rowsByTable: Record<EventAnnouncementDuplicate["table"], UnknownRecord[]>
) {
  const result: EventAnnouncementDuplicate[] = [];
  const wanted = {
    title: normalized(payload.title),
    url: normalized(payload.official_url).replace(/\/$/, ""),
    organizer: normalized(payload.organizer),
    year: payload.expected_year,
  };

  for (const [table, rows] of Object.entries(rowsByTable) as Array<
    [EventAnnouncementDuplicate["table"], UnknownRecord[]]
  >) {
    for (const row of rows) {
      if (payload.id && table === "event_announcements" && row.id === payload.id) continue;
      const matches: EventAnnouncementDuplicate["matches"] = [];
      const title = recordValue(row, ["title", "event_title", "name"]);
      const url = recordValue(row, [
        "official_url", "event_url", "event_link", "registration_url", "website", "url",
      ]);
      const organizer = recordValue(row, ["organizer", "organizer_name", "contact_name"]);
      if (wanted.title && normalized(title) === wanted.title) matches.push("title");
      if (wanted.url && normalized(url).replace(/\/$/, "") === wanted.url) matches.push("url");
      if (wanted.organizer && normalized(organizer) === wanted.organizer) matches.push("organizer");
      if (recordYear(row) === wanted.year) matches.push("year");

      const strongMatch = matches.includes("url") || matches.includes("title");
      const compositeMatch =
        matches.includes("organizer") && matches.includes("year");
      if (strongMatch || compositeMatch) {
        result.push({
          key: `${table}:${String(row.id || row.slug || result.length)}`,
          table,
          id: String(row.id || row.slug || "sem-id"),
          title: String(title || "Registro sem título"),
          matches,
        });
      }
    }
  }
  return result.slice(0, 25);
}

export function toDatabasePayload(payload: AnnouncementPayload) {
  const record = { ...payload };
  delete record.id;
  return record as EventAnnouncementInsert;
}

export function isVerificationStale(announcement: EventAnnouncement) {
  if (!announcement.last_verified_at) return true;
  if (announcement.next_verification_at) {
    return new Date(announcement.next_verification_at).getTime() < Date.now();
  }
  return Date.now() - new Date(announcement.last_verified_at).getTime() > 30 * 86_400_000;
}
