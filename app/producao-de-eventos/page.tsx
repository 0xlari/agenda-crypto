import EventSubmissionForm from "@/componentes/event-submission-form";

const whatsappMessage = encodeURIComponent(
  "Olá! Quero entender melhor como funciona o serviço de produção de eventos da Agenda Crypto."
);

export default function ProducaoDeEventosPage() {
  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#EC4899]">
              Produção de Eventos
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Da ideia à experiência: eventos com conceito, presença e execução
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
              A Agenda Crypto também atua na construção de experiências para marcas,
              comunidades e projetos que querem se conectar com o ecossistema de
              forma relevante, estratégica e memorável.
            </p>

            <div className="mt-10 grid gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold text-white">
                  O que fazemos
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Construímos eventos com visão de marca, comunidade e distribuição.
                  Pensamos conceito, posicionamento, experiência e desdobramento de
                  conteúdo para o evento existir antes, durante e depois.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold text-white">
                  Podemos apoiar em
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Conceito do evento",
                    "Curadoria",
                    "Divulgação",
                    "Cobertura",
                    "Experiência de marca",
                    "Conteúdo pós-evento",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#FFD600]/20 bg-[#FFD600]/8 p-6">
                <h2 className="text-xl font-bold text-white">
                  Quer conversar sobre um projeto?
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Se você já tem uma ideia, uma marca ou um evento para tirar do
                  papel, fale com a gente no WhatsApp.
                </p>

                <a
                  href={`https://wa.me/5521981833526?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                >
                  Falar sobre produção
                </a>
              </div>
            </div>
          </section>

          <section>
            <EventSubmissionForm
              defaultInterestType="event_production"
              title="Envie seu briefing inicial"
              subtitle="Conte um pouco sobre a ideia, evento ou necessidade da sua marca. Assim a conversa já começa com mais contexto."
            />
          </section>
        </div>
      </div>
    </main>
  );
}