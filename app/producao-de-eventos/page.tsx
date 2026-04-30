import PageTour from "@/componentes/onboarding/page-tour";

const whatsappMessage = encodeURIComponent(
  "Oi! Vim pela página de Produção de Eventos da Agenda Crypto e quero entender melhor como vocês podem apoiar meu projeto."
);

export default function ProducaoDeEventosPage() {
  return (
    <main className="min-h-screen bg-[#212121] text-white">
      <PageTour
        pageId="producao-de-eventos"
        steps={[
          {
            title: "Transforme ideia em experiência",
            description:
              "Aqui mostramos como a Agenda Crypto apoia marcas, protocolos e comunidades na criação de eventos com linguagem nativa do ecossistema.",
          },
          {
            title: "Do conceito ao pós-evento",
            description:
              "Unimos estratégia, produção, ativação de comunidade, cobertura e conteúdo para o evento gerar presença antes, durante e depois.",
          },
          {
            title: "Comece pelo formato certo",
            description:
              "Fale com a gente pelo WhatsApp para contar o momento do projeto e desenhar uma experiência que faça sentido para sua marca.",
          },
        ]}
      />
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#19B5C9]">
                Produção de eventos
              </p>

              <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-white sm:text-5xl">
                Eventos que conectam comunidade, marcas e experiências no Web3
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-white/68 sm:text-lg">
                A Agenda Crypto também atua na criação, produção e ativação de
                eventos. Do conceito à execução, ajudamos marcas e comunidades a
                transformarem ideias em experiências que geram presença, conexão
                e repercussão.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`https://wa.me/5521981833526?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
                >
                  Falar no WhatsApp
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-2xl font-black text-white">Web3</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Especialização em eventos, comunidades e ativações do mercado.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-2xl font-black text-white">Conteúdo</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Produção com olhar estratégico para cobertura, narrativa e distribuição.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-2xl font-black text-white">Conexão</p>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Experiências pensadas para gerar relacionamento real entre marcas e pessoas.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD600]">
                O que fazemos
              </p>

              <div className="mt-5 space-y-4 text-sm leading-7 text-white/70">
                <p>
                  Produção de eventos presenciais e híbridos com foco em experiência,
                  posicionamento e execução.
                </p>
                <p>
                  Apoio em conceito, curadoria, operação, ativação de comunidade e
                  desdobramento de conteúdo antes, durante e depois do evento.
                </p>
                <p>
                  Ideal para marcas, protocolos, comunidades e projetos que querem
                  fazer algo relevante no mercado.
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19B5C9]">
                  Formato ideal de entrada
                </p>
                <p className="mt-3 text-sm leading-7 text-white/80">
                  Fala com a gente primeiro no WhatsApp. Assim entendemos o momento
                  do projeto sem te travar em um formulário cheio de infos que às
                  vezes você ainda nem tem.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#EC4899]">
              Como atuamos
            </p>
            <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Da ideia à experiência no ar
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Entramos onde fizer mais sentido: estratégia, execução, narrativa,
              ativação, cobertura e distribuição. O objetivo é fazer o evento
              acontecer bem e continuar gerando resultado depois.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-bold text-white">Conceito e formato</p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Ideia central, proposta do evento, experiência e narrativa da marca.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-bold text-white">Produção e operação</p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Organização prática, alinhamento com fornecedores e execução.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-bold text-white">Ativação e comunidade</p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Ações que conectam o público certo e geram participação real.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-lg font-bold text-white">Cobertura e conteúdo</p>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Registro estratégico para Instagram, LinkedIn, X, YouTube e desdobramentos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CASES */}
<section className="border-b border-white/10">
  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
    <div className="mb-8 max-w-3xl">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
        Cases em destaque
      </p>
      <h2 className="mt-3 text-3xl font-black text-white">
        Evento que já realizamos e que mostra o jeito da Agenda Crypto de criar experiências memoráveis.
      </h2>
      <p className="mt-3 text-white/62">
        Alguns exemplos de experiências que uniram comunidade, marca,
        estética e ecossistema.
      </p>
    </div>

    <div className="grid gap-8">
      <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[#2A2A2A]">
        <div className="grid gap-0 lg:grid-cols-[1fr_1fr]">

          {/* VIDEO */}
          <div className="relative min-h-[320px] border-b border-white/10 lg:border-b-0 lg:border-r overflow-hidden">
            
            <video
              src="/videos/devsonweelsvideo.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* overlay */}
            
          </div>

          {/* TEXTO */}
          <div className="p-8 md:p-10">
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

            <h3 className="text-3xl font-black text-white">
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
                A proposta foi levar devs blockchain em uma experiência dentro da
                roda-gigante do Rio, criando um encontro que uniu comunidade,
                contexto técnico e presença de mercado em um formato marcante.
              </p>

              <p>
                O evento reuniu devs, builders e jornalistas, além de contar com
                a presença da equipe da Polygon, que tirou dúvidas diretamente no
                local e palestrou durante a experiência.
              </p>
            </div>
          </div>

        </div>
      </article>
    </div>
  </div>
</section>
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="rounded-[36px] border border-[#FFD600]/20 bg-[#FFD600]/10 p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#FFD600]">
              Vamos conversar
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black text-white sm:text-4xl">
              Quer tirar um evento do papel, começe falando com a gente
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-8 text-white/80">
              O primeiro passo não precisa ser um formulário complexo. Chama no
              WhatsApp, conta o momento do projeto e entendemos juntos o melhor formato.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={`https://wa.me/5521981833526?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c] sm:w-auto"
              >
                Falar no WhatsApp
              </a>

              <a
                href="/divulgacao"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9] sm:w-auto"
              >
                Ver página de divulgação
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}