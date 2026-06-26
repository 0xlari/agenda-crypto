import type { Metadata } from "next";
import { getEventBySlug, getChildEvents } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import NewsletterSignup from "@/componentes/newsletter-signup";
import EventResponse from "@/componentes/event-response";
import EventViewTracker from "@/componentes/event_view_tracker";
import { getRelatedEvents } from "@/lib/supabase/queries";
import RegistrationClickButton from "@/componentes/registration-click-button";
import { absoluteUrl, SEO_IMAGE, SITE_NAME, seoDescription } from "@/lib/seo";

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });
}

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

type EventCardItem = {
  id: string;
  slug: string;
  title: string;
  short_description?: string | null;
  image_url?: string | null;
  city?: string | null;
  event_type?: string | null;
  category?: string | null;
  start_date?: string | null;
  event_time?: string | null;
  venue?: string | null;
  level?: string | null;
  registration_url?: string | null;
  is_side_event?: boolean | null;
};

function schemaDate(dateString: string | null | undefined, eventTime?: string | null) {
  if (!dateString) return undefined;

  const time = eventTime?.match(/\d{1,2}:\d{2}/)?.[0];

  return time ? `${dateString}T${time}:00-03:00` : dateString;
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Evento nao encontrado",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = seoDescription(
    event.short_description || event.description,
    `Detalhes de ${event.title} na Agenda Crypto.`
  );
  const eventUrl = `/agenda/${event.slug}`;
  const image = event.image_url || SEO_IMAGE;
  const keywords = [
    event.title,
    event.category,
    event.event_type,
    event.city,
    event.country,
    ...(event.tags || []),
  ].filter(
    (keyword): keyword is string =>
      typeof keyword === "string" && keyword.trim().length > 0
  );

  return {
    title: event.title,
    description,
    keywords,
    alternates: {
      canonical: eventUrl,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: eventUrl,
      siteName: SITE_NAME,
      title: event.title,
      description,
      images: [
        {
          url: image,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: event.image_url ? "summary_large_image" : "summary",
      title: event.title,
      description,
      images: [image],
    },
  };
}

export default async function EventPage({
  params,
}: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const childEvents = event ? await getChildEvents(event.id) : [];
  const officialProgram = childEvents.filter(
    (item: EventCardItem) =>
      !item.is_side_event &&
      ["official_workshop", "program_item"].includes(
        String(item.event_type || "").toLowerCase()
      )
  );
  const sideEvents = childEvents.filter(
    (item: EventCardItem) => item.is_side_event
  );
  const relatedEvents = await getRelatedEvents(event);

  if (!event) {
    return notFound();
  }

  const eventDescription = seoDescription(
    event.short_description || event.description,
    `Detalhes de ${event.title} na Agenda Crypto.`
  );
  const eventUrl = absoluteUrl(`/agenda/${event.slug}`);
  const eventImage = event.image_url || absoluteUrl(SEO_IMAGE);
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: eventDescription,
    url: eventUrl,
    image: [eventImage],
    startDate: schemaDate(event.start_date, event.event_time),
    endDate: schemaDate(event.end_date || event.start_date, event.event_time),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: event.is_online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: event.is_online
      ? {
          "@type": "VirtualLocation",
          url: event.registration_url || event.source_url || eventUrl,
        }
      : {
          "@type": "Place",
          name: event.venue || event.city || "Local a confirmar",
          address: {
            "@type": "PostalAddress",
            addressLocality: event.city || undefined,
            addressCountry: event.country || undefined,
          },
        },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/agenda"),
    },
  };

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <EventViewTracker eventId={event.id} />
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="min-w-0">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {event.category && (
                  <span className="rounded-full border border-[#FFD600]/25 bg-[#FFD600]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#FFD600]">
                    {event.category}
                  </span>
                )}

                <span className="rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                  {event.city || "Online"}
                </span>

                {event.audience && (
                  <span className="max-w-full break-all rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#EC4899] sm:max-w-[520px] sm:break-words">
                    {event.audience}
                  </span>
                )}
              </div>

              <h1 className="max-w-full break-words text-[34px] font-black leading-[1.02] tracking-[-0.04em] text-white sm:max-w-4xl sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <p className="mt-4 max-w-full break-words text-base leading-8 text-white/68 sm:max-w-2xl sm:text-lg">
                {event.short_description ||
                  "Confira os detalhes do evento e acesse as informações principais."}
              </p>

              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
                {event.registration_url && (
                  <RegistrationClickButton
                    eventId={event.id}
                    url={event.registration_url}
                  />
                )}
                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9] sm:w-auto"
                  >
                    Ver fonte original
                  </a>
                )}
              </div>
            </div>

            <div className="w-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:rounded-[32px] sm:p-6 lg:justify-self-end">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <h2 className="text-lg font-bold text-white">Resumo do evento</h2>

              <div className="mt-5 space-y-4 text-sm text-white/65">
                <div>
                  <p className="text-white/35">Data</p>
                  <p className="mt-1 text-white">{formatDate(event.start_date)}</p>
                </div>

                {event.end_date && (
                  <p className="text-white/70">
                    <strong className="text-white">Data de fim:</strong>{" "}
                    {formatDate(event.end_date)}
                  </p>
                )}

                {event.event_time && (
                  <p className="text-white/70">
                    <strong className="text-white">Horário:</strong>{" "}
                    {event.event_time}
                  </p>
                )}

                {event.venue && (
                  <div>
                    <p className="text-white/35">Local</p>
                    <p className="mt-1 text-white">{event.venue}</p>
                  </div>
                )}

                <div>
                  <p className="text-white/35">Cidade</p>
                  <p className="mt-1 text-white">{event.city || "Online"}</p>
                </div>

                {event.audience && (
                  <div>
                    <p className="text-white/35">Público</p>
                    <p className="mt-1 break-all text-white">{event.audience}</p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMAGEM + DETALHES */}
      <section className="mx-auto max-w-7xl overflow-hidden px-5 py-8 sm:px-6 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#2A2A2A]">
            <div className="relative h-[320px] w-full overflow-hidden bg-[linear-gradient(135deg,rgba(25,181,201,0.16),rgba(236,72,153,0.08),rgba(255,214,0,0.16))] md:h-[420px]">
              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center px-8 text-center">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                      Agenda Crypto
                    </p>
                    <h3 className="mt-3 text-2xl font-black text-white">
                      {event.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#2A2A2A] p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
              Sobre o evento
            </p>

            <div className="mt-4 space-y-5">
              <p className="text-base leading-relaxed text-white/68">
                {event.description || "Sem descrição disponível."}
              </p>
              {event.tags && event.tags.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-white/45">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag: string, index: number) => {
                    const styles = [
                      "border-[#19B5C9]/20 bg-[#19B5C9]/10 text-[#19B5C9]",
                      "border-[#EC4899]/20 bg-[#EC4899]/10 text-[#EC4899]",
                      "border-[#FFD600]/20 bg-[#FFD600]/10 text-[#FFD600]",
                      "border-white/10 bg-white/[0.04] text-white/70",
                    ];

                    return (
                      <span
                        key={tag}
                        className={`rounded-full border px-3 py-1 text-[11px] font-medium ${styles[index % styles.length]}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

              <EventResponse eventId={event.id} />
            </div>
          </div>
        </div>
      {event.agenda_highlight && (
  <section className="mt-8 rounded-[36px] border border-[#FFD600]/20 bg-[linear-gradient(135deg,rgba(255,214,0,0.12),rgba(42,42,42,0.96),rgba(25,181,201,0.10))] p-6 md:p-8">
    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFD600]">
      Por que este evento importa
    </p>

    <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
      A leitura da Agenda sobre este movimento
    </h2>

    <p className="mt-4 max-w-4xl text-base leading-8 text-white/78">
      {event.agenda_highlight}
    </p>

    {childEvents.length > 0 && (
      <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
        <p className="text-sm leading-7 text-white/70">
          A Agenda não mostra só o evento principal. Ela organiza a programação oficial e também os encontros paralelos
          que movimentam o ecossistema durante a semana.
        </p>

        <p className="mt-3 text-sm font-bold text-[#FFD600]">
          {officialProgram.length} itens de programação oficial
          {sideEvents.length > 0 ? ` e ${sideEvents.length} side events` : ""} foram mapeados para {event.title}.
        </p>
      </div>
    )}
  </section>
)}
      </section>

      {officialProgram.length > 0 && (
        <section className="mx-auto max-w-7xl overflow-hidden px-5 pb-10 sm:px-6 md:pb-12">
          <div className="rounded-[32px] border border-[#FFD600]/20 bg-[#2A2A2A] p-6 md:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD600]">
                  Programação oficial
                </p>

                <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
                  Workshops do {event.title}
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/65">
                  Sessões oficiais conectadas ao evento principal, organizadas por dia e horário.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Itens de programação
                </p>
                <p className="mt-1 text-3xl font-black text-[#FFD600]">
                  {officialProgram.length}
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-6">
              {(Object.entries(
                officialProgram.reduce((groups: Record<string, EventCardItem[]>, item: EventCardItem) => {
                  const key = item.start_date || "Sem data";
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(item);
                  return groups;
                }, {})
              ) as [string, EventCardItem[]][])
                .sort(([dateA], [dateB]) => {
                  if (dateA === "Sem data") return 1;
                  if (dateB === "Sem data") return -1;
                  return new Date(dateA).getTime() - new Date(dateB).getTime();
                })
                .map(([date, items]) => (
                  <div key={date}>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#FFD600]/25 bg-[#FFD600]/10">
                        {date === "Sem data" ? (
                          <span className="text-[10px] font-bold uppercase text-[#FFD600]">
                            S/D
                          </span>
                        ) : (
                          <>
                            <span className="text-lg font-black text-white">
                              {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                              })}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FFD600]">
                              {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                                month: "short",
                              })}
                            </span>
                          </>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                          {date === "Sem data" ? "Data a confirmar" : "Dia de workshops"}
                        </p>
                        <p className="text-lg font-black text-white">
                          {items.length} {items.length === 1 ? "sessão oficial" : "sessões oficiais"}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {items
                        .sort((a, b) =>
                          `${a.event_time || ""}${a.title}`.localeCompare(
                            `${b.event_time || ""}${b.title}`,
                            "pt-BR"
                          )
                        )
                        .map((item: EventCardItem) => (
                          <article
                            key={item.id}
                            className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              {item.event_time && (
                                <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-bold text-[#FFD600]">
                                  {item.event_time}
                                </span>
                              )}

                              {item.level && (
                                <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                                  {item.level}
                                </span>
                              )}

                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/60">
                                Workshop oficial
                              </span>
                            </div>

                            <h3 className="mt-4 text-lg font-black leading-tight text-white">
                              {item.title}
                            </h3>

                            {item.short_description && (
                              <p className="mt-2 text-sm leading-6 text-white/62">
                                {item.short_description}
                              </p>
                            )}

                            {item.registration_url && (
                              <a
                                href={item.registration_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-black transition hover:bg-[#F3F3F3]"
                              >
                                Inscrever-se
                              </a>
                            )}
                          </article>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {sideEvents.length > 0 && (
  <section className="mx-auto max-w-7xl overflow-hidden px-5 pb-10 sm:px-6 md:pb-12">
    <div className="relative overflow-hidden rounded-[36px] border border-[#19B5C9]/20 bg-[linear-gradient(135deg,rgba(25,181,201,0.14),rgba(42,42,42,0.96),rgba(236,72,153,0.10))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8">
      <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full bg-[#19B5C9]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-[#EC4899]/10 blur-3xl" />

      <div className="relative z-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#19B5C9]">
              Mapa do ecossistema
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white md:text-4xl">
              Semana {event.title}
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68 md:text-base">
              A Agenda identificou os encontros, happy hours, ativações e experiências que acontecem ao redor do evento principal.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Eventos mapeados
            </p>
            <p className="mt-1 text-3xl font-black text-[#FFD600]">
              {sideEvents.length}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-4 py-2 text-xs font-semibold text-[#FFD600]">
            {sideEvents.length} side events conectados
          </span>

          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70">
            Semana do evento
          </span>

          <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-4 py-2 text-xs font-semibold text-[#19B5C9]">
            Networking, founders e comunidade
          </span>

          {event.city && (
            <span className="rounded-full border border-[#EC4899]/20 bg-[#EC4899]/10 px-4 py-2 text-xs font-semibold text-[#EC4899]">
              {event.city}
            </span>
          )}
        </div>

        <div className="mt-8 space-y-7">
          {(Object.entries(
            sideEvents.reduce((groups: Record<string, EventCardItem[]>, item: EventCardItem) => {
              const key = item.start_date || "Sem data";
              if (!groups[key]) groups[key] = [];
              groups[key].push(item);
              return groups;
            }, {})
          ) as [string, EventCardItem[]][])
            .sort(([dateA], [dateB]) => {
              if (dateA === "Sem data") return 1;
              if (dateB === "Sem data") return -1;
              return new Date(dateA).getTime() - new Date(dateB).getTime();
            })
            .map(([date, items]) => (
              <div key={date} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl border border-[#19B5C9]/25 bg-[#19B5C9]/10">
                    {date === "Sem data" ? (
                      <span className="text-[10px] font-bold uppercase text-[#19B5C9]">
                        S/D
                      </span>
                    ) : (
                      <>
                        <span className="text-xl font-black text-white">
                          {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                          })}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#19B5C9]">
                          {new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR", {
                            month: "short",
                          })}
                        </span>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-white/45">
                      {date === "Sem data" ? "Eventos sem data definida" : "Dia do circuito"}
                    </p>
                    <p className="text-lg font-black text-white">
                      {items.length} {items.length === 1 ? "evento conectado" : "eventos conectados"}
                    </p>
                  </div>
                </div>

                <div className="relative ml-7 border-l border-[#19B5C9]/25 pl-7">
                  <div className="space-y-4">
                    {items.map((item: EventCardItem) => (
                      <a
                        key={item.id}
                        href={`/agenda/${item.slug}`}
                        className="group relative block overflow-hidden rounded-[26px] border border-white/10 bg-[#1F1F1F]/90 transition hover:-translate-y-1 hover:border-[#19B5C9]/35 hover:bg-[#252525]"
                      >
                        <span className="absolute -left-[35px] top-7 h-3 w-3 rounded-full border border-[#19B5C9] bg-[#19B5C9]" />

                        <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                          <div className="relative h-44 w-full overflow-hidden bg-[linear-gradient(135deg,rgba(25,181,201,0.18),rgba(236,72,153,0.10),rgba(255,214,0,0.16))] md:h-full">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.title}
                                fill
                                unoptimized
                                className="object-cover transition duration-300 group-hover:scale-[1.04]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center px-6 text-center">
                                <div>
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-white/35">
                                    Agenda Crypto
                                  </p>
                                  <h3 className="mt-3 text-lg font-black text-white">
                                    Side event
                                  </h3>
                                </div>
                              </div>
                            )}

                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                            <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-[#FFD600] px-3 py-1 text-[10px] font-black uppercase tracking-wide text-black">
                                Side event
                              </span>

                              {item.city && (
                                <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                                  {item.city}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex flex-wrap gap-2">
                              {item.event_type && (
                                <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                                  {String(item.event_type).replaceAll("_", " ")}
                                </span>
                              )}

                              {item.category && (
                                <span className="rounded-full border border-[#EC4899]/20 bg-[#EC4899]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#EC4899]">
                                  {item.category}
                                </span>
                              )}
                            </div>

                            <h3 className="mt-3 text-xl font-black leading-tight text-white">
                              {item.title}
                            </h3>

                            {item.short_description && (
                              <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/62">
                                {item.short_description}
                              </p>
                            )}

                            <div className="mt-4 flex flex-col gap-1 text-sm text-white/55">
                              {item.event_time && <p>{item.event_time}</p>}
                              {item.venue && <p>{item.venue}</p>}
                            </div>

                            <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#19B5C9]">
                              Ver side event
                              <span aria-hidden="true">→</span>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  </section>
)}

      {relatedEvents.length > 0 && (
  <section className="mx-auto max-w-7xl overflow-hidden px-5 pb-10 sm:px-6 md:pb-12">
    <div className="rounded-[32px] border border-white/10 bg-[#2A2A2A] p-6 md:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#EC4899]">
        Você também pode gostar
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Eventos relacionados
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
        Seleções com base em tema, formato, cidade e contexto do evento.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relatedEvents.map((item: EventCardItem) => (
          <a
            key={item.id}
            href={`/agenda/${item.slug}`}
            className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#EC4899]/30 hover:bg-[#EC4899]/10"
          >
            <div className="flex flex-wrap gap-2">
              {item.category && (
                <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                  {item.category}
                </span>
              )}

              {item.event_type && (
                <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFD600]">
                  {item.event_type}
                </span>
              )}
            </div>

            <h3 className="mt-4 text-lg font-bold text-white">
              {item.title}
            </h3>

            {item.short_description && (
              <p className="mt-2 text-sm leading-7 text-white/65">
                {item.short_description}
              </p>
            )}

            <p className="mt-4 text-sm text-white/55">
              {item.city || "Online"}
            </p>
          </a>
        ))}
      </div>
    </div>
  </section>
)}


      {/* NEWSLETTER */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-12">
          <NewsletterSignup compact />
        </div>
      </section>
    </main>
  );
}
