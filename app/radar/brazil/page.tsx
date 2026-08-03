import type { Metadata } from "next";

const pdfHref = "/pdfs/AgendaCrypto_Web3BrazilRadar_AuroraX_Sample.pdf";
const contactHref = `https://wa.me/5521981833526?text=${encodeURIComponent(
  "Hi Larissa, I want a Web3 Brazil Radar for my company."
)}`;

type RadarSignal = {
  title: string;
  value: string | number;
  description: string;
};

type SignalGroup = {
  title: string;
  description: string;
  signals: RadarSignal[];
};

const signalGroups: SignalGroup[] = [
  {
    title: "Discovery signals",
    description: "Where the market is being mapped and searched.",
    signals: [
      {
        title: "Events mapped",
        value: 48,
        description:
          "Published and curated event opportunities organized into the Brazil intelligence layer.",
      },
      {
        title: "Cities monitored",
        value: 7,
        description:
          "Priority hubs across Rio de Janeiro, Sao Paulo and selected regional ecosystems.",
      },
      {
        title: "Registration clicks",
        value: 214,
        description:
          "Outbound demand signal for events with commercial relevance.",
      },
    ],
  },
  {
    title: "Intent signals",
    description: "Where attention is becoming planning behavior.",
    signals: [
      {
        title: "Event saves",
        value: 126,
        description:
          "Intent signal showing what audiences would save for planning.",
      },
      {
        title: "I am going signals",
        value: 83,
        description:
          "Attendance intent captured as a proxy for market attention.",
      },
      {
        title: "Top categories",
        value: "DeFi, fintech, payments",
        description:
          "Category cluster aligned with AuroraX market-entry priorities.",
      },
    ],
  },
  {
    title: "Presence signals",
    description: "Where interest turns into in-person participation.",
    signals: [
      {
        title: "Check-ins",
        value: 31,
        description: "Validated-presence signal for post-event analysis.",
      },
      {
        title: "Agenda Pass",
        value: 24,
        description:
          "Collectible proof-of-presence layer for post-event engagement.",
      },
      {
        title: "Side events connected",
        value: 11,
        description:
          "Side-event opportunities around conference weeks, private dinners and meetups.",
      },
    ],
  },
];

const clientFacts = [
  ["Client", "AuroraX Exchange"],
  ["Market", "Brazil"],
  ["Timeframe", "Next 90 days"],
  ["Focus", "DeFi, liquidity, fintech partnerships and community trust"],
  ["Output", "Event map + priority ranking + recommended plays + PDF report"],
];

const clientQuestions = [
  "Which events are worth attending?",
  "Where should AuroraX sponsor, speak or host?",
  "Which communities matter for DeFi and onchain products?",
  "Where are the best side event opportunities?",
  "How can AuroraX build trust in a market where regulation, liquidity and security are central topics?",
  "How can event presence become partnerships, leads and ecosystem visibility?",
];

const navItems = [
  ["Summary", "#summary"],
  ["Signals", "#signals"],
  ["Priority Events", "#priority-events"],
  ["Playbook", "#playbook"],
  ["Deliverables", "#deliverables"],
  ["PDF", "#pdf"],
];

const decisionSummary = [
  {
    question: "Should AuroraX enter Brazil now?",
    recommendation:
      "Yes, with focused positioning around DeFi, liquidity and trust.",
  },
  {
    question: "Main event to prioritize",
    recommendation: "Blockchain.RIO",
  },
  {
    question: "Best side event format",
    recommendation: "DeFi liquidity roundtable",
  },
  {
    question: "Best city for business development",
    recommendation: "Sao Paulo",
  },
  {
    question: "Best city for visibility",
    recommendation: "Rio de Janeiro",
  },
  {
    question: "Main risk",
    recommendation:
      "Entering only through paid media or generic sponsorship.",
  },
  {
    question: "Main opportunity",
    recommendation:
      "Combine event presence, side events, local partners and distribution.",
  },
];

const topRecommendationBullets = [
  ["Main anchor", "Blockchain.RIO"],
  ["Best side play", "DeFi liquidity roundtable"],
  ["Primary goal", "Trust + fintech partnerships + ecosystem visibility"],
];

