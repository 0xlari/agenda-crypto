import MinhaAgendaClient from "@/componentes/minha-agenda-client";
import PageTour from "@/componentes/onboarding/page-tour";

export default async function MinhaAgendaPage() {
  return (
    <>
      <PageTour
        pageId="minha-agenda"
        steps={[
          {
            title: "Sua rota pelo ecossistema",
            description:
              "Aqui ficam os eventos que você salvou ou marcou como “Vou”, organizados para acompanhar sua jornada pelo mercado cripto.",
          },
          {
            title: "Confirme presença e não perca a data",
            description:
              "Veja detalhes do evento, adicione ao Google Calendar e confirme presença quando chegar a hora de registrar sua participação.",
          },
          {
            title: "Colecione seus Agenda Pass",
            description:
              "Ao confirmar presença, você desbloqueia um Agenda Pass: um registro visual dos eventos que participou para guardar na sua trajetória.",
          },
        ]}
      />

      <MinhaAgendaClient />
    </>
  );
}