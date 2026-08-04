create extension if not exists pgcrypto;

create table if not exists public.referral_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  email text,
  display_name text not null,
  code text not null unique,
  total_points integer not null default 0 check (total_points >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists referral_profiles_user_id_idx
  on public.referral_profiles (user_id)
  where user_id is not null;

create index if not exists referral_profiles_code_idx
  on public.referral_profiles (code);

create table if not exists public.referral_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.referral_profiles(id) on delete cascade,
  referred_visitor_id text not null,
  action text not null check (action in ('general_visit', 'event_visit', 'newsletter_signup')),
  points integer not null check (points > 0),
  source_type text not null check (source_type in ('general', 'agenda', 'event', 'trail', 'newsletter')),
  event_id uuid references public.events(id) on delete set null,
  event_slug text,
  subscriber_email text,
  dedupe_key text not null unique,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists referral_events_profile_id_idx
  on public.referral_events (profile_id, created_at desc);

create index if not exists referral_events_source_idx
  on public.referral_events (source_type, action, created_at desc);

alter table public.subscribers
  add column if not exists referral_code text,
  add column if not exists referral_profile_id uuid references public.referral_profiles(id) on delete set null,
  add column if not exists referral_visitor_id text,
  add column if not exists referred_at timestamptz;

create or replace function public.touch_referral_profile_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists referral_profiles_touch_updated_at on public.referral_profiles;

create trigger referral_profiles_touch_updated_at
before update on public.referral_profiles
for each row
execute function public.touch_referral_profile_updated_at();

create or replace function public.apply_referral_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.referral_profiles
      set total_points = total_points + new.points,
          updated_at = now()
      where id = new.profile_id;
  elsif tg_op = 'DELETE' then
    update public.referral_profiles
      set total_points = greatest(total_points - old.points, 0),
          updated_at = now()
      where id = old.profile_id;
  end if;

  return null;
end;
$$;

drop trigger if exists referral_events_apply_points on public.referral_events;

create trigger referral_events_apply_points
after insert or delete on public.referral_events
for each row
execute function public.apply_referral_points();

alter table public.referral_profiles enable row level security;
alter table public.referral_events enable row level security;
