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
    <main className="min-h-screen bg-[#111111] text-white">
      {/* HERO */}
      <section className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-[#19B5C9] px-4 py-1 text-xs font-bold uppercase tracking-wide text-black">
                Se tem data, tá na agenda
              </span>

              <h1 className="mt-5 text-5xl font-black tracking-tight text-white">
                Agenda Crypto
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
                Os eventos mais relevantes do mercado cripto em um só lugar.
                Descubra o que vale sua atenção e acompanhe a agenda com
                antecedência.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-6">
              <p className="text-sm font-semibold text-white">
                Quer divulgar um evento?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Cadastre seu evento e coloque sua data na Agenda Crypto.
              </p>

              <Link
                href="/admin"
                className="mt-5 inline-flex rounded-full bg-[#FFD600] px-5 py-3 text-sm font-extrabold text-black transition hover:scale-[1.02] hover:bg-[#ffe033]"
              >
                + Cadastre seu evento
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BUSCA + TAGS */}
      <section className="border-b border-white/10 bg-[#111111]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-5">
            <div className="w-full max-w-3xl">
              <div className="flex items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span className="mr-3 text-white/50">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar eventos, cidade, tema..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-[#FFD600] px-4 py-2 text-xs font-bold text-black transition hover:opacity-90">
                side events
              </button>
              <button className="rounded-full bg-[#19B5C9] px-4 py-2 text-xs font-bold text-black transition hover:opacity-90">
                builders
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-[#19B5C9] hover:text-white">
                stablecoin
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-[#19B5C9] hover:text-white">
                online
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-[#19B5C9] hover:text-white">
                rio
              </button>
              <button className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/80 transition hover:border-[#19B5C9] hover:text-white">
                são paulo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LISTA */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">
              Eventos em destaque
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Uma curadoria viva dos eventos que importam.
            </p>
          </div>

          <div className="text-sm font-medium text-white/40">
            {events.length} evento{events.length !== 1 ? "s" : ""}
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-white/15 bg-white/5 px-8 py-16 text-center">
            <p className="text-white/70">Nenhum evento publicado no momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#181818] transition hover:-translate-y-1 hover:border-[#19B5C9]/40"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#19B5C9]/30 via-[#1b1b1b] to-[#FFD600]/30">
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
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
                          Agenda Crypto
                        </p>
                        <h3 className="mt-3 text-xl font-black text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {event.category && (
                      <span className="rounded-full bg-[#FFD600] px-3 py-1 text-[11px] font-extrabold uppercase text-black">
                        {event.category}
                      </span>
                    )}
                    <span className="rounded-full bg-black/70 px-3 py-1 text-[11px] font-bold uppercase text-white backdrop-blur">
                      {event.city || "Online"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium text-[#19B5C9]">
                    {formatEventDate(event.start_date)}
                  </p>

                  <h2 className="mt-2 text-2xl font-black leading-tight text-white">
                    {event.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/65">
                    {event.short_description || "Sem descrição curta."}
                  </p>

                  {event.tags && event.tags.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {event.tags.slice(0, 4).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/75"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-[#19B5C9] px-4 py-2 text-sm font-extrabold text-black transition hover:bg-[#22c7dc]"
                    >
                      Ver evento
                    </Link>

                    <div className="flex gap-2">
                      <button className="rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-3 py-2 text-xs font-bold text-[#19B5C9] transition hover:bg-[#19B5C9] hover:text-black">
                        Vou
                      </button>
                      <button className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 transition hover:border-[#FFD600] hover:text-[#FFD600]">
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
      <section className="border-t border-white/10 bg-[#0d0d0d]">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[32px] border border-[#19B5C9]/20 bg-gradient-to-r from-[#19B5C9]/10 via-white/[0.03] to-[#FFD600]/10 p-8 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-[#19B5C9]">
                Newsletter
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                Receba os eventos antes de todo mundo
              </h3>

              <p className="mt-3 text-white/70">
                Entre na lista da Agenda Crypto para receber novidades,
                curadoria e os principais eventos do mercado.
              </p>

              <form className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="Seu melhor email"
                  className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-3 text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  className="rounded-full bg-[#FFD600] px-6 py-3 font-extrabold text-black transition hover:bg-[#ffe033]"
                >
                  Entrar na lista
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}