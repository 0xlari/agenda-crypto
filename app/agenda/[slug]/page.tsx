import { getEventBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import NewsletterSignup from "@/componentes/newsletter-signup";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
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
                  <span className="rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#EC4899]">
                    {event.audience}
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                {event.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                {event.short_description || "Confira os detalhes do evento e acesse as informações principais."}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {event.registration_url && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
                  >
                    Inscrever-se no evento
                  </a>
                )}

                {event.source_url && (
                  <a
                    href={event.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
                  >
                    Ver fonte original
                  </a>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
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
      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
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

              <div className="pt-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-4 py-2 text-sm font-semibold text-[#19B5C9] transition hover:bg-[#19B5C9]/20">
                    Vou
                  </button>

                  <button className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-[#EC4899]/25 hover:bg-[#EC4899]/10 hover:text-[#EC4899]">
                    Não vou
                  </button>
                </div>

                <p className="mt-3 text-xs text-white/35">
                  Interação social entra na próxima etapa com autenticação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <NewsletterSignup compact />
        </div>
      </section>
    </main>
  );
}