import { getFeaturedEvents } from "@/lib/supabase/queries";

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

export default async function FeaturedEventsSection() {
  const events = await getFeaturedEvents();

  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-semibold mb-6">
          Destaques da semana
        </h2>

        {events.length === 0 ? (
          <p className="text-zinc-500">
            Nenhum evento em destaque no momento.
          </p>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl border border-zinc-800 p-6"
              >
                <span className="text-sm text-zinc-500">
                  {event.city || "Online"} • {formatEventDate(event.start_date)}
                </span>

                <h3 className="text-xl font-semibold mt-2 mb-2">
                  {event.title}
                </h3>

                <p className="text-zinc-400">
                  {event.short_description || "Sem descrição curta."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}