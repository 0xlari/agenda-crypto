import MinhaAgendaClient from "@/componentes/minha-agenda-client";
import PageTour from "@/componentes/onboarding/page-tour";

export default function MinhaAgendaPage() {
  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <PageTour
        pageId="minha-agenda"
        steps={[
          {
            icon: "📌",
            title: "Seus eventos salvos",
            description:
              'Aqui aparecem todos os eventos em que você clicou "Vou" na agenda. É a sua lista personalizada.',
          },
          {
            icon: "🔔",
            title: "Acompanhe as datas",
            description:
              "Consulte esta página para não perder nenhuma data. Você pode remover eventos a qualquer momento.",
          },
        ]}
      />
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-black">Minha Agenda</h1>
        <p className="mt-3 text-white/60">
          Veja os eventos que você marcou para acompanhar.
        </p>

        <MinhaAgendaClient />
      </div>
    </main>
  );
}