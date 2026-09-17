begin;

select plan(20);

select has_table(
  'public',
  'event_announcements',
  'event_announcements exists separately from confirmed events'
);

select col_not_null(
  'public',
  'event_announcements',
  'country',
  'country is required'
);

select has_column(
  'public',
  'event_announcements',
  'internal_notes',
  'internal notes are stored separately from public copy'
);

select has_column(
  'public',
  'event_announcements',
  'next_verification_at',
  'the next editorial verification can be scheduled'
);

select col_not_null(
  'public',
  'event_announcements',
  'expected_year',
  'expected year is required'
);

select lives_ok(
  $$
    insert into public.event_announcements (
      title, slug, organizer, country, expected_year, official_url
    ) values (
      'Year only', 'year-only', 'Agenda Labs', 'Brazil', 2027,
      'https://example.com/year-only'
    )
  $$,
  'announcement can have only a year, without period or city'
);

select lives_ok(
  $$
    insert into public.event_announcements (
      title, slug, organizer, country, city, expected_year,
      expected_period, official_url
    ) values (
      'With period', 'with-period', 'Agenda Labs', 'Mexico', null, 2028,
      'Second semester', 'https://example.com/with-period'
    )
  $$,
  'announcement can include a period while city remains optional'
);

select lives_ok(
  $$
    insert into public.event_announcements (
      title, slug, organizer, country, city, expected_year, official_url
    ) values (
      'With city', 'with-city', 'Agenda Labs', 'Argentina',
      'Buenos Aires', 2029, 'https://example.com/with-city'
    )
  $$,
  'announcement can include a city'
);

select throws_ok(
  $$
    insert into public.event_announcements (
      title, slug, organizer, country, expected_year, official_url,
      status, published_at, sources
    ) values (
      'No official source', 'no-official-source', 'Agenda Labs', 'Chile',
      2027, 'https://example.com/no-official-source', 'published', now(),
      '[{"url":"https://news.example.com/story","type":"press","date":"2026-09-17"}]'
    )
  $$,
  '23514',
  'new row for relation "event_announcements" violates check constraint "event_announcements_published_requirements_check"',
  'published announcements require an official source'
);

select throws_ok(
  $$
    insert into public.event_announcements (
      title, slug, organizer, country, expected_year, official_url, sources
    ) values (
      'Invalid source', 'invalid-source', 'Agenda Labs', 'Peru', 2027,
      'https://example.com/invalid-source',
      '[{"url":"not-a-url","type":"official","date":"17/09/2026"}]'
    )
  $$,
  '23514',
  'new row for relation "event_announcements" violates check constraint "event_announcements_sources_check"',
  'source URL and date format are validated'
);

insert into public.event_announcements (
  title, slug, organizer, country, expected_year, official_url,
  status, published_at, sources
) values
  (
    'Public announcement', 'public-announcement', 'Public Org', 'Brazil',
    2027, 'https://example.com/public', 'published', now(),
    '[{"url":"https://example.com/public","type":"official","date":"2026-09-17"}]'
  ),
  (
    'Review announcement', 'review-announcement', 'Review Org', 'Brazil',
    2027, 'https://example.com/review', 'review', null,
    '[{"url":"https://example.com/review","type":"official","date":"2026-09-17"}]'
  ),
  (
    'Archived announcement', 'archived-announcement', 'Archived Org', 'Brazil',
    2027, 'https://example.com/archived', 'archived', null,
    '[]'
  );

select ok(
  has_table_privilege('anon', 'public.event_announcements', 'select'),
  'anon has SELECT privilege'
);

select ok(
  not has_table_privilege('anon', 'public.event_announcements', 'insert'),
  'anon has no INSERT privilege'
);

select ok(
  has_table_privilege('authenticated', 'public.event_announcements', 'select'),
  'authenticated has SELECT privilege'
);

select ok(
  not has_table_privilege('authenticated', 'public.event_announcements', 'update'),
  'authenticated has no UPDATE privilege'
);

select ok(
  has_table_privilege('service_role', 'public.event_announcements', 'select')
    and has_table_privilege('service_role', 'public.event_announcements', 'insert')
    and has_table_privilege('service_role', 'public.event_announcements', 'update')
    and has_table_privilege('service_role', 'public.event_announcements', 'delete'),
  'service_role keeps CRUD privileges'
);

set local role anon;

select is(
  (select count(*) from public.event_announcements),
  1::bigint,
  'anon sees only published announcements'
);

reset role;
set local role authenticated;

select is(
  (select count(*) from public.event_announcements),
  1::bigint,
  'authenticated sees only published announcements'
);

reset role;

select is(
  (
    select count(*)
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'event_announcements'
      and cmd = 'SELECT'
      and roles @> array['anon'::name, 'authenticated'::name]
  ),
  1::bigint,
  'a single public read policy targets anon and authenticated'
);

select is(
  (
    select count(*)
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'event_announcements'
      and cmd in ('INSERT', 'UPDATE', 'DELETE', 'ALL')
      and roles && array['anon'::name, 'authenticated'::name]
  ),
  0::bigint,
  'there are no public write policies'
);

with previous_value as (
  select updated_at
  from public.event_announcements
  where slug = 'year-only'
), changed_value as (
    update public.event_announcements
    set summary = 'Verified summary'
    where slug = 'year-only'
    returning updated_at
)
select ok(
  (
    select changed_value.updated_at > previous_value.updated_at
    from changed_value
    cross join previous_value
  ),
  'updated_at changes on update'
);

select * from finish();

rollback;
