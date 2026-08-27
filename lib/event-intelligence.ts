export type IntelligenceJsonItem = Record<string, string>;

export type KeySpeakerItem = IntelligenceJsonItem;
export type KeyCompanyItem = IntelligenceJsonItem;
export type ResearchSourceItem = IntelligenceJsonItem;
export type RelatedNewsItem = IntelligenceJsonItem;
export type SideEventItem = IntelligenceJsonItem;
export type MarketSignalItem = IntelligenceJsonItem;

export type EventIntelligencePayload = {
  organizer_name: string | null;
  organizer_url: string | null;
  organizer_relevance: string | null;
  edition_number: number | null;
  event_history: string | null;
  event_positioning: string | null;
  key_speakers: KeySpeakerItem[];
  key_companies: KeyCompanyItem[];
  key_institutions: IntelligenceJsonItem[];
  sponsors: IntelligenceJsonItem[];
  partners: IntelligenceJsonItem[];
  main_topics: string[];
  market_signals: MarketSignalItem[];
  notable_announcements: IntelligenceJsonItem[];
  regional_context: string | null;
  ecosystem_context: string | null;
  competitive_events: IntelligenceJsonItem[];
  why_it_matters: string | null;
  who_should_go: string | null;
  who_should_skip: string | null;
  business_opportunity: string | null;
  networking_opportunity: string | null;
  editorial_angle: string | null;
  agenda_take: string | null;
  side_events: SideEventItem[];
  related_news: RelatedNewsItem[];
  relevant_links: IntelligenceJsonItem[];
  research_sources: ResearchSourceItem[];
  research_confidence: string | null;
  research_status: string;
  research_notes: string | null;
  research_updated_at: string | null;
};

export type EventIntelligenceRecord = EventIntelligencePayload & {
  id: string;
  event_id: string;
  created_at: string;
  updated_at: string;
};

const jsonListKeys = [
  "key_speakers",
  "key_companies",
  "key_institutions",
  "sponsors",
  "partners",
  "market_signals",
  "notable_announcements",
  "competitive_events",
  "side_events",
  "related_news",
  "relevant_links",
  "research_sources",
] as const;

const textKeys = [
  "organizer_name",
  "organizer_url",
  "organizer_relevance",
  "event_history",
  "event_positioning",
  "regional_context",
  "ecosystem_context",
  "why_it_matters",
  "who_should_go",
  "who_should_skip",
  "business_opportunity",
  "networking_opportunity",
  "editorial_angle",
  "agenda_take",
  "research_confidence",
  "research_notes",
  "research_updated_at",
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Record<string, unknown>;
}

function normalizeText(value: unknown): string | null {
  if (value === null || value === undefined) return null;

  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

function normalizeInteger(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;

  const numberValue = Number(value);
  if (!Number.isFinite(numberValue)) return null;

  const integerValue = Math.trunc(numberValue);
  return integerValue > 0 ? integerValue : null;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => normalizeText(item))
    .filter((item): item is string => Boolean(item));
}

function normalizeJsonList(value: unknown): IntelligenceJsonItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const record = asRecord(item);

      return Object.fromEntries(
        Object.entries(record).map(([key, entryValue]) => [
          key,
          entryValue === null || entryValue === undefined ? "" : String(entryValue),
        ])
      ) as IntelligenceJsonItem;
    })
    .filter((item) => Object.values(item).some((entryValue) => entryValue.trim()));
}

export function buildEmptyEventIntelligencePayload(): EventIntelligencePayload {
  return {
    organizer_name: null,
    organizer_url: null,
    organizer_relevance: null,
    edition_number: null,
    event_history: null,
    event_positioning: null,
    key_speakers: [],
    key_companies: [],
    key_institutions: [],
    sponsors: [],
    partners: [],
    main_topics: [],
    market_signals: [],
    notable_announcements: [],
    regional_context: null,
    ecosystem_context: null,
    competitive_events: [],
    why_it_matters: null,
    who_should_go: null,
    who_should_skip: null,
    business_opportunity: null,
    networking_opportunity: null,
    editorial_angle: null,
    agenda_take: null,
    side_events: [],
    related_news: [],
    relevant_links: [],
    research_sources: [],
    research_confidence: null,
    research_status: "draft",
    research_notes: null,
    research_updated_at: null,
  };
}

export function normalizeEventIntelligenceInput(
  input: unknown
): EventIntelligencePayload {
  const source = asRecord(input);
  const payload = buildEmptyEventIntelligencePayload();

  textKeys.forEach((key) => {
    payload[key] = normalizeText(source[key]);
  });

  payload.edition_number = normalizeInteger(source.edition_number);
  payload.main_topics = normalizeStringArray(source.main_topics);
  payload.research_status = normalizeText(source.research_status) || "draft";

  jsonListKeys.forEach((key) => {
    payload[key] = normalizeJsonList(source[key]) as never;
  });

  return payload;
}
