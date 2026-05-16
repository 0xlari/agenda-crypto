"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import EventResponse from "@/componentes/event-response";

type EventItem = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  city: string | null;
  country: string | null;
  venue: string | null;
  is_online: boolean | null;
  start_date: string;
  end_date: string | null;
  category: string | null;
  event_type: string | null;
  audience: string | null;
  tags: string[] | null;
  source_url: string | null;
  registration_url: string | null;
  featured: boolean | null;
  published: boolean | null;
  image_url?: string | null;
  event_time?: string | null;
};

type Suggestion = {
  label: string;
  value: string;
  type: "cidade" | "categoria" | "tag" | "evento" | "tipo";
};

function formatEventDate(dateString: string) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function formatEventTypeLabel(eventType: string | null) {
  if (!eventType) return null;

  const normalized = normalize(eventType);

  if (normalized === "side_event" || normalized === "side event") {
    return "Side Event";
  }

  if (normalized === "conference" || normalized === "conferencia") {
    return "Conference";
  }

  if (normalized === "meetup") {
    return "Meetup";
  }

  if (normalized === "main_event" || normalized === "main event") {
    return "Evento Principal";
  }

  if (normalized === "networking") {
    return "Networking";
  }

  if (normalized === "institucional") {
    return "Institucional";
  }

  if (normalized === "tecnico" || normalized === "técnico") {
    return "Técnico";
  }

  return eventType.replaceAll("_", " ");
}

