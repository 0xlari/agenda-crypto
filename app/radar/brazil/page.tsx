import type { Metadata } from "next";

const pdfHref = "/pdfs/AgendaCrypto_Web3BrazilRadar_Sample.pdf";
const contactHref = `https://wa.me/5521981833526?text=${encodeURIComponent(
  "Hi Larissa, I want to learn more about the Web3 Brazil Radar by Agenda Crypto."
)}`;

const opportunityRows = [
  {
    event: "Blockchain.RIO",
    city: "Rio de Janeiro",
    date: "Aug 2026",
    audience: "Institutions, fintechs, Web3 companies",
    priority: "High",
    bestFor: "Awareness + partnerships",
    recommendation:
      "Attend, network and explore side event opportunities",
  },
  {
    event: "Ethereum Brasil Meetup",
    city: "Sao Paulo",
    date: "Sample date",
    audience: "Builders, developers, community",
    priority: "Medium",
    bestFor: "DevRel + community",
    recommendation: "Join as speaker or community partner",
  },
  {
    event: "Stablecoin / Payments Side Event",
    city: "Sao Paulo",
    date: "Sample date",
    audience: "Fintechs, payments, exchanges",
    priority: "High",
    bestFor: "Business development",
    recommendation: "Host or sponsor a curated discussion",
  },
  {
    event: "Women in Web3 Meetup",
    city: "Rio de Janeiro",
    date: "Sample date",
    audience: "Community, creators, founders",
    priority: "Medium",
    bestFor: "Community growth",
    recommendation: "Support as ecosystem partner",
  },
  {
    event: "Web3 Founder Dinner",
    city: "Sao Paulo",
    date: "Sample date",
    audience: "Founders, investors, protocols",
    priority: "High",
    bestFor: "Strategic relationships",
    recommendation: "Attend or co-host",
  },
];

const summaryCards = [
  { label: "Market", value: "Brazil" },
  { label: "Focus", value: "Web3 events, side events and communities" },
  { label: "Goal", value: "Prioritize presence, partnerships and activation" },
];

const priorityCards = [
  {
    title: "High priority",
    description:
      "Events recommended for direct presence, sponsorship, speaking or side activation.",
    accent: "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]",
  },
  {
    title: "Medium priority",
    description:
      "Events recommended for networking, community mapping or selective participation.",
    accent: "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#19B5C9]",
  },
  {
    title: "Low priority",
    description:
      "Events to monitor, but not necessarily prioritize for budget allocation.",
    accent: "border-white/15 bg-white/[0.04] text-white/70",
  },
];

const recommendations = [
  {
    title: "Where to show up",
    description:
      "Prioritize events with strong overlap between Web3, fintech, payments, regulation and institutional audiences.",
  },
  {
    title: "How to activate",
    description:
      "Combine event presence with side events, targeted meetings, community distribution and editorial content.",
  },
  {
    title: "Who to meet",
    description:
      "Focus on local community leaders, event organizers, fintech partners, builders, media and ecosystem connectors.",
  },
  {
    title: "What to measure",
    description:
      "Track event views, clicks, saves, I am going, check-ins, leads, meetings and post-event opportunities.",
  },
];

const sideLayers = [
  "Founder dinners",
  "Builder meetups",
  "Payments and stablecoin discussions",
  "Community gatherings",
  "Media and creator moments",
  "Partner-hosted side events",
];

const activationColumns = [
  {
    title: "Platform",
    items: [
      "Thematic radar page",
      "Event map",
      "Save / I am going / check-in",
      "Agenda Pass",
    ],
  },
  {
    title: "Distribution",
    items: [
      "Agenda Crypto social channels",
      "Weekly event curation",
      "Newsletter",
      "Priority event amplification",
    ],
  },
  {
    title: "Coverage and narrative",
    items: [
      "Event highlights",
      "Short interviews",
      "Post-event recap",
      "Community insights",
    ],
  },
];

const deliverables = [
  "Private or semi-private radar page",
  "Curated event map",
  "Event priority ranking",
  "Side event opportunities",
  "Strategic recommendations",
  "Local ecosystem context",
  "Optional distribution plan",
  "PDF report for internal sharing",
  "Follow-up strategy call",
];

