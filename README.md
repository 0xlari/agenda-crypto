# Agenda Crypto

Agenda Crypto is a crypto and fintech events platform for the LATAM ecosystem.
It helps users discover relevant events, save their own agenda, confirm interest,
track check-ins, and receive recommendations based on their interactions.

The project is also a portfolio lab for building production-minded automation:
data import pipelines, APIs, Supabase queries, analytics dashboards, and future
AI-assisted event intelligence.

## Why this project matters

Crypto communities move through events: hackathons, side events, meetups,
conferences, workshops, and private gatherings. The information is often spread
across social media, forms, newsletters, and group chats.

Agenda Crypto turns that scattered flow into a structured product:

- a public event directory
- individual event pages
- user saves and RSVP-style intent
- check-ins and Agenda Passes
- event submissions and admin review
- analytics for events, engagement, and commercial signals
- an import path for structured event data

## Current features

- Public event discovery pages built with Next.js.
- Event detail pages with related event recommendations.
- User agenda flows for saved events and confirmed attendance.
- Admin dashboard with event, user, check-in, pass, view, and conversion metrics.
- Event submission and admin approval routes.
- Token-protected API route for event upserts.
- Supabase-backed data access.
- Python CSV importer for event data.
- Recommendation scoring based on user interactions, event category, type, city,
  parent event, and level.

## Tech stack

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Python for data import scripts

## Architecture

```text
Users
  |
  v
Next.js app
  |
  +-- Public pages: home, agenda, event detail
  +-- User flows: save, RSVP, passes, check-in
  +-- Admin flows: dashboard, event review, import
  |
  v
API routes
  |
  +-- event upsert
  +-- recommendations
  +-- tracking
  +-- submissions
  +-- user state
  |
  v
Supabase
  |
  +-- events
  +-- event_interactions
  +-- user_passes
  +-- newsletter/subscribers
  +-- analytics views
```

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with the required Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EVENTS_API_TOKEN=
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Python event import

The project includes a sample CSV importer at `scripts/python/import_events.py`.

Install Python dependencies:

```bash
pip install -r scripts/python/requirements.txt
```

Run the import script:

```bash
python scripts/python/import_events.py
```

The script reads `scripts/python/sample_events.csv` and inserts events into
Supabase using the service role key from `.env.local`.

## API example: event upsert

`POST /api/event-search/upsert`

This route accepts a Bearer token and creates or updates an event by `slug`.

Example body:

```json
{
  "title": "Bitcoin Builders Sao Paulo",
  "slug": "bitcoin-builders-sao-paulo",
  "short_description": "A meetup for Bitcoin builders in Sao Paulo.",
  "city": "Sao Paulo",
  "country": "Brazil",
  "start_date": "2026-07-12",
  "category": "bitcoin",
  "tags": ["bitcoin", "builders", "latam"],
  "published": true,
  "featured": false,
  "is_online": false,
  "source_url": "https://example.com",
  "registration_url": "https://example.com/register"
}
```

## Portfolio direction

This project is being shaped into a durable portfolio case for international
developer roles, especially roles around automation, integrations, AI platforms,
and data-heavy products.

Near-term technical priorities:

- Improve README and setup reproducibility.
- Add database schema documentation.
- Add API route documentation.
- Add import logs and failure reporting.
- Add automated tests for scoring and parsing logic.
- Add an event intelligence layer for classification and summarization.
- Add observability-style dashboards for imports, recommendations, and user
  interactions.

## Career narrative

Agenda Crypto demonstrates the intersection of:

- product thinking
- fintech and crypto ecosystem knowledge
- event data modeling
- user engagement analytics
- API integrations
- automation pipelines
- future AI-assisted workflows

The long-term goal is to evolve the product into a small event intelligence
platform: structured event ingestion, classification, recommendations, analytics,
and operator-facing dashboards.
