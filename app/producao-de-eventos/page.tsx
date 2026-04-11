import Link from "next/link";

export default function ProducaoEventosPage() {
  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-flex rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#EC4899]">
                Produção de Eventos
              </span>
              <span className="h-2 w-2 rounded-full bg-[#19B5C9]" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-6xl">
              Experiências que conectam marca, comunidade e contexto
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/68 sm:mt-5 sm:text-lg">
              A Agenda Crypto também atua na construção de experiências,
              ativações e side events pensados para o ecossistema cripto, com
              linguagem alinhada ao mercado e foco em relevância real.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="/divulgacao"
                className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
              >
                Falar sobre projeto
              </Link>

              <Link
                href="/agenda"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
              >
                Ver agenda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 max-w-3xl sm:mb-8">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
            </h2>
            <p className="mt-3 text-white/62">
              Da ideia à experiência, com linguagem, curadoria e presença
              alinhadas ao universo cripto.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Conceito", "Criação da ideia, narrativa e proposta do evento."],
              ["Curadoria", "Conexão com público, speakers, parceiros e contexto."],
              ["Execução", "Apoio na produção, experiência e operação."],
              ["Distribuição", "Integração com divulgação e presença na Agenda Crypto."],
            ].map(([title, text], index) => {
              const dotColors = [
                "bg-[#19B5C9]/15",
                "bg-[#FFD600]/15",
                "bg-[#EC4899]/15",
                "bg-white/10",
              ];

              return (
                <div
                  key={title}
                  className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6"
                >
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className={`h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10 ${dotColors[index]}`} />
                    <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-white/62">
                    {text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CASES */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 max-w-3xl sm:mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
              Cases em destaque
            </p>
            <h2 className="mt-2 text-2xl font-black text-white sm:mt-3 sm:text-3xl">
              Projetos que mostram a linguagem da Agenda Crypto na prática
            </h2>
            <p className="mt-3 text-white/62">
              Alguns exemplos de experiências que uniram comunidade, marca,
              estética e ecossistema.
            </p>
          </div>

          <div className="grid gap-8">
            {/* CASE 1 */}
            <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[#2A2A2A]">
              <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">
                <div className="relative min-h-[220px] border-b border-white/10 sm:min-h-[320px] bg-[linear-gradient(135deg,rgba(25,181,201,0.20),rgba(236,72,153,0.10),rgba(255,214,0,0.18))] lg:border-b-0 lg:border-r">
                  <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                        <video src="/videos/devsonweelsvideo.mp4" 
                          autoPlay muted loop playsInline 
                          className="absolute inset-0 h-full w-full object-cover"/>
                      </p>
                      <h3 className="mt-3 text-2xl font-black text-white">
                        Devs on Wheels
                      </h3>
                      <p className="mt-3 text-sm text-white/60">
                        Aqui pode entrar o vídeo do evento.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8 md:p-10">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFD600]">
                      Side event
                    </span>
                    <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                      Community
                    </span>
                    <span className="rounded-full border border-[#EC4899]/20 bg-[#EC4899]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#EC4899]">
                      Builders
                    </span>
                  </div>

                  <h3 className="text-2xl font-black text-white sm:text-3xl">
                    Devs on Wheels
                  </h3>

                  <p className="mt-2 text-sm font-medium text-white/40">
                    Polygon × Developer DAO • pós Eth Rio
                  </p>

                  <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/68">
                    <p>
                      Um side event criado em parceria com Polygon e Developer
                      DAO para acompanhar o lançamento da zkEVM da Polygon de um
                      jeito memorável e fora do óbvio.
                    </p>

                    <p>
                      A proposta foi levar devs blockchain em
                      uma experiência dentro da roda-gigante do Rio, criando um
                      encontro que uniu comunidade, contexto técnico e presença
                      de mercado em um formato marcante.
                    </p>

                    <p>
                      O evento reuniu devs, builders e jornalistas, além de
                      contar com a presença da equipe da Polygon, que tirou
                      dúvidas diretamente no local e palestrou durante a
                      experiência.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* TIPOS DE PROJETO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Tipos de projetos
              </h2>
              <p className="mt-3 text-white/62">
                A produção pode assumir formatos diferentes dependendo do
                objetivo e do momento da marca.
              </p>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:gap-4">
              {[
                "Side events",
                "Ativações de marca",
                "Experiências exclusivas",
                "Meetups",
                "Eventos fechados",
                "Projetos especiais",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-white/10 bg-[#2A2A2A] px-4 py-3 text-xs font-medium text-white/80 sm:rounded-[24px] sm:px-5 sm:py-4 sm:text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              O diferencial da Agenda Crypto
            </h2>
            <p className="mt-4 text-white/62">
              Não se trata só de produzir. A diferença está em entender o
              ecossistema, o timing e o tipo de experiência que faz sentido
              dentro dele.
            </p>

            <div className="mt-6 space-y-3 text-white/70">
              <p>• Visão de mercado e timing</p>
              <p>• Conexão com comunidade, builders e marcas</p>
              <p>• Linguagem alinhada ao universo web3</p>
              <p>• Integração com divulgação e visibilidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[32px] sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#EC4899]">
                Parceria
              </p>

              <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:mt-3 sm:text-3xl">
                Quer construir uma experiência junto com a Agenda Crypto?
              </h2>

              <p className="mt-3 text-white/62">
                Vamos conversar sobre seu projeto e entender como criar um evento
                ou ativação que faça sentido dentro do ecossistema.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/divulgacao"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ffe44c]"
                >
                  Falar sobre projeto
                </Link>

                <Link
                  href="/agenda"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
                >
                  Ver agenda
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}