export const metadata: Metadata = {
  title: "Web3 Brazil Radar | Agenda Crypto",
  description:
    "A strategic event intelligence report for Web3 companies entering Brazil.",
  alternates: {
    canonical: "/radar/brazil",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Web3 Brazil Radar | Agenda Crypto",
    description:
      "A sample client report for Web3 companies entering Brazil.",
    url: "/radar/brazil",
    siteName: "Agenda Crypto",
    type: "website",
  },
};

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#19B5C9]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base sm:leading-8">
          {description}
        </p>
      )}
    </div>
  );
}

function CtaButtons({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`flex flex-col gap-3 sm:flex-row ${compact ? "mt-6" : "mt-8"}`}>
      <a
        href={pdfHref}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.01] hover:bg-[#ffe04a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Download sample PDF
      </a>
      <a
        href={contactHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#19B5C9]/35 bg-[#19B5C9]/10 px-6 py-3 text-sm font-bold text-[#9DEAF4] transition hover:border-[#19B5C9]/60 hover:bg-[#19B5C9]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9]"
      >
        Talk to Agenda Crypto
      </a>
    </div>
  );
}

function PriorityPill({ priority }: { priority: string }) {
  const className =
    priority === "High"
      ? "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]"
      : priority === "Medium"
        ? "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#8CE8F4]"
        : "border-white/15 bg-white/[0.04] text-white/60";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${className}`}>
      {priority}
    </span>
  );
}

export default function Web3BrazilRadarPage() {
  return (
    <main className="bg-[#111111] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_12%_18%,rgba(25,181,201,0.22),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(180deg,#171717,#101010)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19B5C9]/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <span className="inline-flex rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD600]">
              Sample delivery preview
            </span>
            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Web3 Brazil Radar
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-[#9DEAF4] sm:text-xl">
              A strategic event intelligence report for Web3 companies entering Brazil.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/66 sm:text-base sm:leading-8">
              Agenda Crypto helps international Web3 teams understand where to show up, which events matter and how to turn presence into real market opportunities.
            </p>
            <CtaButtons />
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-br from-[#19B5C9]/20 via-[#EC4899]/10 to-[#FFD600]/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#191919]/92 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                    Brazil market radar
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">Sample report</p>
                </div>
                <div className="rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-3 py-1 text-xs font-bold text-[#8CE8F4]">
                  Q3 2026
                </div>
              </div>

              <div className="relative min-h-[330px] overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-5">
                <div className="absolute left-1/2 top-1/2 h-56 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[48%_54%_42%_52%] border border-[#19B5C9]/35 bg-[#19B5C9]/8 shadow-[0_0_80px_rgba(25,181,201,0.13)]" />
                <div className="absolute left-[52%] top-[27%] h-3 w-3 rounded-full bg-[#FFD600] shadow-[0_0_28px_rgba(255,214,0,0.8)]" />
                <div className="absolute left-[58%] top-[42%] h-3 w-3 rounded-full bg-[#EC4899] shadow-[0_0_28px_rgba(236,72,153,0.75)]" />
                <div className="absolute left-[45%] top-[56%] h-3 w-3 rounded-full bg-[#19B5C9] shadow-[0_0_28px_rgba(25,181,201,0.75)]" />
                <div className="absolute left-[61%] top-[61%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.55)]" />
                <div className="absolute left-[20%] top-[20%] h-px w-[62%] rotate-[18deg] bg-gradient-to-r from-transparent via-[#19B5C9]/40 to-transparent" />
                <div className="absolute left-[25%] top-[70%] h-px w-[58%] -rotate-[20deg] bg-gradient-to-r from-transparent via-[#EC4899]/35 to-transparent" />

                <div className="relative z-10 flex h-full min-h-[300px] flex-col justify-between">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                      <p className="text-xs text-white/40">Mapped opportunities</p>
                      <p className="mt-2 text-3xl font-black text-white">42</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
                      <p className="text-xs text-white/40">Priority cities</p>
                      <p className="mt-2 text-3xl font-black text-white">5</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-black/45 p-4 backdrop-blur-md">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFD600]">
                      Strategic readout
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      Event intelligence, side event opportunities, partner mapping and activation recommendations in one client-ready view.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Executive summary" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.92fr] lg:items-start">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
              <p className="text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
                Brazil has one of the most active crypto and Web3 ecosystems in LATAM, but event discovery is fragmented across conferences, side events, Discords, Telegram groups, local communities and private networks.
              </p>
              <p className="mt-5 text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
                This sample report shows how Agenda Crypto maps the ecosystem, ranks opportunities and recommends where a Web3 team should show up.
              </p>
            </div>
            <div className="grid gap-3">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-[26px] border border-white/10 bg-[#191919] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">{card.label}</p>
                  <p className="mt-2 text-lg font-black leading-snug text-white">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              title="Event opportunity map"
              description="A curated view of relevant events, communities and side opportunities."
            />
            <span className="w-fit rounded-full border border-[#FFD600]/25 bg-[#FFD600]/10 px-4 py-2 text-xs font-bold text-[#FFD600]">
              Sample data for demonstration purposes.
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-[30px] border border-white/10 bg-[#1C1C1C] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
            <div className="hidden grid-cols-[1.25fr_0.85fr_0.75fr_1.25fr_0.65fr_1fr_1.45fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-[11px] font-black uppercase tracking-[0.15em] text-white/42 lg:grid">
              <span>Event</span>
              <span>City</span>
              <span>Date</span>
              <span>Audience</span>
              <span>Priority</span>
              <span>Best for</span>
              <span>Recommendation</span>
            </div>
            <div className="divide-y divide-white/8">
              {opportunityRows.map((row) => (
                <div key={row.event} className="grid gap-4 px-5 py-5 text-sm lg:grid-cols-[1.25fr_0.85fr_0.75fr_1.25fr_0.65fr_1fr_1.45fr] lg:items-center">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Event</p>
                    <p className="font-black text-white">{row.event}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">City</p>
                    <p className="text-white/70">{row.city}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Date</p>
                    <p className="text-white/70">{row.date}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Audience</p>
                    <p className="leading-6 text-white/68">{row.audience}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Priority</p>
                    <PriorityPill priority={row.priority} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Best for</p>
                    <p className="font-semibold text-[#9DEAF4]">{row.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35 lg:hidden">Recommendation</p>
                    <p className="leading-6 text-white/72">{row.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Priority ranking"
            description="Not every event deserves the same budget, team or activation strategy."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {priorityCards.map((card) => (
              <div key={card.title} className={`rounded-[28px] border p-6 ${card.accent}`}>
                <h3 className="text-xl font-black text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{card.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-white/42">
            Priority is based on audience fit, strategic relevance, market timing and activation potential.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader title="Strategic recommendations" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {recommendations.map((item, index) => (
              <div key={item.title} className="rounded-[28px] border border-white/10 bg-[#1D1D1D] p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EC4899]/25 bg-[#EC4899]/10 text-sm font-black text-[#F8A9CF]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/64">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            title="Side events and community layer"
            description="In Brazil, some of the most valuable conversations happen around the main event - in side events, dinners, meetups, private gatherings and community activations."
          />
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sideLayers.map((item) => (
                <div key={item} className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5 text-sm font-bold text-white/78">
                  {item}
                </div>
              ))}
            </div>
            <p className="mt-6 rounded-[26px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-5 text-sm font-bold leading-7 text-[#9DEAF4]">
              Agenda Crypto connects the main event to the ecosystem around it.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <SectionHeader
            title="Distribution and activation layer"
            description="Distribution is not the final product. It is the engine that turns event intelligence into visibility, presence and impact."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {activationColumns.map((column) => (
              <div key={column.title} className="rounded-[30px] border border-white/10 bg-[#1D1D1D] p-6">
                <h3 className="text-xl font-black text-white">{column.title}</h3>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/66">
                  {column.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD600]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            title="What your team receives"
            description="This page is a sample of the final commercial delivery: a clear, shareable intelligence layer your team can use to plan Brazil presence and activation."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-4 text-sm font-semibold text-white/72">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_15%_30%,rgba(255,214,0,0.12),transparent_32%),#141414]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Internal sharing asset"
              title="Download the sample report"
              description="A PDF version of this sample can be shared internally with marketing, partnerships, community, ecosystem and leadership teams."
            />
            <CtaButtons compact />
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#1D1D1D] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">Prepared file path</p>
            <p className="mt-4 break-all rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs leading-6 text-[#9DEAF4]">
              public{pdfHref}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/55">
              If the PDF is not uploaded yet, this button is already wired to the final public path.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#141414,#0E0E0E)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-[36px] border border-[#19B5C9]/20 bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_32%),#191919] p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FFD600]">Agenda Crypto commercial demo</p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Let&apos;s map your Brazil strategy.
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
              If your team is planning to enter, expand or activate in Brazil, Agenda Crypto can help you identify the right events, communities and opportunities.
            </p>
            <CtaButtons />
            <div className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-white/58">
              <p className="font-bold text-white">Larissa Barros | Agenda Crypto</p>
              <p>Website: agendacryptoo.com</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
