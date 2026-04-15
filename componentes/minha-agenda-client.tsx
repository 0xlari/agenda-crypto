"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type EventData = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  venue?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  event_time?: string | null;
  description?: string | null;
  category?: string | null;
};

type InteractionRow = {
  type: "save" | "rsvp_yes" | "rsvp_no";
  events: EventData | EventData[] | null;
};

type RecommendedEvent = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  category?: string | null;
  event_type?: string | null;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDay(dateString?: string | null) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
  });
}

function getMonth(dateString?: string | null) {
  if (!dateString) return "";
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    month: "short",
  });
}

function toGoogleCalendarDate(date?: string | null, time?: string | null) {
  if (!date) return "";

  const safeTime = time && /^\d{2}:\d{2}$/.test(time) ? time : "09:00";
  const [hours, minutes] = safeTime.split(":");

  const localDate = new Date(
    Number(date.slice(0, 4)),
    Number(date.slice(5, 7)) - 1,
    Number(date.slice(8, 10)),
    Number(hours),
    Number(minutes)
  );

  const yyyy = localDate.getUTCFullYear();
  const mm = String(localDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(localDate.getUTCDate()).padStart(2, "0");
  const hh = String(localDate.getUTCHours()).padStart(2, "0");
  const min = String(localDate.getUTCMinutes()).padStart(2, "0");

  return `${yyyy}${mm}${dd}T${hh}${min}00Z`;
}

function buildGoogleCalendarUrl(event: EventData) {
  const start = toGoogleCalendarDate(event.start_date, event.event_time);
  const end = toGoogleCalendarDate(
    event.end_date || event.start_date,
    event.event_time || "10:00"
  );

  const details = encodeURIComponent(event.description || "");
  const location = encodeURIComponent(
    [event.venue, event.city].filter(Boolean).join(" - ")
  );
  const text = encodeURIComponent(event.title);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`;
}

export default function MinhaAgendaClient() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [saved, setSaved] = useState<EventData[]>([]);
  const [going, setGoing] = useState<EventData[]>([]);
  const [recommended, setRecommended] = useState<RecommendedEvent[]>([]);

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
              city,
              venue,
              start_date,
              end_date,
              event_time,
              description,
              category
            )
          `)
          .eq("user_id", user.id)
          .in("type", ["save", "rsvp_yes"]);

        if (error) {
          console.error("Erro ao buscar agenda:", error);
          setLoading(false);
          return;
        }

        const recommendationsResponse = await fetch("/api/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        });

        const recommendationsJson = await recommendationsResponse.json();

        if (recommendationsResponse.ok) {
          setRecommended(recommendationsJson.data || []);
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
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#19B5C9]">
              Sua agenda pessoal
            </p>
            <h1 className="mt-3 text-4xl font-black">Minha Agenda</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              Seus eventos salvos, presença confirmada e novas oportunidades para acompanhar o mercado.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Vou
              </p>
              <p className="mt-2 text-2xl font-black text-[#19B5C9]">
                {going.length}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-white/40">
                Salvos
              </p>
              <p className="mt-2 text-2xl font-black text-[#FFD600]">
                {saved.length}
              </p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <div className="rounded-[32px] border border-white/10 bg-[#2A2A2A] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#EC4899]">
              Recomendados pra você
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              Descobertas com base no seu comportamento
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Eventos futuros relacionados aos temas, formatos e cidades com os quais você mais interage.
            </p>

            {recommended.length === 0 ? (
              <p className="mt-6 text-white/60">
                Conforme você interagir mais com eventos, vamos recomendar melhores opções aqui.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {recommended.map((event) => (
                  <Link
                    key={`recommended-${event.id}`}
                    href={`/agenda/${event.slug}`}
                    className="rounded-[24px] border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#EC4899]/30 hover:bg-[#EC4899]/10"
                  >
                    <div className="mb-2 flex flex-wrap gap-2">
                      {event.category && (
                        <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                          {event.category}
                        </span>
                      )}

                      {event.event_type && (
                        <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#FFD600]">
                          {event.event_type}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-white">
                      {event.title}
                    </h3>

                    <p className="mt-2 text-sm text-white/60">
                      {event.city || "Online"}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#19B5C9]">
              Presença confirmada
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Eventos que você confirmou presença
            </h2>
          </div>

          {going.length === 0 ? (
            <p className="text-white/60">
              Você ainda não marcou presença em nenhum evento.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
  {going.map((event) => (
    <div
      key={`going-${event.id}`}
      className="rounded-[24px] border border-white/10 bg-[#2A2A2A] px-4 py-4 md:px-5 "
    >
      <div className="grid gap-4 md:grid-cols-[90px_1fr_auto] md:items-center ">
        <div className="flex h-[84px] flex-col items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,rgba(25,181,201,0.16),rgba(236,72,153,0.08),rgba(255,214,0,0.14))]">
          <p className="text-2xl font-black text-white">
            {getDay(event.start_date)}
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {getMonth(event.start_date)}
          </p>
        </div>

        <div>
          <div className="mb-2 flex flex-wrap gap-2">
            {event.category && (
              <span className="rounded-full border border-[#19B5C9]/20 bg-[#19B5C9]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#19B5C9]">
                {event.category}
              </span>
            )}

            {event.city && (
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/70">
                {event.city}
              </span>
            )}

            {event.event_time && (
              <span className="rounded-full border border-[#FFD600]/20 bg-[#FFD600]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#FFD600]">
                {event.event_time}
              </span>
            )}
          </div>

          <h3 className="text-lg font-black text-white">
            {event.title}
          </h3>

          <div className="mt-2 text-sm text-white/60">
            {event.start_date && (
              <p>
                {formatDate(event.start_date)}
                {event.end_date && event.end_date !== event.start_date
                  ? ` até ${formatDate(event.end_date)}`
                  : ""}
              </p>
            )}

            {event.venue && <p>{event.venue}</p>}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:min-w-[210px]">
          <Link
            href={`/agenda/${event.slug}`}
            className="inline-flex items-center justify-center rounded-full bg-[#19B5C9] px-4 py-2.5 text-sm font-bold text-black transition hover:scale-[1.01]"
          >
            Ver evento
          </Link>

          <a
            href={buildGoogleCalendarUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10 hover:text-[#FFD600]"
          >
            Google Calendar
          </a>
        </div>
      </div>
    </div>
  ))}
</div>
            </div>
          )}
        </section>

        <section>
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#FFD600]">
              Interesse salvo
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Salvos
            </h2>
          </div>

          {saved.length === 0 ? (
            <p className="text-white/60">
              Você ainda não salvou nenhum evento.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {saved.map((event) => (
                <Link
                  key={`saved-${event.id}`}
                  href={`/agenda/${event.slug}`}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#FFD600]/30 hover:bg-[#FFD600]/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {event.title}
                      </h3>
                      <p className="mt-2 text-sm text-white/60">
                        {event.city || "Online"}
                      </p>
                    </div>

                    {event.start_date && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
                        <p className="text-lg font-black text-[#FFD600]">
                          {getDay(event.start_date)}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
                          {getMonth(event.start_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}