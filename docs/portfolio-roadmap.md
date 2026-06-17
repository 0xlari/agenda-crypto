# Agenda Crypto Portfolio Roadmap

This roadmap turns Agenda Crypto into a portfolio case for automation, AI
platform, backend, integration, and product engineering roles.

## Target role alignment

The reference role is an AI Platform Engineer position focused on shared agent
infrastructure, reliable integrations, event routing, observability, SQL, Python,
and production automation.

Agenda Crypto can map to that profile through durable engineering skills:

- structured data ingestion
- API design
- event routing
- SQL-backed analytics
- data quality checks
- logs and operational dashboards
- recommendation systems
- AI-assisted classification and summaries

## 30-day plan

### Week 1: Documentation and credibility

- Replace the default README with a product-focused README.
- Add environment variable documentation.
- Document the main API routes.
- Document the current data model from the Supabase tables/views.
- Add screenshots or a short demo video when available.

### Week 2: Data import and quality

- Add validation to the Python CSV importer.
- Report malformed rows instead of failing silently.
- Add an import summary: inserted, skipped, invalid, updated.
- Add a dry-run mode.
- Add sample data that can be safely used by recruiters.

### Week 3: Event intelligence foundation

- Add a deterministic classification layer for events:
  - category
  - audience
  - level
  - intent
  - event type
- Add tests for classification and recommendation scoring.
- Create a short technical note explaining the scoring model.

### Week 4: Observability and portfolio polish

- Add basic logs for imports, upserts, and recommendations.
- Add an admin view or exported report for operational health.
- Publish a case study in English:
  - problem
  - users
  - architecture
  - tradeoffs
  - next steps

## 90-day plan

### Month 1: Make the current product easy to understand

Outcome: a recruiter or mentor can open the repo and understand the product,
stack, architecture, and next steps in under five minutes.

Deliverables:

- README
- architecture diagram
- API reference
- schema notes
- demo screenshots

### Month 2: Build the automation layer

Outcome: the project proves automation and integration skills, not only frontend
delivery.

Deliverables:

- robust CSV importer
- token-protected event upsert API
- import logs
- event validation
- error reporting
- tests for parsing and scoring

### Month 3: Add AI-assisted intelligence

Outcome: the project shows practical AI usage with structured inputs, validated
outputs, and human-readable explanations.

Deliverables:

- AI event summary prototype
- AI category suggestion prototype
- JSON output contract
- fallback rules
- evaluation examples
- "human in the loop" notes

## Hack4Freedom angle

Hack4Freedom is focused on open-source freedom tech using Bitcoin, Lightning,
Nostr, and eCash. It is not the same niche as an enterprise AI platform role,
but it strengthens the same career story if the project is scoped correctly.

Recommended project direction:

Build a freedom-tech event discovery or grant/bounty discovery tool that uses
Agenda Crypto patterns:

- ingest opportunities from public sources
- classify them by protocol, location, level, and audience
- let users save opportunities
- produce a public open-source repo
- document the product in English

Avoid trying to learn every Bitcoin protocol deeply during the hackathon. The
portfolio win is showing that you can learn a new domain, ship a useful tool,
work in public, and explain tradeoffs.

## Durable vs risky skills

Durable skills:

- Python
- TypeScript
- SQL
- APIs
- webhooks
- authentication
- data modeling
- logs
- dashboards
- testing
- documentation
- English communication

Skills that may change quickly:

- specific AI agent frameworks
- prompt templates
- no-code AI platforms
- vendor-specific APIs
- one-off crypto hype cycles

The strategy is to use fast-moving tools as accelerators, but build the
portfolio around durable engineering patterns.
