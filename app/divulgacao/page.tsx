import EventSubmissionForm from "@/componentes/event-submission-form";

const whatsappMessage = encodeURIComponent(
  "Olá! Quero entender melhor os formatos de destaque, cobertura e divulgação da Agenda Crypto para o meu evento."
);

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#19B5C9]">
              Divulgação
            </p>

            <h1 className="mt-4 text-4xl font-black leading-tight md:text-6xl">
              Coloque seu evento no radar do ecossistema
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/65">
              Na Agenda Crypto, a listagem do seu evento na plataforma é gratuita.
              Se você quiser ir além da presença na agenda e ampliar alcance com
              destaque, conteúdo e cobertura, também temos formatos de divulgação.
            </p>

            <div className="mt-10 grid gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold text-white">
                  Listagem gratuita na plataforma
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Cadastre seu evento sem custo para entrar na Agenda Crypto e
                  aparecer para quem acompanha o mercado e busca as próximas datas
                  relevantes do ecossistema.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold text-white">
                  Pacote de divulgação e destaque
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Para eventos que querem mais alcance, criamos estratégias com
                  destaque na plataforma, material de divulgação antes, durante e
                  depois do evento, além de distribuição nos nossos canais.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {["Instagram", "LinkedIn", "X", "YouTube", "Newsletter"].map(
                    (item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white/75"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/8 p-6">
                <h2 className="text-xl font-bold text-white">
                  Quer falar direto com a gente?
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Se você já quer entender formatos, valores e possibilidades de
                  divulgação, fale com a gente no WhatsApp.
                </p>

                <a
                  href={`https://wa.me/5521981833526?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-[#19B5C9] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
                >
                  Falar sobre divulgação
                </a>
              </div>
            </div>
          </section>

          <section>
            <EventSubmissionForm
              defaultInterestType="free_listing"
              title="Cadastre seu evento gratuitamente"
              subtitle="Envie as informações do seu evento para entrar na Agenda Crypto. Se quiser entender melhor o pacote de divulgação, você também pode marcar isso no formulário."
            />
          </section>
        </div>
      </div>
    </main>
  );
}