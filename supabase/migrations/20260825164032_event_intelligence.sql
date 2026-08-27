create extension if not exists pgcrypto;

create table if not exists public.event_intelligence (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,

  organizer_name text,
  organizer_url text,
  organizer_relevance text,
  edition_number integer,
  event_history text,
  event_positioning text,

  key_speakers jsonb not null default '[]'::jsonb,
  key_companies jsonb not null default '[]'::jsonb,
  key_institutions jsonb not null default '[]'::jsonb,
  sponsors jsonb not null default '[]'::jsonb,
  partners jsonb not null default '[]'::jsonb,

  main_topics text[] not null default '{}'::text[],
  market_signals jsonb not null default '[]'::jsonb,
  notable_announcements jsonb not null default '[]'::jsonb,
  regional_context text,
  ecosystem_context text,
  competitive_events jsonb not null default '[]'::jsonb,

  why_it_matters text,
  who_should_go text,
  who_should_skip text,
  business_opportunity text,
  networking_opportunity text,
  editorial_angle text,
  agenda_take text,

  side_events jsonb not null default '[]'::jsonb,
  related_news jsonb not null default '[]'::jsonb,
  relevant_links jsonb not null default '[]'::jsonb,

  research_sources jsonb not null default '[]'::jsonb,
  research_confidence text,
  research_status text not null default 'draft',
  research_notes text,
  research_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint event_intelligence_event_id_unique unique (event_id),
  constraint event_intelligence_edition_number_positive
    check (edition_number is null or edition_number > 0),
  constraint event_intelligence_key_speakers_is_array
    check (jsonb_typeof(key_speakers) = 'array'),
  constraint event_intelligence_key_companies_is_array
    check (jsonb_typeof(key_companies) = 'array'),
  constraint event_intelligence_key_institutions_is_array
    check (jsonb_typeof(key_institutions) = 'array'),
  constraint event_intelligence_sponsors_is_array
    check (jsonb_typeof(sponsors) = 'array'),
  constraint event_intelligence_partners_is_array
    check (jsonb_typeof(partners) = 'array'),
  constraint event_intelligence_market_signals_is_array
    check (jsonb_typeof(market_signals) = 'array'),
  constraint event_intelligence_notable_announcements_is_array
    check (jsonb_typeof(notable_announcements) = 'array'),
  constraint event_intelligence_competitive_events_is_array
    check (jsonb_typeof(competitive_events) = 'array'),
  constraint event_intelligence_side_events_is_array
    check (jsonb_typeof(side_events) = 'array'),
  constraint event_intelligence_related_news_is_array
    check (jsonb_typeof(related_news) = 'array'),
  constraint event_intelligence_relevant_links_is_array
    check (jsonb_typeof(relevant_links) = 'array'),
  constraint event_intelligence_research_sources_is_array
    check (jsonb_typeof(research_sources) = 'array')
);

create index if not exists event_intelligence_research_status_idx
  on public.event_intelligence (research_status);

create index if not exists event_intelligence_research_updated_at_idx
  on public.event_intelligence (research_updated_at desc);

create index if not exists event_intelligence_main_topics_gin_idx
  on public.event_intelligence using gin (main_topics);

create index if not exists event_intelligence_key_companies_gin_idx
  on public.event_intelligence using gin (key_companies jsonb_path_ops);

create index if not exists event_intelligence_market_signals_gin_idx
  on public.event_intelligence using gin (market_signals jsonb_path_ops);

create or replace function public.touch_event_intelligence_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists event_intelligence_touch_updated_at on public.event_intelligence;

create trigger event_intelligence_touch_updated_at
before update on public.event_intelligence
for each row
execute function public.touch_event_intelligence_updated_at();

alter table public.event_intelligence enable row level security;
