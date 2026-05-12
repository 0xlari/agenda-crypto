export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { getFeaturedEvents } from "@/lib/supabase/queries";
import NewsletterSignup from "@/componentes/newsletter-signup";
import PageTour from "@/componentes/onboarding/page-tour";
import OnboardingWizard from "@/componentes/onboarding/onboarding-wizard";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default async function HomePage() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <OnboardingWizard />
      <PageTour
        pageId="home"
        steps={[
          {
            icon: "👋",
            title: "Comece pelo radar do mercado",
            description:
              "Aqui você encontra os principais caminhos da Agenda Crypto: eventos em destaque, curadoria da semana, divulgação e produção de experiências.",
          },
          {
            icon: "🗓️",
            title: "Veja o que está movimentando o ecossistema",
            description:
              "Os cards destacam eventos relevantes para quem quer acompanhar tendências, encontrar comunidades e estar nos encontros certos.",
          },
          {
            icon: "📣",
            title: "Leve seu evento para a audiência certa",
            description:
              'Use o botão “Divulgar evento” para cadastrar sua iniciativa e colocar seu encontro no radar da comunidade cripto.',
          },
        ]}
      />
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                  Se tem data, tá na agenda
                </span>

                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
              </div>

              <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Descubra os eventos que movimentam o ecossistema cripto
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                Descubra eventos, encontros e experiências com curadoria, contexto e visão de comunidade para acompanhar de perto o que movimenta o ecossistema.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/agenda"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
                >
                  Ver agenda
                </Link>

                <Link
                  href="/divulgacao"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9] sm:w-auto"
                >
                  Divulgar evento
                </Link>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-5 sm:p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold text-white">
                Para quem vive o ecossistema
              </p>

              <div className="mt-4 space-y-3 text-sm text-white/65">
                <p>• Builders, founders e comunidades web3</p>
                <p>• Pessoas que querem descobrir eventos relevantes</p>
                <p>• Marcas e projetos s que querem ganhar visibilidade</p>
              </div>

              <Link
                href="/producao-de-eventos"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-5 py-3 text-sm font-semibold text-[#19B5C9] transition hover:bg-[#19B5C9]/20 sm:w-auto"
              >
                Conhecer produção de eventos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <NewsletterSignup />
        </div>
      </section>

      {/* EVENTOS EM DESTAQUE */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Eventos em destaque
            </h2>
            <p className="mt-2 text-sm text-white/55">
              Uma seleção de eventos que estão no radar da comunidade.
            </p>
          </div>

          <Link
            href="/agenda"
            className="text-sm font-semibold text-[#19B5C9] transition hover:text-white"
          >
            Ver agenda completa →
          </Link>
        </div>

        {featuredEvents.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-16 text-center">
            <p className="text-white/65">Nenhum evento em destaque no momento.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {featuredEvents.map((event) => (
              <article
                key={event.id}
                className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#2A2A2A] transition duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[linear-gradient(135deg,rgba(25,181,201,0.16),rgba(236,72,153,0.08),rgba(255,214,0,0.16))]">
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
                        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                          Agenda Crypto
                        </p>
                        <h3 className="mt-3 text-xl font-black text-white">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {event.category && (
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFD600] backdrop-blur">
                        {event.category}
                      </span>
                    )}

                    <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur">
                      {event.city || "Online"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium text-[#19B5C9]">
                    {formatEventDate(event.start_date)}
                  </p>

                  <h3 className="mt-2 text-2xl font-black leading-tight text-white">
                    {event.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/62">
                    {event.short_description || "Sem descrição curta."}
                  </p>

                  <div className="mt-6">
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-white/90"
                    >
                      Ver evento
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SERVIÇOS */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
              Serviços
            </p>
            <h2 className="mt-3 text-3xl font-black text-white">
              Mais que agenda: visibilidade, curadoria e experiências
            </h2>
            <p className="mt-3 text-white/62">
              Além de mapear eventos, a Agenda Crypto ajuda marcas, comunidades e organizadores a se conectarem com a audiência certa.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-7">
              <h3 className="text-2xl font-black text-white">Divulgação</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Coloque seu evento na frente das pessoas certas com apoio de uma
                plataforma com autoridade dentro do ecossistema.
              </p>
              <Link
                href="/divulgacao"
                className="mt-6 inline-flex rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-5 py-3 text-sm font-semibold text-[#19B5C9] transition hover:bg-[#19B5C9]/20"
              >
                Conhecer divulgação
              </Link>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-7">
              <h3 className="text-2xl font-black text-white">
                Produção de Eventos
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Apoio na construção de experiências, ativações e eventos com
                linguagem alinhada ao universo cripto e web3.
              </p>
              <Link
                href="/producao-de-eventos"
                className="mt-6 inline-flex rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-5 py-3 text-sm font-semibold text-[#EC4899] transition hover:bg-[#EC4899]/20"
              >
                Ver produção de eventos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}