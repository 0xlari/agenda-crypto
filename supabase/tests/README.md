# Database tests

The project does not currently have an application test runner. The SQL tests use
the pgTAP runner bundled with the Supabase CLI and run inside a transaction that
is rolled back at the end.

After starting/resetting a local Supabase database with the project schema, run:

```bash
npx supabase test db supabase/tests/event_announcements.sql --local
```

The test covers required fields, the supported year-only/period/city shapes,
source validation, grants, public RLS visibility, absence of public write access,
and the `updated_at` trigger.
