import MinhaAgendaClient from "@/componentes/minha-agenda-client";

export default function MinhaAgendaPage() {
  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
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