const marketReadout = [
  {
    city: "Rio de Janeiro",
    bestFor:
      "Institutional visibility, fintech conversations, regulation, large conferences and media moments.",
    opportunity:
      "Build trust and position around DeFi, liquidity and regulated market discussions.",
    accent: "text-[#19B5C9]",
  },
  {
    city: "Sao Paulo",
    bestFor:
      "Business development, venture, fintech, payments, private meetings and founder/investor side events.",
    opportunity:
      "Partnerships with fintechs, payment companies, wallets, liquidity providers and local builders.",
    accent: "text-[#FFD600]",
  },
  {
    city: "Other hubs",
    bestFor:
      "Community, startups, technical ecosystem, regional meetups and niche opportunities.",
    opportunity:
      "Identify early communities, ambassadors and developer relationships.",
    accent: "text-[#EC4899]",
  },
];

const priorityMatrix = [
  {
    title: "High priority",
    description:
      "Events recommended for direct presence, sponsorship, speaking or side activation.",
    accent: "border-[#FFD600]/30 bg-[#FFD600]/10",
  },
  {
    title: "Medium priority",
    description:
      "Events recommended for networking, community mapping or selective participation.",
    accent: "border-[#19B5C9]/30 bg-[#19B5C9]/10",
  },
  {
    title: "Monitor",
    description:
      "Events to track, but not necessarily prioritize for immediate budget.",
    accent: "border-white/15 bg-white/[0.04]",
  },
];

const eventCards = [
  {
    name: "Blockchain.RIO",
    city: "Rio de Janeiro",
    date: "Aug 2026",
    audience: "Institutions, fintechs, regulators, Web3 companies",
    score: 92,
    bestFor: "Awareness, trust, institutional positioning and fintech partnerships",
    why:
      "Strong overlap between regulation, fintech, payments, crypto infrastructure and institutional Web3 discussions.",
    play:
      "Attend with BD/leadership, map fintech and institutional stakeholders, request speaking opportunities and explore a curated side event around DeFi, liquidity and market infrastructure.",
    priority: "High",
    action: "Attend + explore side event",
  },
  {
    name: "Stablecoin / Payments Side Event",
    city: "Sao Paulo",
    date: "Sao Paulo week",
    audience: "Fintechs, payments, exchanges, wallets",
    score: 89,
    bestFor: "Business development and partnerships",
    why:
      "Strong fit for conversations around liquidity, on/off-ramp, payments, stablecoins and financial infrastructure.",
    play:
      "Host or sponsor a curated roundtable with fintechs, wallets and payment partners.",
    priority: "High",
    action: "Host or sponsor",
  },
  {
    name: "DeFi Builders Meetup",
    city: "Sao Paulo",
    date: "Builder week",
    audience: "Developers, builders, protocols, technical community",
    score: 82,
    bestFor: "DevRel, product education and technical credibility",
    why:
      "Helps AuroraX connect with builders and explain its DeFi product layer beyond a pure exchange narrative.",
    play: "Join as speaker, workshop partner or technical supporter.",
    priority: "Medium",
    action: "Speak or support",
  },
  {
    name: "Web3 Founder Dinner",
    city: "Sao Paulo",
    date: "Private format",
    audience: "Founders, investors, protocols, ecosystem leaders",
    score: 86,
    bestFor: "Strategic relationships",
    why:
      "Smaller private environments often create higher-quality relationships than large booths.",
    play: "Attend or co-host with a trusted local partner.",
    priority: "High",
    action: "Attend or co-host",
  },
  {
    name: "Women in Web3 / Community Meetup",
    city: "Rio de Janeiro",
    date: "Community week",
    audience: "Community, creators, founders, ecosystem connectors",
    score: 72,
    bestFor: "Community trust and local brand perception",
    why:
      "Useful to build a more human and community-oriented presence in the market.",
    play: "Support as ecosystem partner, not as hard-selling sponsor.",
    priority: "Medium",
    action: "Support as ecosystem partner",
  },
];

