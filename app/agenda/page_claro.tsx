import { getPublishedEvents } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default async function AgendaPage() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen bg-[#F8F8F6] text-[#1F1F1F]">
      {/* HERO */}
      <section className="border-b border-black/10 bg-[#F8F8F6]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#0E8FA0]">
                  Se tem data, tá na agenda
                </span>

                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
              </div>

              <h1 className="max-w-4xl text-3xl font-black tracking-tight text-[#111111] sm:text-5xl lg:text-6xl">
                Agenda Crypto
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/65 sm:mt-5 sm:text-lg">
                Descubra os eventos mais relevantes do mercado cripto em uma
                agenda viva, visual e feita para quem quer acompanhar o que
                realmente importa.
              </p>
            </div>

            <div className="hidden rounded-[32px] border border-[#19B5C9]/15 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] lg:block">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold text-[#111111]">
                Quer divulgar um evento?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-black/60">
                Cadastre sua data na Agenda Crypto e aumente a visibilidade do
                seu evento dentro do ecossistema.
              </p>

              <Link
                href="/admin"
                className="mt-6 inline-flex rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
              >
                + Cadastre seu evento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BUSCA + FILTROS */}
      <section className="border-b border-black/10 bg-[#F8F8F6]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6">
          <div className="rounded-[20px] border border-black/10 bg-white p-3 sm:rounded-[28px] sm:p-4 md:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
            <div className="flex flex-col gap-4">
              <div className="flex items-center rounded-xl border border-black/10 bg-[#F7FBFC] px-3 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3">
                <span className="mr-2 text-black/35 sm:mr-3">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  className="w-full bg-transparent text-xs text-[#111111] outline-none placeholder:text-black/35 sm:text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-[#0E8FA0] transition hover:bg-[#19B5C9]/15">
                  side events
                </button>

                <button className="rounded-full border border-[#EC4899]/20 bg-[#EC4899]/10 px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-[#D53C86] transition hover:bg-[#EC4899]/15">
                  builders
                </button>

                <button className="rounded-full border border-[#FFD600]/30 bg-[#FFF5B8] px-3 py-1.5 text-[11px] sm:px-4 sm:py-2 sm:text-xs font-semibold text-[#8A7200] transition hover:bg-[#FFE970]">
                  stablecoin
                </button>

                <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-black/65 transition hover:border-[#19B5C9]/20 hover:text-[#111111]">
                  online
                </button>

                <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-black/65 transition hover:border-[#19B5C9]/20 hover:text-[#111111]">
                  rio
                </button>

                <button className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-black/65 transition hover:border-[#19B5C9]/20 hover:text-[#111111]">
                  são paulo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 md:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#111111] sm:text-3xl">
              Eventos em destaque
            </h2>
            <p className="mt-2 text-sm text-black/50">
              Uma curadoria viva dos eventos que merecem estar na sua agenda.
            </p>
          </div>

          <div className="text-sm font-medium text-black/35">
            {events.length} evento{events.length !== 1 ? "s" : ""}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-black/10 bg-white px-8 py-16 text-center">
            <p className="text-black/60">Nenhum evento publicado no momento.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-[20px] border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#19B5C9]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] sm:rounded-[30px]"
              >
                {/* IMAGEM */}
                <div className="relative h-44 w-full overflow-hidden sm:h-56 bg-[linear-gradient(135deg,rgba(25,181,201,0.12),rgba(236,72,153,0.06),rgba(255,214,0,0.12))]">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center px-6 text-center">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-black/30">
                          Agenda Crypto
                        </p>
                        <h3 className="mt-3 text-xl font-black text-[#111111]">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {event.category && (
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8A7200] shadow-sm backdrop-blur">
                        {event.category}
                      </span>
                    )}

                    <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#111111] shadow-sm backdrop-blur">
                      {event.city || "Online"}
                    </span>
                  </div>
                </div>

                {/* CONTEÚDO */}
                <div className="p-4 sm:p-6">
                  <p className="text-sm font-medium text-[#0E8FA0]">
                    {formatEventDate(event.start_date)}
                  </p>

                  <h2 className="mt-2 text-lg font-black leading-tight text-[#111111] sm:text-2xl">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-black/62">
                    {event.short_description || "Sem descrição curta."}
                  </p>

                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {event.tags.slice(0, 4).map((tag: string, index: number) => {
                        const styles = [
                          "border-[#19B5C9]/20 bg-[#19B5C9]/10 text-[#0E8FA0]",
                          "border-[#EC4899]/20 bg-[#EC4899]/10 text-[#D53C86]",
                          "border-[#FFD600]/25 bg-[#FFF5B8] text-[#8A7200]",
                          "border-black/10 bg-[#F6F6F6] text-black/65",
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
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2 sm:mt-6">
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#19B5C9] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#149caf] sm:px-4 sm:py-2 sm:text-sm"
                    >
                      Ver evento
                    </Link>

                    <div className="flex gap-1.5 sm:gap-2">
                      <button className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs font-semibold text-[#0E8FA0] transition hover:bg-[#19B5C9]/15">
                        Vou
                      </button>

                      <button className="rounded-full border border-black/10 bg-[#F6F6F6] px-2.5 py-1.5 text-[11px] sm:px-3 sm:py-2 sm:text-xs font-semibold text-black/60 transition hover:border-[#EC4899]/20 hover:bg-[#EC4899]/10 hover:text-[#D53C86]">
                        Não vou
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-black/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14">
          <div className="overflow-hidden rounded-[20px] border border-black/10 bg-white sm:rounded-[32px]">
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5 sm:p-8 md:p-10">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
                </div>

                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#0E8FA0]">
                  Newsletter
                </p>

                <h3 className="mt-3 max-w-xl text-xl font-black leading-tight text-[#111111] sm:text-3xl">
                  Receba os eventos antes de todo mundo
                </h3>

                <p className="mt-2 max-w-2xl text-sm text-black/62 sm:mt-3 sm:text-base">
                  Entre na lista da Agenda Crypto para acompanhar novidades,
                  curadoria e os principais eventos do mercado.
                </p>

                <form className="mt-6 flex flex-row items-center gap-2">
                  <input
                    type="email"
                    placeholder="Seu melhor email"
                    className="min-w-0 flex-1 rounded-full border border-black/10 bg-[#F8F8F6] px-4 py-2.5 text-sm text-[#111111] outline-none placeholder:text-black/35"
                  />
                  <button
                    type="button"
                    className="shrink-0 whitespace-nowrap rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#ffe44c]"
                  >
                    Entrar na lista
                  </button>
                </form>
              </div>

              <div className="relative hidden min-h-[280px] overflow-hidden md:block">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(25,181,201,0.10),rgba(236,72,153,0.08),rgba(255,214,0,0.10))]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_40%)]" />
                <div className="absolute left-8 top-8 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black/60 backdrop-blur">
                  Agenda Crypto
                </div>
                <div className="absolute bottom-10 left-8 max-w-xs">
                  <p className="text-sm font-medium text-black/45">
                    Se tem data, tá na agenda.
                  </p>
                  <p className="mt-3 text-2xl font-black leading-tight text-[#111111]">
                    Curadoria viva para quem acompanha o ecossistema de perto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}