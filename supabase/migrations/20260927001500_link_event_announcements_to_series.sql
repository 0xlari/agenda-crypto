alter table public.event_announcements
  add column if not exists series_id uuid null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'event_announcements_series_id_fkey'
      and conrelid = 'public.event_announcements'::regclass
  ) then
    alter table public.event_announcements
      add constraint event_announcements_series_id_fkey
      foreign key (series_id)
      references public.event_series(id)
      on delete set null;
  end if;
end $$;

create index if not exists event_announcements_series_id_idx
  on public.event_announcements(series_id);
