-- internal_notes is deliberately unavailable through the public Data API.
-- Administrative reads use the server-only service role after validating the
-- caller's Supabase access token and app_metadata role.
revoke select on table public.event_announcements from anon, authenticated;

grant select (
  id,
  title,
  slug,
  organizer,
  country,
  city,
  expected_year,
  expected_period,
  official_url,
  sources,
  summary,
  agenda_insight,
  image_url,
  confidence,
  status,
  last_verified_at,
  next_verification_at,
  published_at,
  promoted_event_id,
  created_at,
  updated_at
) on table public.event_announcements to anon, authenticated;
