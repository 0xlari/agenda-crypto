import Link from "next/link";

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                Divulgação
              </span>
              <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Coloque seu evento na frente das pessoas certas
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
              A Agenda Crypto ajuda eventos, side events, meetups e iniciativas
              do ecossistema a ganharem visibilidade com contexto, curadoria e
              presença dentro do mercado.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin"
                className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
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
      </section>

      {/* O QUE FAZEMOS */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-black text-white">
              Como a Agenda Crypto pode ajudar
            </h2>
            <p className="mt-3 text-white/62">
              Mais do que listar eventos, a Agenda pode atuar como ponte entre
              sua iniciativa e o público certo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-[#19B5C9]/15" />
              <h3 className="text-xl font-black text-white">Inclusão na agenda</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Seu evento entra na vitrine da Agenda Crypto com contexto e visibilidade.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-[#FFD600]/15" />
              <h3 className="text-xl font-black text-white">Destaque editorial</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Alguns eventos podem receber posição de destaque dentro da curadoria.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-[#EC4899]/15" />
              <h3 className="text-xl font-black text-white">Distribuição</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Divulgação integrada aos canais e à narrativa da Agenda Crypto.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-6">
              <div className="mb-4 h-10 w-10 rounded-full bg-white/10" />
              <h3 className="text-xl font-black text-white">Posicionamento</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/62">
                Mais do que alcance, ajudamos o evento a se encaixar no contexto certo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-3xl font-black text-white">
                Para quem é
              </h2>
              <p className="mt-3 text-white/62">
                A divulgação pode funcionar para diferentes formatos e objetivos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Side events",
                "Meetups",
                "Conferências",
                "Ativações de marca",
                "Comunidades",
                "Projetos do ecossistema",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-[#2A2A2A] px-5 py-4 text-sm font-medium text-white/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-3xl font-black text-white">
              Como funciona
            </h2>
            <p className="mt-3 text-white/62">
              Um fluxo simples para colocar seu evento no radar.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              ["1", "Você envia", "Compartilha as informações principais do evento."],
              ["2", "A Agenda analisa", "Entendemos aderência, contexto e formato."],
              ["3", "Definimos a divulgação", "Escolhemos como o evento entra e ganha destaque."],
              ["4", "Publicação e visibilidade", "Seu evento passa a fazer parte da Agenda Crypto."],
            ].map(([step, title, text]) => (
              <div
                key={step}
                className="rounded-[28px] border border-white/10 bg-[#2A2A2A] p-6"
              >
                <span className="text-sm font-bold text-[#19B5C9]">{step}</span>
                <h3 className="mt-3 text-xl font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/62">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-14">
          <div className="rounded-[32px] border border-white/10 bg-[#2A2A2A] p-8 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
                Próximo passo
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white">
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