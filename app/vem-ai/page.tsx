export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import EventAnnouncementGrid from "@/componentes/event-announcement-grid";
import { getPublishedEventAnnouncements } from "@/lib/supabase/queries";
import { SEO_IMAGE, SITE_NAME } from "@/lib/seo";

const TITLE = "Vem aí: próximos eventos cripto";
const DESCRIPTION =
  "Acompanhe anúncios preliminares de eventos cripto, web3 e blockchain que ainda aguardam confirmação de data ou local.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "próximos eventos cripto",
    "eventos cripto 2027",
    "eventos blockchain América Latina",
    "eventos web3 a confirmar",
  ],
  alternates: { canonical: "/vem-ai" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/vem-ai",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: SEO_IMAGE, width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESCRIPTION,
    images: [SEO_IMAGE],
  },
};

export default async function ComingSoonPage() {
  const announcements = await getPublishedEventAnnouncements();

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <span className="inline-flex rounded-full border border-[#EC4899]/30 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#F8A9CF]">
              Radar da Agenda Crypto
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Vem aí
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-white/65 sm:text-lg">
              Sinais de eventos que já foram anunciados por fontes oficiais, mas ainda não têm todas as
              informações confirmadas. Aqui, expectativa não vira certeza: data e local continuam marcados
              como preliminares até a confirmação dos organizadores.
            </p>
            <Link
              href="/agenda"
              className="mt-7 inline-flex min-h-11 items-center justify-center rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#ffe44c] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Ver eventos confirmados
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="announcements-title">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-7 sm:mb-9">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#19B5C9]">
              Em observação
            </p>
            <h2 id="announcements-title" className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Próximos movimentos do ecossistema
            </h2>
          </div>
          <EventAnnouncementGrid announcements={announcements} />
        </div>
      </section>
    </main>
  );
}
