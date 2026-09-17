export const EVENT_ANNOUNCEMENT_SOURCE_TYPES = [
  "official",
  "press",
  "social",
  "other",
] as const;

export type EventAnnouncementSourceType =
  (typeof EVENT_ANNOUNCEMENT_SOURCE_TYPES)[number];

export const EVENT_ANNOUNCEMENT_CONFIDENCE_LEVELS = [
  "low",
  "medium",
  "high",
] as const;

export type EventAnnouncementConfidence =
  (typeof EVENT_ANNOUNCEMENT_CONFIDENCE_LEVELS)[number];

export const EVENT_ANNOUNCEMENT_STATUSES = [
  "draft",
  "review",
  "published",
  "promoted",
  "archived",
] as const;

export type EventAnnouncementStatus =
  (typeof EVENT_ANNOUNCEMENT_STATUSES)[number];

export type EventAnnouncementSource = {
  url: string;
  type: EventAnnouncementSourceType;
  date: string;
};

export type EventAnnouncement = {
  id: string;
  title: string;
  slug: string;
  organizer: string;
  country: string;
  city: string | null;
  expected_year: number;
  expected_period: string | null;
  official_url: string;
  sources: EventAnnouncementSource[];
  summary: string | null;
  agenda_insight: string | null;
  internal_notes: string | null;
  image_url: string | null;
  confidence: EventAnnouncementConfidence;
  status: EventAnnouncementStatus;
  last_verified_at: string | null;
  next_verification_at: string | null;
  published_at: string | null;
  promoted_event_id: string | null;
  created_at: string;
  updated_at: string;
};

export type EventAnnouncementInsert = Pick<
  EventAnnouncement,
  | "title"
  | "slug"
  | "organizer"
  | "country"
  | "expected_year"
  | "official_url"
> &
  Partial<
    Pick<
      EventAnnouncement,
      | "city"
      | "expected_period"
      | "sources"
      | "summary"
      | "agenda_insight"
      | "internal_notes"
      | "image_url"
      | "confidence"
      | "status"
      | "last_verified_at"
      | "next_verification_at"
      | "published_at"
      | "promoted_event_id"
    >
  >;
