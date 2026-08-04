begin;

alter table if exists public.subscribers enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.event_responses enable row level security;
alter table if exists public.event_submissions enable row level security;
alter table if exists public.page_views enable row level security;
alter table if exists public.users enable row level security;
alter table if exists public.event_interactions enable row level security;
alter table if exists public.checkins enable row level security;
alter table if exists public.user_passes enable row level security;
alter table if exists public.user_mascots enable row level security;

revoke all on table public.subscribers from anon, authenticated;
revoke all on table public.events from anon, authenticated;
revoke all on table public.event_responses from anon, authenticated;
revoke all on table public.event_submissions from anon, authenticated;
revoke all on table public.page_views from anon, authenticated;
revoke all on table public.users from anon, authenticated;
revoke all on table public.event_interactions from anon, authenticated;
revoke all on table public.checkins from anon, authenticated;
revoke all on table public.user_passes from anon, authenticated;
revoke all on table public.user_mascots from anon, authenticated;

revoke all on table public.admin_overview_summary from anon, authenticated;
revoke all on table public.admin_event_analytics_summary from anon, authenticated;
grant select on table public.admin_overview_summary to service_role;
grant select on table public.admin_event_analytics_summary to service_role;

alter view if exists public.admin_overview_summary set (security_invoker = true);
alter view if exists public.admin_event_analytics_summary set (security_invoker = true);

do $$
declare
  policy_record record;
begin
  for policy_record in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'events',
        'event_responses',
        'users',
        'event_interactions',
        'checkins',
        'user_passes',
        'user_mascots'
      )
  loop
    execute format(
      'drop policy if exists %I on %I.%I',
      policy_record.policyname,
      policy_record.schemaname,
      policy_record.tablename
    );
  end loop;
end $$;

grant select on table public.events to anon, authenticated;
create policy "Public can read published events"
on public.events
for select
to anon, authenticated
using (published is true);

grant select, insert, update on table public.users to authenticated;
create policy "Users can read own profile"
on public.users
for select
to authenticated
using (id = auth.uid());

create policy "Users can insert own profile"
on public.users
for insert
to authenticated
with check (id = auth.uid());

create policy "Users can update own profile"
on public.users
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

grant select on table public.event_responses to authenticated;
create policy "Users can read own event responses"
on public.event_responses
for select
to authenticated
using (user_id = auth.uid());

grant select on table public.event_interactions to authenticated;
create policy "Users can read own event interactions"
on public.event_interactions
for select
to authenticated
using (user_id = auth.uid());

grant select on table public.checkins to authenticated;
create policy "Users can read own checkins"
on public.checkins
for select
to authenticated
using (user_id = auth.uid());

grant select on table public.user_passes to authenticated;
create policy "Users can read own passes"
on public.user_passes
for select
to authenticated
using (user_id = auth.uid());

grant select, insert, update on table public.user_mascots to authenticated;
create policy "Users can read own mascot"
on public.user_mascots
for select
to authenticated
using (user_id = auth.uid());

create policy "Users can insert own mascot"
on public.user_mascots
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Users can update own mascot"
on public.user_mascots
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

commit;
