export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import AgendaPageContent from "@/componentes/agenda/agenda-page-content";
import { getDictionary } from "@/lib/i18n";
import { getPublishedEvents } from "@/lib/supabase/queries";
import { SEO_IMAGE, SITE_NAME } from "@/lib/seo";

const agenda = getDictionary("es").agenda;

export const metadata: Metadata = {
  title: agenda.seoTitle,
  description: agenda.seoDescription,
  alternates: {
    canonical: "/es",
    languages: {
      "pt-BR": "/agenda",
      es: "/es",
    },
  },
  keywords: [...agenda.keywords],
  openGraph: {
    type: "website",
    locale: "es_419",
    url: "/es",
    siteName: SITE_NAME,
    title: agenda.seoTitle,
    description: agenda.seoDescription,
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
    title: agenda.seoTitle,
    description: agenda.seoDescription,
    images: [SEO_IMAGE],
  },
};

export default async function AgendaSpanishPage() {
  const events = await getPublishedEvents();
  return <AgendaPageContent events={events} locale="es" />;
}