const playbook = [
  {
    title: "Do not enter only through paid media",
    description:
      "AuroraX needs trust, context and local relationships. Events can help create credibility faster than isolated ads.",
  },
  {
    title: "Use major conferences for visibility",
    description:
      "Use large events to position the brand around DeFi, liquidity, security and regulated market conversations.",
  },
  {
    title: "Use side events for relationships",
    description:
      "Private dinners, roundtables and builder meetups are better for partnerships, local context and qualified conversations.",
  },
  {
    title: "Use community moments for trust",
    description:
      "Support local communities, creators and meetups to avoid looking like an external company only trying to sell.",
  },
];

const sideEventFormats = [
  {
    title: "Founder breakfast",
    audience: "Founders, investors, ecosystem leads",
    objective: "Strategic relationships",
    timing: "During major conference weeks",
  },
  {
    title: "DeFi liquidity roundtable",
    audience: "Exchanges, wallets, fintechs, DeFi protocols",
    objective: "Business development and market education",
    timing:
      "When AuroraX wants to position around DeFi and market infrastructure",
  },
  {
    title: "Builder meetup",
    audience: "Developers and protocol teams",
    objective: "Technical credibility and product education",
    timing: "When the team wants to build trust with the technical community",
  },
  {
    title: "Private dinner",
    audience: "Partners, investors, senior BD, ecosystem leaders",
    objective: "High-quality relationship building",
    timing: "Around large conferences or regulatory/fintech moments",
  },
  {
    title: "Media briefing",
    audience: "Journalists, creators, analysts",
    objective: "Narrative building",
    timing: "When AuroraX has a clear market message or launch",
  },
  {
    title: "Community happy hour",
    audience: "Users, creators, local communities",
    objective: "Brand warmth and community trust",
    timing: "After meetups or during event weeks",
  },
];

const activationPlan = [
  {
    title: "Before the event",
    items: [
      "Define target audience",
      "Choose priority events",
      "Map speakers, organizers and partners",
      "Announce Brazil presence",
      "Invite selected fintechs, builders and community leaders",
      "Prepare DeFi/security/liquidity narrative",
    ],
  },
  {
    title: "During the event",
    items: [
      "Attend priority events",
      "Host or join side events",
      "Capture qualified contacts",
      "Generate content and coverage",
      "Register presence signals",
      "Meet organizers, media and ecosystem connectors",
    ],
  },
  {
    title: "After the event",
    items: [
      "Follow up with contacts",
      "Publish recap and insights",
      "Review event performance",
      "Recommend next cities/events",
      "Build ongoing partner pipeline",
    ],
  },
];

