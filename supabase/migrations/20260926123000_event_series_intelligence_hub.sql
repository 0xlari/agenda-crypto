begin;

create table if not exists public.event_series (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  organizer_name text,
  organizer_url text,
  official_url text,
  image_url text,
  origin_city text,
  origin_country text,
  cadence text,
  main_focus text,
  audience text,
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.event_series enable row level security;
revoke all on table public.event_series from public, anon, authenticated;
grant all on table public.event_series to service_role;

alter table public.events
  add column if not exists series_id uuid references public.event_series(id) on delete set null;

create index if not exists events_series_id_idx on public.events(series_id);

create or replace function public.touch_event_series_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.touch_event_series_updated_at() from public, anon, authenticated;
grant execute on function public.touch_event_series_updated_at() to service_role;

drop trigger if exists event_series_touch_updated_at on public.event_series;
create trigger event_series_touch_updated_at
before update on public.event_series
for each row execute function public.touch_event_series_updated_at();

insert into public.event_series (
  name,
  slug,
  description,
  organizer_name,
  organizer_url,
  official_url,
  origin_city,
  origin_country,
  cadence,
  main_focus,
  audience
)
select
  'Blockchain.RIO',
  'blockchain-rio',
  coalesce(ei.event_positioning, e.description, e.short_description),
  ei.organizer_name,
  ei.organizer_url,
  coalesce(e.source_url, e.registration_url),
  e.city,
  e.country,
  'Anual',
  array_to_string(ei.main_topics, ', '),
  e.audience
from public.events e
left join public.event_intelligence ei on ei.event_id = e.id
where e.slug = 'blockchain-rio-2026'
on conflict (slug) do nothing;

update public.events e
set series_id = s.id
from public.event_series s
where s.slug = 'blockchain-rio'
  and e.slug = 'blockchain-rio-2026'
  and e.series_id is null;

commit;
