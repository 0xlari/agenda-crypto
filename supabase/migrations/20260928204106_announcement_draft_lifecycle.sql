alter table public.event_announcements
  add column start_date date,
  add column end_date date,
  add column event_time text,
  add column venue text,
  add column registration_url text,
  add column category text,
  add column event_type text,
  add column audience text;

alter table public.event_announcements
  drop constraint event_announcements_promotion_check,
  add constraint event_announcements_promotion_check
    check (status <> 'promoted' or promoted_event_id is not null),
  add constraint event_announcements_date_range_check
    check (end_date is null or start_date is null or end_date >= start_date),
  add constraint event_announcements_registration_url_check
    check (
      registration_url is null
      or (
        char_length(registration_url) <= 2048
        and registration_url ~* '^https?://[^[:space:]]+$'
      )
    );

comment on column public.event_announcements.promoted_event_id is
  'Draft or published event created from this announcement. The announcement remains published until the linked event is published.';
