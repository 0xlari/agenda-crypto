begin;

-- Public catalogue: visitors can read only published events. All mutations stay
-- behind server routes that use the service role.
alter table public.events enable row level security;
revoke all on table public.events from anon, authenticated;
grant select on table public.events to anon, authenticated;
drop policy if exists "Public can read published events" on public.events;
create policy "Public can read published events"
  on public.events
  for select
  to anon, authenticated
  using (published is true);

-- Personal activity remains visible only to its authenticated owner. Writes are
-- performed by the existing server routes after their own validation.
alter table public.event_interactions enable row level security;
revoke all on table public.event_interactions from anon, authenticated;
grant select on table public.event_interactions to authenticated;
drop policy if exists "Users can read own event interactions" on public.event_interactions;
create policy "Users can read own event interactions"
  on public.event_interactions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

alter table public.checkins enable row level security;
revoke all on table public.checkins from anon, authenticated;
grant select on table public.checkins to authenticated;
drop policy if exists "Users can read own checkins" on public.checkins;
create policy "Users can read own checkins"
  on public.checkins
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Sensitive and operational tables are server-only. The service role bypasses
-- RLS, so current API routes keep working without exposing these rows directly.
alter table public.users enable row level security;
alter table public.event_submissions enable row level security;
alter table public.page_views enable row level security;
alter table public.subscribers enable row level security;
alter table public.user_passes enable row level security;

revoke all on table public.users from anon, authenticated;
revoke all on table public.event_submissions from anon, authenticated;
revoke all on table public.page_views from anon, authenticated;
revoke all on table public.subscribers from anon, authenticated;
revoke all on table public.user_passes from anon, authenticated;

-- Existing owner-scoped policies must never apply to the anonymous role and
-- updates must preserve ownership.
revoke all on table public.event_responses from anon;
grant select, insert, update, delete on table public.event_responses to authenticated;
drop policy if exists "Users can delete their own responses" on public.event_responses;
drop policy if exists "Users can insert their own responses" on public.event_responses;
drop policy if exists "Users can update their own responses" on public.event_responses;
drop policy if exists "Users can view their own responses" on public.event_responses;
create policy "Users can delete their own responses"
  on public.event_responses for delete to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can insert their own responses"
  on public.event_responses for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can update their own responses"
  on public.event_responses for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "Users can view their own responses"
  on public.event_responses for select to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.user_mascots from anon;
grant select, insert, update on table public.user_mascots to authenticated;
drop policy if exists "Users can insert own mascot" on public.user_mascots;
drop policy if exists "Users can read own mascot" on public.user_mascots;
drop policy if exists "Users can update own mascot" on public.user_mascots;
create policy "Users can insert own mascot"
  on public.user_mascots for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Users can read own mascot"
  on public.user_mascots for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can update own mascot"
  on public.user_mascots for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Admin summaries must honor the caller's RLS and remain inaccessible to the
-- public API. Admin server routes read them with the service role.
alter view public.admin_overview_summary set (security_invoker = true);
alter view public.admin_event_analytics_summary set (security_invoker = true);
revoke all on table public.admin_overview_summary from public, anon, authenticated;
revoke all on table public.admin_event_analytics_summary from public, anon, authenticated;
grant select on table public.admin_overview_summary to service_role;
grant select on table public.admin_event_analytics_summary to service_role;

-- Trigger/helper functions are not public RPC endpoints.
revoke execute on function public.apply_referral_points() from public, anon, authenticated;
grant execute on function public.apply_referral_points() to service_role;
alter function public.touch_referral_profile_updated_at() set search_path = public, pg_temp;
alter function public.touch_event_intelligence_updated_at() set search_path = public, pg_temp;

commit;