export default function AgendaBrowser({
  events,
}: {
  events: EventItem[];
}) {
  useEffect(() => {
    fetch("/api/page-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: "agenda" }),
    });
  }, []);

  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const searchableBase = useMemo(() => {
    const suggestions: Suggestion[] = [];

    const cities = new Set<string>();
    const categories = new Set<string>();
    const tags = new Set<string>();
    const eventTypes = new Set<string>();

    events.forEach((event) => {
      if (event.city) cities.add(event.city);
      if (event.category) categories.add(event.category);
      if (event.event_type) eventTypes.add(event.event_type);
      event.tags?.forEach((tag) => tags.add(tag));

      suggestions.push({
        label: event.title,
        value: event.title,
        type: "evento",
      });
    });

    Array.from(cities).forEach((city) =>
      suggestions.push({
        label: city,
        value: city,
        type: "cidade",
      })
    );

    Array.from(categories).forEach((category) =>
      suggestions.push({
        label: category,
        value: category,
        type: "categoria",
      })
    );

    Array.from(eventTypes).forEach((eventType) =>
      suggestions.push({
        label: formatEventTypeLabel(eventType) || eventType,
        value: eventType,
        type: "tipo",
      })
    );

    Array.from(tags).forEach((tag) =>
      suggestions.push({
        label: tag,
        value: tag,
        type: "tag",
      })
    );

    const uniqueSuggestions = suggestions.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (s) =>
            normalize(s.value) === normalize(item.value) && s.type === item.type
        )
    );

    return uniqueSuggestions;
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return events;

    const q = normalize(query);

    return events.filter((event) => {
      const haystack = [
        event.title,
        event.short_description || "",
        event.description || "",
        event.city || "",
        event.country || "",
        event.venue || "",
        event.category || "",
        event.event_type || "",
        event.audience || "",
        ...(event.tags || []),
      ]
        .join(" ")
        .toLowerCase();

      return normalize(haystack).includes(q);
    });
  }, [events, query]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];

    const q = normalize(query);

    return searchableBase
      .filter((item) => normalize(item.value).includes(q))
      .slice(0, 8);
  }, [query, searchableBase]);

  function applyFilter(value: string) {
    setQuery(value);
    setIsFocused(false);
  }

  function clearFilter() {
    setQuery("");
    setIsFocused(false);
  }

  return (
    <>
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
            <div className="relative">
              <div className="flex items-center rounded-2xl border border-white/10 bg-[#2A2A2A] px-4 py-3">
                <span className="mr-3 text-white/35">⌕</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Buscar por local, tipo de evento ou tags..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />

                {query && (
                  <button
                    type="button"
                    onClick={clearFilter}
                    className="ml-3 text-sm text-white/45 transition hover:text-white"
                  >
                    limpar
                  </button>
                )}
              </div>

              {isFocused && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-white/10 bg-[#2A2A2A] shadow-2xl">
                  {suggestions.map((item) => (
                    <button
                      key={`${item.type}-${item.value}`}
                      type="button"
                      onMouseDown={() => applyFilter(item.value)}
                      className="flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition hover:bg-white/[0.04] last:border-b-0"
                    >
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="text-xs uppercase tracking-wide text-white/35">
                        {item.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {query && (
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-white/55">
                  Filtrando por:{" "}
                  <span className="font-semibold text-white">{query}</span>
                </p>

                <button
                  type="button"
                  onClick={clearFilter}
                  className="text-sm font-semibold text-[#19B5C9] transition hover:text-white"
                >
                  limpar filtro
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              {query ? `Resultados para "${query}"` : "Eventos em destaque"}
            </h2>
            <p className="mt-2 text-sm text-white/55">
              {query
                ? "Eventos encontrados a partir da sua busca."
                : "Uma curadoria viva dos eventos que merecem estar na sua agenda."}
            </p>
          </div>

          <div className="text-sm font-medium text-white/35">
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-16 text-center">
            <p className="text-white/65">
              Nenhum evento encontrado para essa busca.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => {
              const eventTypeLabel = formatEventTypeLabel(event.event_type);
              const normalizedType = normalize(event.event_type || "");

              const eventTypeClass =
                normalizedType === "side_event" || normalizedType === "side event"
                  ? "bg-black/70 text-[#FFD600]"
                  : normalizedType === "conference" || normalizedType === "conferencia"
                  ? "bg-black/70 text-[#19B5C9]"
                  : normalizedType === "meetup"
                  ? "bg-black/70 text-[#EC4899]"
                  : "bg-black/70 text-white";

              return (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-[30px] border border-white/10 bg-[#2A2A2A] transition duration-300 hover:-translate-y-1 hover:border-white/20"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-[linear-gradient(135deg,rgba(25,181,201,0.16),rgba(236,72,153,0.08),rgba(255,214,0,0.16))]">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        unoptimized
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center px-6 text-center">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/35">
                            Agenda Crypto
                          </p>
                          <h3 className="mt-3 text-xl font-black text-white">
                            {event.title}
                          </h3>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                      {eventTypeLabel && (
                        <button
                          type="button"
                          onClick={() => applyFilter(event.event_type!)}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur ${eventTypeClass}`}
                        >
                          {eventTypeLabel}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => applyFilter(event.city || "Online")}
                        className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur"
                      >
                        {event.city || "Online"}
                      </button>

                      {event.category && (
                        <button
                          type="button"
                          onClick={() => applyFilter(event.category!)}
                          className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#EC4899] backdrop-blur"
                        >
                          {event.category}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm font-medium text-[#19B5C9]">
                      {formatEventDate(event.start_date)}
                    </p>

                    {event.end_date && event.end_date !== event.start_date && (
                      <p className="text-sm text-white/40">
                        até {formatEventDate(event.end_date)}
                      </p>
                    )}

                    {event.event_time && (
                      <p className="mt-1 text-sm text-white/60">
                        {event.event_time}
                      </p>
                    )}

                    <h2 className="mt-2 text-2xl font-black leading-tight text-white">
                      {event.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/62">
                      {event.short_description || "Sem descrição curta."}
                    </p>

                    {event.tags && event.tags.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {event.tags.slice(0, 2).map((tagItem, index) => {
                          const styles = [
                            "border-[#19B5C9]/20 bg-[#19B5C9]/10 text-[#19B5C9]",
                            "border-[#EC4899]/20 bg-[#EC4899]/10 text-[#EC4899]",
                            "border-[#FFD600]/20 bg-[#FFD600]/10 text-[#FFD600]",
                            "border-white/10 bg-white/[0.04] text-white/70",
                          ];

                          return (
                            <button
                              key={tagItem}
                              type="button"
                              onClick={() => applyFilter(tagItem)}
                              className={`rounded-full border px-3 py-1 text-[11px] font-medium transition hover:opacity-90 ${styles[index % styles.length]}`}
                            >
                              {tagItem}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`/agenda/${event.slug}`}
                      className="shrink-0 rounded-full bg-white px-4 py-2.5 text-xs font-black text-black transition hover:scale-[1.02]"
                    >
                      Ver evento
                    </Link>

                    <div className="min-w-0 flex-1">
                      <EventResponse
                        eventId={event.id}
                        title={event.title}
                        startDate={event.start_date}
                        endDate={event.end_date}
                        eventTime={event.event_time}
                        city={event.city}
                        venue={event.venue}
                      />
                    </div>
                  </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}