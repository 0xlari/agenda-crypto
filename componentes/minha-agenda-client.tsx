"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  city: string | null;
  start_date: string;
  short_description: string | null;
};

type ResponseItem = {
  event_id: string;
  response: "going" | "not_going";
};

function formatEventDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function MinhaAgendaClient() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [filter, setFilter] = useState<"going" | "not_going">("going");

  useEffect(() => {
    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: responses } = await supabase
        .from("event_responses")
        .select("event_id,response")
        .eq("user_id", user.id)
        .eq("response", filter);

      const typedResponses = (responses || []) as ResponseItem[];

      if (typedResponses.length === 0) {
        setEvents([]);
        setLoading(false);
        return;
      }

      const eventIds = typedResponses.map((item) => item.event_id);

      const { data: eventsData } = await supabase
        .from("events")
        .select("id,title,slug,city,start_date,short_description")
        .in("id", eventIds)
        .eq("published", true)
        .order("start_date", { ascending: true });

      setEvents((eventsData || []) as EventItem[]);
      setLoading(false);
    }

    loadData();
  }, [filter]);

  if (loading) {
    return <p className="mt-8 text-white/60">Carregando sua agenda...</p>;
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setFilter("going")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            filter === "going"
              ? "bg-[#19B5C9] text-black"
              : "border border-white/10 bg-white/[0.04] text-white/70"
          }`}
        >
          Vou
        </button>

        <button
          onClick={() => setFilter("not_going")}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            filter === "not_going"
              ? "bg-[#EC4899] text-white"
              : "border border-white/10 bg-white/[0.04] text-white/70"
          }`}
        >
          Não vou
        </button>
      </div>

      {events.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-white/60">Nenhum evento marcado nessa categoria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <p className="text-sm font-medium text-[#19B5C9]">
                {formatEventDate(event.start_date)}
              </p>

              <h2 className="mt-2 text-2xl font-black">{event.title}</h2>

              <p className="mt-2 text-white/60">
                {event.city || "Online"}
              </p>

              <p className="mt-3 text-white/60">
                {event.short_description || "Sem descrição curta."}
              </p>

              <Link
                href={`/agenda/${event.slug}`}
                className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-black"
              >
                Ver evento
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}