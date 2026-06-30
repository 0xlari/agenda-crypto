import Link from "next/link";
import AgendaBrowser from "@/componentes/agenda/agenda-browser";
import NewsletterSignup from "@/componentes/newsletter-signup";
import PageTour from "@/componentes/onboarding/page-tour";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";
import { agendaHref, getDictionary, type Locale } from "@/lib/i18n";
import type { getPublishedEvents } from "@/lib/supabase/queries";

type AgendaEvents = Awaited<ReturnType<typeof getPublishedEvents>>;

type AgendaPageContentProps = {
  events: AgendaEvents;
  locale?: Locale;
};

export default function AgendaPageContent({
  events,
  locale = "pt",
}: AgendaPageContentProps) {
  const dict = getDictionary(locale);
  const agenda = dict.agenda;
  const canonicalPath = agendaHref(locale);
  const agendaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: agenda.seoTitle,
    description: agenda.seoDescription,
    inLanguage: locale === "es" ? "es-419" : "pt-BR",
    url: absoluteUrl(canonicalPath),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl(canonicalPath),
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: events.slice(0, 24).map((event, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: event.title,
        url: absoluteUrl(`/agenda/${event.slug}`),
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agendaJsonLd) }}
      />
      <PageTour
        pageId={locale === "es" ? "agenda-es" : "agenda"}
        steps={[...agenda.tourSteps]}
        labels={agenda.tourLabels}
      />

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                  {agenda.badge}
                </span>

                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                {agenda.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                {agenda.description}
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold text-white">
                {agenda.promoteTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {agenda.promoteDescription}
              </p>

              <Link
                href="/divulgacao"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
              >
                {agenda.promoteCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AgendaBrowser events={events} locale={locale} />

      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <NewsletterSignup compact locale={locale} />
        </div>
      </section>
    </main>
  );
}
