"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type EventData = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
};

type InteractionRow = {
  type: "save" | "rsvp_yes" | "rsvp_no";
  events: EventData | EventData[] | null;
};

export default function MinhaAgendaClient() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [saved, setSaved] = useState<EventData[]>([]);
  const [going, setGoing] = useState<EventData[]>([]);

  useEffect(() => {
    async function loadAgenda() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;

        if (!user) {
          setIsLogged(false);
          setLoading(false);
          return;
        }

        setIsLogged(true);

        const { data, error } = await supabase
          .from("event_interactions")
          .select(`
            type,
            events (
              id,
              title,
              slug,
              city
            )
          `)
          .eq("user_id", user.id)
          .in("type", ["save", "rsvp_yes"]);

        if (error) {
          console.error("Erro ao buscar agenda:", error);
          setLoading(false);
          return;
        }

        const rows = (data || []) as InteractionRow[];

        const normalizeEvent = (row: InteractionRow): EventData | null => {
          if (!row.events) return null;
          if (Array.isArray(row.events)) return row.events[0] || null;
          return row.events;
        };

        const savedEvents = rows
          .filter((row) => row.type === "save")
          .map(normalizeEvent)
          .filter(Boolean) as EventData[];

        const goingEvents = rows
          .filter((row) => row.type === "rsvp_yes")
          .map(normalizeEvent)
          .filter(Boolean) as EventData[];

        setSaved(savedEvents);
        setGoing(goingEvents);
      } catch (error) {
        console.error("Erro ao carregar minha agenda:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAgenda();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#212121] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">Carregando sua agenda...</div>
      </main>
    );
  }

  if (!isLogged) {
    return (
      <main className="min-h-screen bg-[#212121] px-6 py-10 text-white">
        <div className="mx-auto max-w-7xl">Você precisa estar logada.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#212121] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-black">Minha Agenda</h1>

        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-[#19B5C9]">Vou</h2>

          {going.length === 0 ? (
            <p className="text-white/60">
              Você ainda não marcou presença em nenhum evento.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {going.map((event) => (
                <Link
                  key={`going-${event.id}`}
                  href={`/agenda/${event.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#19B5C9]/30 hover:bg-[#19B5C9]/10"
                >
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {event.city || "Online"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-xl font-bold text-[#FFD600]">Salvos</h2>

          {saved.length === 0 ? (
            <p className="text-white/60">
              Você ainda não salvou nenhum evento.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {saved.map((event) => (
                <Link
                  key={`saved-${event.id}`}
                  href={`/agenda/${event.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10"
                >
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {event.city || "Online"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}