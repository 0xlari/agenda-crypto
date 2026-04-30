import { getEventBySlug, getChildEvents } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import NewsletterSignup from "@/componentes/newsletter-signup";
import EventResponse from "@/componentes/event-response";
import EventViewTracker from "@/componentes/event_view_tracker";
import { getRelatedEvents } from "@/lib/supabase/queries";

function formatDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  const sideEvents = event ? await getChildEvents(event.id) : [];
  const relatedEvents = await getRelatedEvents(event);

  if (!event) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <EventViewTracker eventId={event.id} />
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 py-8 sm:px-6 md:py-12">
          <div className="min-w-0 overflow-hidden">
            <div>
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
                  <span className="max-w-full break-words rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#EC4899] sm:max-w-[520px]">
                    {event.audience}
                  </span>
                )}
              </div>

              <h1 className="max-w-full overflow-hidden break-words text-[42px] font-black leading-[0.98] tracking-[-0.04em] text-white sm:max-w-4xl sm:text-5xl lg:text-6xl">
                {event.title}
              </h1>

              <p className="mt-4 max-w-2xl overflow-hidden break-words text-base leading-relaxed text-white/68 sm:text-lg">
                {event.short_description || "Confira os detalhes do evento e acesse as informações principais."}
              </p>

              <div className="mb-8 mt-8 flex w-full flex-col gap-3 sm:mb-0 sm:flex-row">
                {event.registration_url && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
                  >
                    Inscrever-se no evento
                  </a>
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

            <div className="mt-4 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:mt-0">
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
                <strong className="text-white">Data de fim:</strong> {formatDate(event.end_date)}
              </p>
                )}
                {event.event_time && (
                <p className="text-white/70">
                  <strong className="text-white">Horário:</strong> {event.event_time}
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
                    <p className="mt-1 text-white">{event.audience}</p>
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
        <section className="mt-8 rounded-[32px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#19B5C9]">
            Destaque da Agenda Crypto
          </p>
          <p className="mt-3 max-w-3xl text-base leading-8 text-white/80">
            {event.agenda_highlight}
          </p>
        </section>
      )}
      </section>

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
        {relatedEvents.map((item: any) => (
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
      
      {sideEvents.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-12">
          <div className="rounded-[32px] border border-white/10 bg-[#2A2A2A] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#19B5C9]">
              Agenda paralela
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Agenda Paralela
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Outros eventos conectados a este momento do mercado e à mesma semana.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {sideEvents.map((item: any) => (
                <a
                  key={item.id}
                  href={`/agenda/${item.slug}`}
                  className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFD600]">
                      {item.event_type || "side event"}
                    </span>

                    {item.city && (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70">
                        {item.city}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  {item.short_description && (
                    <p className="mt-2 text-sm leading-7 text-white/65">
                      {item.short_description}
                    </p>
                  )}

                  <div className="mt-4 text-sm text-white/55">
                    {item.start_date && (
                      <p>
                        {new Date(item.start_date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {item.event_time ? ` • ${item.event_time}` : ""}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl overflow-hidden px-5 py-10 sm:px-6 md:py-14">
          <NewsletterSignup compact />
        </div>
      </section>
    </main>
  );
}