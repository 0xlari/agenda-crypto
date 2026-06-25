export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getPublishedEvents } from "@/lib/supabase/queries";
import NewsletterSignup from "@/componentes/newsletter-signup";
import AgendaBrowser from "@/componentes/agenda/agenda-browser";
import Link from "next/link";
import PageTour from "@/componentes/onboarding/page-tour";
import { absoluteUrl, SEO_IMAGE, SITE_NAME } from "@/lib/seo";

const AGENDA_TITLE = "Agenda de eventos cripto no Brasil e America Latina";
const AGENDA_DESCRIPTION =
  "Explore eventos cripto, web3 e blockchain por pais, cidade e data. Encontre conferencias, meetups, side events e encontros da comunidade na Agenda Crypto.";

export const metadata: Metadata = {
  title: AGENDA_TITLE,
  description: AGENDA_DESCRIPTION,
  alternates: {
    canonical: "/agenda",
  },
  keywords: [
    "agenda cripto",
    "eventos cripto",
    "eventos web3",
    "eventos blockchain",
    "eventos bitcoin",
    "eventos crypto Brasil",
    "eventos crypto America Latina",
    "meetups cripto",
    "conferencias blockchain",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/agenda",
    siteName: SITE_NAME,
    title: AGENDA_TITLE,
    description: AGENDA_DESCRIPTION,
    images: [
      {
        url: SEO_IMAGE,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: AGENDA_TITLE,
    description: AGENDA_DESCRIPTION,
    images: [SEO_IMAGE],
  },
};

export default async function AgendaPage() {
  const events = await getPublishedEvents();
  const agendaJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: AGENDA_TITLE,
    description: AGENDA_DESCRIPTION,
    url: absoluteUrl("/agenda"),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: absoluteUrl("/agenda"),
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
        pageId="agenda"
        steps={[
          {
            icon: "🔍",
            title: "Escolha seu país no radar",
            description:
              "Use o mapa ou a lista de países para encontrar rapidamente onde estão os próximos eventos.",
          },
          {
            icon: "🏷️",
            title: "Refine sua rota",
            description:
              "Combine o país com cidade, tema, formato ou nome do evento para chegar ao resultado certo.",
          },
          {
            icon: "📌",
            title: "Monte sua rota pela Agenda",
            description:
              "Salve eventos, marque onde você pretende ir e acompanhe tudo depois na sua Minha Agenda.",
          },
        ]}
      />
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                  Se tem data, tá na agenda
                </span>

                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Agenda Crypto
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                Explore os eventos mais relevantes do mercado cripto por país e
                monte uma rota clara pelo ecossistema latino-americano.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold text-white">
                Quer divulgar um evento?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Cadastre sua data na Agenda Crypto e aumente a visibilidade do
                seu evento dentro do ecossistema.
              </p>

              <Link
                href="/divulgacao"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
              >
                + Cadastre seu evento
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AgendaBrowser events={events} />

      {/* NEWSLETTER */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <NewsletterSignup compact />
        </div>
      </section>
    </main>
  );
}