const activationColumns = [
  {
    title: "Platform",
    items: [
      "AuroraX thematic radar page",
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
  "Private radar page",
  "PDF report for internal sharing",
  "Curated event map",
  "Priority ranking",
  "Event strategic fit scores",
  "Recommended plays by event",
  "Side event strategy",
  "Distribution plan",
  "Local ecosystem context",
  "Follow-up strategy call",
];

export const metadata: Metadata = {
  title: "Web3 Brazil Radar for AuroraX Exchange | Agenda Crypto",
  description:
    "Sample strategic event intelligence report for AuroraX Exchange, a DeFi-focused exchange entering Brazil.",
  alternates: {
    canonical: "/radar/brazil",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Web3 Brazil Radar for AuroraX Exchange | Agenda Crypto",
    description:
      "A fictional client sample showing Agenda Crypto event intelligence for a DeFi exchange entering Brazil.",
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
    <div
      className={`flex flex-col gap-3 sm:flex-row ${compact ? "mt-6" : "mt-8"}`}
    >
      <a
        href={pdfHref}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.01] hover:bg-[#ffe04a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Download sample report
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

function Badge({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "yellow" | "pink";
}) {
  const styles = {
    cyan: "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#9DEAF4]",
    yellow: "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]",
    pink: "border-[#EC4899]/30 bg-[#EC4899]/10 text-[#F8A9CF]",
  };

  return (
    <span
      className={`inline-flex w-fit rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] ${styles[tone]}`}
    >
      {children}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-bold text-white/55">
        <span>Strategic fit score</span>
        <span className="text-[#FFD600]">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#19B5C9] via-[#FFD600] to-[#EC4899]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({ signal }: { signal: RadarSignal }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="text-sm font-bold text-white/75">{signal.title}</p>
      <p className="mt-3 text-2xl font-black text-white">{signal.value}</p>
      <p className="mt-2 text-xs leading-5 text-white/50">
        {signal.description}
      </p>
    </div>
  );
}

export default function Web3BrazilRadarPage() {
  return (
    <main className="bg-[#111111] text-white">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_12%_18%,rgba(25,181,201,0.22),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(236,72,153,0.16),transparent_30%),linear-gradient(180deg,#171717,#101010)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#19B5C9]/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:py-24">
          <div>
            <div className="flex flex-wrap gap-3">
              <Badge tone="yellow">Sample client delivery</Badge>
              <Badge tone="pink">Fictional client example</Badge>
            </div>
            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
              Web3 Brazil Radar
            </h1>
            <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[#9DEAF4] sm:text-xl">
              Sample strategic event intelligence report for AuroraX Exchange.
            </p>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/66 sm:text-base sm:leading-8">
              AuroraX Exchange is a fictional DeFi-focused exchange exploring
              Brazil. This sample shows how Agenda Crypto helps international
              Web3 teams understand where to show up, which events matter and
              how to turn presence into real market opportunities.
            </p>
            <p className="mt-4 max-w-2xl rounded-[24px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-4 text-sm font-bold leading-7 text-[#BDF5FA]">
              We help Web3 companies avoid wasting budget on the wrong events -
              and identify where presence can become partnerships, trust and
              market entry.
            </p>
            <CtaButtons />
          </div>

          <aside className="relative">
            <div className="absolute -inset-4 rounded-[42px] bg-gradient-to-br from-[#19B5C9]/20 via-[#EC4899]/10 to-[#FFD600]/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#191919]/92 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                    Client file
                  </p>
                  <p className="mt-2 text-2xl font-black text-white">
                    AuroraX Exchange
                  </p>
                </div>
                <div className="rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-3 py-1 text-xs font-bold text-[#8CE8F4]">
                  90-day radar
                </div>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-5">
                <div className="space-y-4">
                  {clientFacts.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/10 bg-black/25 p-4"
                    >
                      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
                        {label}
                      </p>
                      <p className="mt-2 text-sm font-bold leading-6 text-white/78">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#111111]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white/58 transition hover:border-[#19B5C9]/40 hover:bg-[#19B5C9]/10 hover:text-[#9DEAF4]"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
          <SectionHeader
            eyebrow="Business scenario"
            title="Client scenario"
            description="AuroraX Exchange wants to enter Brazil with a DeFi-focused positioning, but the local ecosystem is fragmented across conferences, side events, fintech communities, builder meetups, private networks and regulatory discussions."
          />
          <div className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FFD600]">
              Questions this report answers
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {clientQuestions.map((question) => (
                <div
                  key={question}
                  className="rounded-[22px] border border-white/10 bg-[#191919] p-4 text-sm font-semibold leading-6 text-white/72"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="summary" className="scroll-mt-24 border-b border-white/10 bg-[#101010]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader
            eyebrow="Executive view"
            title="Decision summary"
            description="A quick executive view of how AuroraX should approach Brazil."
          />
          <div className="mt-7 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {decisionSummary.map((item) => (
              <div
                key={item.question}
                className="rounded-[24px] border border-white/10 bg-white/[0.035] p-5"
              >
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/38">
                  {item.question}
                </p>
                <p className="mt-3 text-base font-black leading-7 text-white">
                  {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="deliverables" className="scroll-mt-24 border-b border-white/10 bg-[#141414]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <SectionHeader
            title="What AuroraX would receive"
            description="This is designed to help marketing, partnerships, ecosystem, community and leadership teams make faster decisions about Brazil."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-white/10 bg-[#1D1D1D] p-4 text-sm font-semibold leading-6 text-white/76"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="signals" className="scroll-mt-24 border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Sample view"
              title="Early signals from Agenda Crypto"
              description="Agenda Crypto organizes early ecosystem signals to help companies understand where attention, intent and presence are emerging."
            />
            <Badge tone="yellow">Sample view</Badge>
          </div>
          <p className="mt-5 max-w-4xl text-sm font-semibold leading-7 text-white/72">
            These signals help identify where attention, intent and presence are
            emerging before a company commits budget.
          </p>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {signalGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-[30px] border border-white/10 bg-[#1B1B1B] p-5"
              >
                <h3 className="text-lg font-black text-white">{group.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">
                  {group.description}
                </p>
                <div className="mt-5 space-y-3">
                  {group.signals.map((signal) => (
                    <MetricCard key={signal.title} signal={signal} />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-xs leading-6 text-white/42">
            Metrics in this demo are sample values for commercial demonstration.
            In a real client report, this layer can be populated from Agenda
            Crypto event, intent, click and presence signals.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader
            title="Brazil market readout"
            description="Brazil is not one single Web3 market. For a DeFi-focused exchange, each city and event type offers a different opportunity."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {marketReadout.map((item) => (
              <div
                key={item.city}
                className="rounded-[30px] border border-white/10 bg-white/[0.035] p-6"
              >
                <h3 className={`text-2xl font-black ${item.accent}`}>
                  {item.city}
                </h3>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/35">
                  Best for
                </p>
                <p className="mt-2 text-sm leading-7 text-white/68">
                  {item.bestFor}
                </p>
                <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-white/35">
                  Opportunity for AuroraX
                </p>
                <p className="mt-2 text-sm leading-7 text-white/72">
                  {item.opportunity}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader
            title="Event priority matrix for AuroraX"
            description="Not every event deserves the same budget, team or activation strategy."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {priorityMatrix.map((card) => (
              <div
                key={card.title}
                className={`rounded-[28px] border p-6 ${card.accent}`}
              >
                <h3 className="text-xl font-black text-white">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-4xl text-xs leading-6 text-white/42">
            Priority is based on DeFi audience fit, fintech relevance,
            partnership potential, regulatory context, side-event opportunity
            and trust-building value.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[38px] border border-[#19B5C9]/30 bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.24),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.2),transparent_32%),linear-gradient(135deg,rgba(255,214,0,0.13),rgba(255,255,255,0.035))] p-7 text-center shadow-[0_34px_110px_rgba(0,0,0,0.34)] sm:p-10">
            <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-[#FFD600]/12 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 h-52 w-52 rounded-full bg-[#19B5C9]/12 blur-3xl" />
            <div className="relative">
              <Badge tone="cyan">Top recommendation</Badge>
              <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl">
                Top recommendation for AuroraX
              </h2>
              <p className="mx-auto mt-5 max-w-3xl text-base font-semibold leading-8 text-white/80 sm:text-lg">
                For the next 90 days, AuroraX should use Blockchain.RIO as its
                main visibility anchor and combine it with a curated DeFi
                liquidity roundtable to build trust, meet fintech partners and
                create local ecosystem relevance.
              </p>
              <div className="mt-7 grid gap-3 text-left md:grid-cols-3">
                {topRecommendationBullets.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[22px] border border-white/10 bg-black/25 p-4"
                  >
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#FFD600]">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-black leading-6 text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="priority-events" className="scroll-mt-24 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Event intelligence"
              title="Priority events for AuroraX"
              description="Each event is scored by audience fit, partnership potential, side-event opportunity and strategic relevance."
            />
            <Badge tone="cyan">AuroraX priority view</Badge>
          </div>
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {eventCards.map((event) => (
              <article
                key={event.name}
                className="rounded-[30px] border border-white/10 bg-[#1B1B1B] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <PriorityLabel priority={event.priority} />
                      <ActionLabel action={event.action} />
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/55">
                        {event.city}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/55">
                        {event.date}
                      </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-black text-white">
                      {event.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/56">
                      {event.audience}
                    </p>
                  </div>
                  <ScoreBadge score={event.score} />
                </div>
                <div className="mt-5">
                  <ScoreBar score={event.score} />
                </div>
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                  <InfoBlock label="Best for" value={event.bestFor} />
                  <InfoBlock label="Why it matters" value={event.why} />
                  <InfoBlock label="Recommended play" value={event.play} strong />
                </div>
                <div className="mt-6 rounded-[22px] border border-[#EC4899]/25 bg-[#EC4899]/10 p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#F8A9CF]">
                    Recommended action
                  </p>
                  <p className="mt-2 text-base font-black leading-6 text-white">
                    {event.action}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="playbook" className="scroll-mt-24 border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader title="Recommended Brazil playbook" />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {playbook.map((item, index) => (
              <div
                key={item.title}
                className="rounded-[28px] border border-white/10 bg-[#1D1D1D] p-6"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-[#EC4899]/25 bg-[#EC4899]/10 text-sm font-black text-[#F8A9CF]">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-black text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/64">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader
            title="Side event strategy"
            description="Main events create visibility. Side events create relationships."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sideEventFormats.map((format) => (
              <div
                key={format.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6"
              >
                <h3 className="text-xl font-black text-white">{format.title}</h3>
                <InfoBlock label="Best audience" value={format.audience} />
                <InfoBlock label="Objective" value={format.objective} />
                <InfoBlock label="When to use" value={format.timing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#141414]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader title="Activation plan for AuroraX" />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {activationPlan.map((phase) => (
              <ChecklistCard
                key={phase.title}
                title={phase.title}
                items={phase.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <SectionHeader
            title="Distribution and activation layer"
            description="Distribution is not the final product. It is the engine that turns event intelligence into visibility, presence and impact."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {activationColumns.map((column) => (
              <ChecklistCard
                key={column.title}
                title={column.title}
                items={column.items}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="pdf" className="scroll-mt-24 border-b border-white/10 bg-[radial-gradient(circle_at_15%_30%,rgba(255,214,0,0.12),transparent_32%),#141414]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Internal sharing asset"
              title="Download the sample report"
              description="The PDF version is designed for internal sharing with marketing, partnerships, ecosystem, community and leadership teams."
            />
            <CtaButtons compact />
          </div>
          <div className="rounded-[32px] border border-white/10 bg-[#1D1D1D] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/35">
              Prepared sample file
            </p>
            <p className="mt-4 break-all rounded-2xl border border-white/10 bg-black/25 p-4 font-mono text-xs leading-6 text-[#9DEAF4]">
              public{pdfHref}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/55">
              If the PDF is not uploaded yet, the button is already wired to the
              final prepared file path.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#141414,#0E0E0E)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="overflow-hidden rounded-[36px] border border-[#19B5C9]/20 bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.16),transparent_32%),#191919] p-7 sm:p-10">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#FFD600]">
              Agenda Crypto commercial demo
            </p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              Get a custom Brazil Radar for your company
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/68 sm:text-base sm:leading-8">
              Agenda Crypto can build a custom event intelligence report for
              your team, with prioritized events, strategic recommendations,
              side-event opportunities, distribution plan and local ecosystem
              context.
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

function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="w-full rounded-[24px] border border-[#FFD600]/25 bg-[#FFD600]/10 p-4 text-left sm:w-[150px] sm:text-center">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#FFD600]/80">
        Fit score
      </p>
      <p className="mt-1 text-4xl font-black leading-none text-[#FFD600]">
        {score}
      </p>
      <p className="mt-1 text-xs font-bold text-white/45">/100</p>
    </div>
  );
}

function ActionLabel({ action }: { action: string }) {
  return (
    <span className="rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-3 py-1 text-xs font-black text-[#F8A9CF]">
      {action}
    </span>
  );
}

function PriorityLabel({ priority }: { priority: string }) {
  const className =
    priority === "High"
      ? "border-[#FFD600]/30 bg-[#FFD600]/10 text-[#FFD600]"
      : "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#8CE8F4]";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${className}`}>
      {priority}
    </span>
  );
}

function InfoBlock({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>
      <p
        className={`mt-2 text-sm leading-7 ${
          strong ? "font-semibold text-white/78" : "text-white/64"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ChecklistCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[#1D1D1D] p-6">
      <h3 className="text-xl font-black text-white">{title}</h3>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-white/66">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD600]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
