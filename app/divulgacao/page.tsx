import EventSubmissionForm from "@/componentes/event-submission-form";
import PageTour from "@/componentes/onboarding/page-tour";

const whatsappMessage = encodeURIComponent(
  "Olá! Quero entender melhor os formatos de destaque, cobertura e divulgação da Agenda Crypto para o meu evento."
);

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-[#212121] px-3 py-10 text-white sm:px-6 sm:py-16">
      <PageTour
        pageId="divulgacao"
        steps={[
          {
            title: "Coloque seu evento no radar",
            description:
              "Preencha o formulário para enviar seu evento para a curadoria da Agenda Crypto e aparecer para quem acompanha o ecossistema de perto.",
          },
          {
            title: "Escolha como quer divulgar",
            description:
              "Você pode cadastrar seu evento gratuitamente ou sinalizar interesse em formatos de destaque, conteúdo, cobertura e distribuição.",
          },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#19B5C9] sm:text-xs sm:tracking-[0.3em]">
              Divulgação
            </p>

            <h1 className="mt-4 text-2xl font-black leading-tight sm:text-4xl md:text-6xl">
             Coloque seu evento no radar de quem acompanha o mercado cripto de perto.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:mt-6 sm:text-base">
              Na Agenda Crypto, a listagem do seu evento na plataforma é gratuita. 
              Se você quiser ampliar o alcance com destaque, conteúdo e cobertura, 
              também temos formatos de divulgação.
            </p>

            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition sm:p-6 hover:border-[#19B5C9]/35 hover:bg-[#19B5C9]/8">
                <h2 className="text-lg font-bold text-white sm:text-xl">
                  Cadastre seu evento gratuitamente
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/65">
                  Envie as informações do seu evento para entrar na curadoria da Agenda Crypto. 
                  Se quiser entender melhor o pacote de divulgação, sinalize isso no formulário.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 transition sm:p-6 hover:border-[#FFD600]/35 hover:bg-[#FFD600]/8">
                <h2 className="text-lg font-bold text-white sm:text-xl">
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
                        className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-white/75 transition hover:border-[#EC4899]/35 hover:bg-[#EC4899]/10 hover:text-[#F8A9CF] sm:text-xs"
                      >
                        {item}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/8 p-5 transition sm:p-6 hover:border-[#19B5C9]/45 hover:bg-[#19B5C9]/15">
                <h2 className="text-lg font-bold text-white sm:text-xl">
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
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#19B5C9] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#21c9df] sm:w-auto"
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