import Link from "next/link";
import PageTour from "@/componentes/onboarding/page-tour";

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      <PageTour
        pageId="divulgacao"
        steps={[
          {
            icon: "📣",
            title: "Divulgue seu evento",
            description:
              "Esta página explica como colocar seu evento na Agenda Crypto e os benefícios de estar aqui.",
          },
          {
            icon: "✏️",
            title: "Cadastro rápido",
            description:
              'Clique em "Divulgar evento" para preencher o formulário. Após a curadoria, seu evento aparece na agenda.',
          },
        ]}
      />
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-20">
          <div className="max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-3 sm:mb-5">
              <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                Divulgação
              </span>
              <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-4xl lg:text-6xl">
              Coloque seu evento na frente das pessoas certas
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/68 sm:mt-5 sm:text-lg">
              A Agenda Crypto ajuda eventos, side events, meetups e iniciativas
              do ecossistema a ganharem visibilidade com contexto, curadoria e
              presença dentro do mercado.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
              >
                Divulgar evento
              </Link>

              <Link
                href="/agenda"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
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
              Como a Agenda Crypto pode ajudar
            </h2>
            <p className="mt-3 text-white/62">
              Mais do que listar eventos, a Agenda pode atuar como ponte entre
              sua iniciativa e o público certo.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10 bg-[#19B5C9]/15" />
                <h3 className="text-lg font-black text-white sm:text-xl">Inclusão na agenda</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/62">
                Seu evento entra na vitrine da Agenda Crypto com contexto e visibilidade.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10 bg-[#FFD600]/15" />
                <h3 className="text-lg font-black text-white sm:text-xl">Destaque editorial</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/62">
                Alguns eventos podem receber posição de destaque dentro da curadoria.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10 bg-[#EC4899]/15" />
                <h3 className="text-lg font-black text-white sm:text-xl">Distribuição</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/62">
                Divulgação integrada aos canais e à narrativa da Agenda Crypto.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <div className="h-8 w-8 shrink-0 rounded-full sm:h-10 sm:w-10 bg-white/10" />
                <h3 className="text-lg font-black text-white sm:text-xl">Posicionamento</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/62">
                Mais do que alcance, ajudamos o evento a se encaixar no contexto certo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-black text-white sm:text-3xl">
                Para quem é
              </h2>
              <p className="mt-3 text-white/62">
                A divulgação pode funcionar para diferentes formatos e objetivos.
              </p>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:gap-4">
              {[
                { name: "Side events", hover: "hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]" },
                { name: "Meetups", hover: "hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10 hover:text-[#FFD600]" },
                { name: "Conferências", hover: "hover:border-[#EC4899]/30 hover:bg-[#EC4899]/10 hover:text-[#EC4899]" },
                { name: "Ativações de marca", hover: "hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]" },
                { name: "Comunidades", hover: "hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10 hover:text-[#FFD600]" },
                { name: "Projetos do ecossistema", hover: "hover:border-[#EC4899]/30 hover:bg-[#EC4899]/10 hover:text-[#EC4899]" },
              ].map(({ name, hover }) => (
                <div
                  key={name}
                  className={`cursor-default rounded-[16px] border border-white/10 bg-[#2A2A2A] px-4 py-3 text-xs font-medium text-white/80 transition duration-200 sm:rounded-[24px] sm:px-5 sm:py-4 sm:text-sm ${hover}`}
                >
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="mb-6 max-w-3xl sm:mb-8">
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-3 text-white/62">
              Um fluxo simples para colocar seu evento no radar.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 md:grid-cols-4">
            {[
              ["1", "Você envia", "Compartilha as informações principais do evento."],
              ["2", "A Agenda analisa", "Entendemos aderência, contexto e formato."],
              ["3", "Definimos a divulgação", "Escolhemos como o evento entra e ganha destaque."],
              ["4", "Publicação e visibilidade", "Seu evento passa a fazer parte da Agenda Crypto."],
            ].map(([step, title, text]) => (
              <div
                key={step}
                className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[28px] sm:p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-bold text-[#19B5C9]">{step}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/35">Etapa</span>
                </div>
                <h3 className="text-lg font-black text-white sm:text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/62">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <div className="rounded-[20px] border border-white/10 bg-[#2A2A2A] p-5 sm:rounded-[32px] sm:p-8 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
                Próximo passo
              </p>

              <h2 className="mt-2 text-2xl font-black leading-tight text-white sm:mt-3 sm:text-3xl">
                Quer colocar seu evento na Agenda Crypto?
              </h2>

              <p className="mt-3 text-white/62">
                Envie seu evento e veja como podemos ajudar na divulgação e no posicionamento.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ffe44c]"
                >
                  Divulgar evento
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