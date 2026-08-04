begin;

do $$
declare
  published_type text;
begin
  select data_type
  into published_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'events'
    and column_name = 'published';

  if published_type is null then
    raise exception 'Expected public.events.published to exist before applying RLS hardening.';
  end if;

  if published_type <> 'boolean' then
    raise exception 'Expected public.events.published to be boolean, got %.', published_type;
  end if;
end $$;

grant usage, select on all sequences in schema public to service_role;

do $$
declare
  sequence_record record;
begin
  for sequence_record in
    select distinct
      sequence_namespace.nspname as sequence_schema,
      sequence_class.relname as sequence_name
    from pg_class table_class
    join pg_namespace table_namespace
      on table_namespace.oid = table_class.relnamespace
    join pg_attribute table_attribute
      on table_attribute.attrelid = table_class.oid
    join pg_depend sequence_depend
      on sequence_depend.refobjid = table_class.oid
     and sequence_depend.refobjsubid = table_attribute.attnum
     and sequence_depend.deptype in ('a', 'i')
    join pg_class sequence_class
      on sequence_class.oid = sequence_depend.objid
     and sequence_class.relkind = 'S'
    join pg_namespace sequence_namespace
      on sequence_namespace.oid = sequence_class.relnamespace
    where table_namespace.nspname = 'public'
      and table_class.relname in ('users', 'user_mascots')
  loop
    execute format(
      'grant usage, select on sequence %I.%I to authenticated',
      sequence_record.sequence_schema,
      sequence_record.sequence_name
    );
  end loop;
end $$;

alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant usage, select on sequences to service_role;

commit;
