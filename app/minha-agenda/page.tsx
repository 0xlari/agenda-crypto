import MinhaAgendaClient from "@/componentes/minha-agenda-client";
import PageTour from "@/componentes/onboarding/page-tour";

export default async function MinhaAgendaPage() {
  return (
    <>
      <PageTour
        pageId="minha-agenda"
        steps={[
          {
            title: "Seus eventos salvos",
            description:
              'Aqui aparecem todos os eventos em que você clicou "Vou" na agenda. É a sua lista personalizada.',
          },
          {
            title: "Acompanhe as datas",
            description:
              "Consulte esta página para não perder nenhuma data. Você pode remover eventos a qualquer momento.",
          },
        ]}
      />
      <MinhaAgendaClient />
    </>
  );
}
