create or replace function public.is_valid_event_announcement_sources(value jsonb)
returns boolean
language sql
immutable
strict
parallel safe
security invoker
set search_path = ''
as $$
  select case
    when pg_catalog.jsonb_typeof(value) <> 'array' then false
    else not exists (
      select 1
      from pg_catalog.jsonb_array_elements(value) as source(item)
      where pg_catalog.jsonb_typeof(item) <> 'object'
        or pg_catalog.jsonb_typeof(item -> 'url') is distinct from 'string'
        or item ->> 'url' !~* '^https?://[^[:space:]]+$'
        or pg_catalog.jsonb_typeof(item -> 'type') is distinct from 'string'
        or item ->> 'type' not in ('official', 'press', 'social', 'other')
        or pg_catalog.jsonb_typeof(item -> 'date') is distinct from 'string'
        or item ->> 'date' !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
    )
  end;
$$;

revoke all on function public.is_valid_event_announcement_sources(jsonb) from public;
grant execute on function public.is_valid_event_announcement_sources(jsonb) to service_role;

create table public.event_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 300),
  slug text not null unique check (
    char_length(slug) between 1 and 200
    and slug = lower(slug)
    and slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'
  ),
  organizer text not null check (char_length(btrim(organizer)) between 1 and 200),
  country text not null check (char_length(btrim(country)) between 2 and 100),
  city text check (city is null or char_length(btrim(city)) between 1 and 150),
  expected_year integer not null check (expected_year between 2026 and 2100),
  expected_period text check (
    expected_period is null
    or char_length(btrim(expected_period)) between 1 and 100
  ),
  official_url text not null check (
    char_length(official_url) <= 2048
    and official_url ~* '^https?://[^[:space:]]+$'
  ),
  sources jsonb not null default '[]'::jsonb check (
    public.is_valid_event_announcement_sources(sources)
  ),
  summary text check (summary is null or char_length(btrim(summary)) > 0),
  agenda_insight text check (
    agenda_insight is null or char_length(btrim(agenda_insight)) > 0
  ),
  internal_notes text,
  image_url text check (
    image_url is null
    or (
      char_length(image_url) <= 2048
      and image_url ~* '^https?://[^[:space:]]+$'
    )
  ),
  confidence text not null default 'low' check (
    confidence in ('low', 'medium', 'high')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'review', 'published', 'promoted', 'archived')
  ),
  last_verified_at timestamptz,
  next_verification_at timestamptz,
  published_at timestamptz,
  promoted_event_id uuid references public.events(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_announcements_published_requirements_check check (
    status <> 'published'
    or (
      published_at is not null
      and sources @? '$[*] ? (@.type == "official")'
    )
  ),
  constraint event_announcements_promotion_check check (
    (status = 'promoted') = (promoted_event_id is not null)
  )
);

comment on table public.event_announcements is
  'Preliminary event announcements kept separate from confirmed events.';
comment on column public.event_announcements.sources is
  'Array of objects with url, type (official, press, social, other), and date (YYYY-MM-DD).';

create index event_announcements_status_idx
  on public.event_announcements (status);

create index event_announcements_expected_year_idx
  on public.event_announcements (expected_year);

create index event_announcements_country_idx
  on public.event_announcements (lower(country));

create unique index event_announcements_dedup_idx
  on public.event_announcements (
    lower(btrim(title)),
    lower(btrim(organizer)),
    expected_year,
    lower(btrim(official_url))
  );

create index event_announcements_promoted_event_id_idx
  on public.event_announcements (promoted_event_id)
  where promoted_event_id is not null;

create or replace function public.touch_event_announcement_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.statement_timestamp();
  return new;
end;
$$;

revoke all on function public.touch_event_announcement_updated_at() from public;
grant execute on function public.touch_event_announcement_updated_at() to service_role;

create trigger event_announcements_touch_updated_at
before update on public.event_announcements
for each row
execute function public.touch_event_announcement_updated_at();

alter table public.event_announcements enable row level security;

create policy "Published event announcements are publicly readable"
on public.event_announcements
for select
to anon, authenticated
using (status = 'published');

revoke all on table public.event_announcements from public, anon, authenticated;
grant select on table public.event_announcements to anon, authenticated;
grant select, insert, update, delete on table public.event_announcements to service_role;
