"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import EventResponse from "@/componentes/event-response";
import CountryExplorer, {
  type CountryStat,
} from "@/componentes/agenda/country-explorer";
import {
  ONLINE_COUNTRY,
  UNKNOWN_COUNTRY,
  normalizeText as normalize,
  resolveEventCountry as resolveLocationCountry,
  type ResolvedCountry,
} from "@/lib/event-country";
import {
  getDictionary,
  localizeCountryName,
  type Locale,
} from "@/lib/i18n";

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
  lat?: number | string | null;
  lng?: number | string | null;
};

type Suggestion = {
  label: string;
  value: string;
  type: "city" | "category" | "tag" | "event" | "type" | "country";
  countryKey?: string;
};

type AgendaBrowserCopy = ReturnType<typeof getDictionary>["agendaBrowser"];

function formatEventDate(dateString: string, locale: Locale) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString(
    locale === "es" ? "es-419" : "pt-BR",
    {
      day: "2-digit",
      month: "short",
    }
  );
}

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveEventCountry(event: EventItem) {
  return resolveLocationCountry({
    city: event.city,
    country: event.country,
    isOnline: event.is_online,
  });
}

function formatEventTypeLabel(eventType: string | null, copy: AgendaBrowserCopy) {
  if (!eventType) return null;

  const normalized = normalize(eventType);

  if (normalized === "side_event" || normalized === "side event") {
    return copy.eventTypes.sideEvent;
  }

  if (normalized === "conference" || normalized === "conferencia") {
    return copy.eventTypes.conference;
  }

  if (normalized === "meetup") return copy.eventTypes.meetup;

  if (normalized === "main_event" || normalized === "main event") {
    return copy.eventTypes.mainEvent;
  }

  if (normalized === "networking") return copy.eventTypes.networking;
  if (normalized === "institucional") return copy.eventTypes.institutional;
  if (normalized === "tecnico" || normalized === "technical") return copy.eventTypes.technical;
  if (normalized === "community") return copy.eventTypes.community;
  if (normalized === "business") return copy.eventTypes.business;

  return eventType.replaceAll("_", " ");
}

function EventCard({
  event,
  country,
  onCountrySelect,
  onTextFilter,
  locale,
  copy,
}: {
  event: EventItem;
  country: ResolvedCountry;
  onCountrySelect: (countryKey: string) => void;
  onTextFilter: (value: string) => void;
  locale: Locale;
  copy: AgendaBrowserCopy;
}) {
  const shouldReduceMotion = useReducedMotion();
  const eventTypeLabel = formatEventTypeLabel(event.event_type, copy);
  const normalizedType = normalize(event.event_type || "");
  const eventTypeClass =
    normalizedType === "side_event" || normalizedType === "side event"
      ? "bg-black/75 text-[#FFD600]"
      : normalizedType === "conference" || normalizedType === "conferencia"
        ? "bg-black/75 text-[#19B5C9]"
        : normalizedType === "meetup" || normalizedType === "community"
          ? "bg-black/75 text-[#EC4899]"
          : "bg-black/75 text-white";

  const locationLabel = event.city || country.name;

  return (
    <motion.article
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
      className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-white/10 bg-[#292929] shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition duration-300 hover:border-[#19B5C9]/30 hover:shadow-[0_22px_60px_rgba(0,0,0,0.24)]"
    >
      <div className="relative h-56 w-full overflow-hidden bg-[linear-gradient(135deg,rgba(25,181,201,0.16),rgba(236,72,153,0.08),rgba(255,214,0,0.16))]">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            unoptimized
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {eventTypeLabel && (
            <button
              type="button"
              onClick={() => onTextFilter(event.event_type!)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur-md transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${eventTypeClass}`}
            >
              {eventTypeLabel}
            </button>
          )}

          {event.category && (
            <button
              type="button"
              onClick={() => onTextFilter(event.category!)}
              className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#EC4899] backdrop-blur-md transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC4899]"
            >
              {event.category}
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onCountrySelect(country.key)}
          aria-label={`${copy.card.viewEventsIn} ${country.name}`}
          className="absolute bottom-4 left-4 right-4 flex w-[calc(100%-2rem)] items-center gap-2 rounded-2xl border border-white/10 bg-black/65 px-3.5 py-2.5 text-left text-xs font-semibold text-white backdrop-blur-md transition hover:border-[#19B5C9]/40 hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#19B5C9]"
          >
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="truncate">{locationLabel}</span>
          {locationLabel !== country.name && (
            <>
              <span className="text-white/25">/</span>
              <span className="truncate text-white/55">{country.name}</span>
            </>
          )}
          <span className="ml-auto text-[#19B5C9]">→</span>
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="text-sm font-bold text-[#19B5C9]">
            {formatEventDate(event.start_date, locale)}
          </p>

          {event.end_date && event.end_date !== event.start_date && (
            <p className="text-sm text-white/40">
              {copy.card.until} {formatEventDate(event.end_date, locale)}
            </p>
          )}

          {event.event_time && (
            <p className="ml-auto rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-semibold text-white/60">
              {event.event_time}
            </p>
          )}
        </div>

        <h3 className="mt-3 text-2xl font-black leading-tight text-white">
          {event.title}
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
          {event.short_description || copy.card.fallbackDescription}
        </p>

        {event.tags && event.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {event.tags.slice(0, 2).map((tagItem, index) => {
              const styles = [
                "border-[#19B5C9]/20 bg-[#19B5C9]/10 text-[#67D8E6]",
                "border-[#EC4899]/20 bg-[#EC4899]/10 text-[#F187BC]",
                "border-[#FFD600]/20 bg-[#FFD600]/10 text-[#FFE766]",
              ];

              return (
                <button
                  key={tagItem}
                  type="button"
                  onClick={() => onTextFilter(tagItem)}
                  className={`rounded-full border px-3 py-1 text-[11px] font-medium transition hover:brightness-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${styles[index % styles.length]}`}
                >
                  {tagItem}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-auto space-y-3 pt-6">
          <Link
            href={`/agenda/${event.slug}`}
            className="flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-center text-sm font-black text-black transition hover:scale-[1.01] hover:bg-[#F3F3F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9]"
          >
            <span>{copy.card.viewEvent}</span>
            <span className="text-xl leading-none">→</span>
          </Link>

          <EventResponse
            eventId={event.id}
            title={event.title}
            startDate={event.start_date}
            endDate={event.end_date}
            eventTime={event.event_time}
            city={event.city}
            venue={event.venue}
            locale={locale}
          />
        </div>
      </div>
    </motion.article>
  );
}

export default function AgendaBrowser({
  events,
  locale = "pt",
}: {
  events: EventItem[];
  locale?: Locale;
}) {
  const copy = getDictionary(locale).agendaBrowser;
  useEffect(() => {
    fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "agenda" }),
    });
  }, []);

  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const eventCountries = useMemo(() => {
    return new Map(events.map((event) => [event.id, resolveEventCountry(event)]));
  }, [events]);

  const countryStats = useMemo(() => {
    type CountryAccumulator = CountryStat & {
      coordinateCount: number;
      latTotal: number;
      lngTotal: number;
    };

    const stats = new Map<string, CountryAccumulator>();

    events.forEach((event) => {
      const country = eventCountries.get(event.id) || UNKNOWN_COUNTRY;
      const current = stats.get(country.key) || {
        key: country.key,
        name: localizeCountryName(country, locale),
        count: 0,
        lat: country.lat,
        lng: country.lng,
        coordinateCount: 0,
        latTotal: 0,
        lngTotal: 0,
      };

      current.count += 1;

      const lat = toNumber(event.lat);
      const lng = toNumber(event.lng);

      if (
        lat !== null &&
        lng !== null &&
        lat >= -60 &&
        lat <= 35 &&
        lng >= -120 &&
        lng <= -30
      ) {
        current.coordinateCount += 1;
        current.latTotal += lat;
        current.lngTotal += lng;
      }

      stats.set(country.key, current);
    });

    return Array.from(stats.values())
      .map((country) => ({
        key: country.key,
        name: localizeCountryName(country, locale),
        count: country.count,
        lat:
          country.coordinateCount > 0
            ? country.latTotal / country.coordinateCount
            : country.lat,
        lng:
          country.coordinateCount > 0
            ? country.lngTotal / country.coordinateCount
            : country.lng,
      }))
      .sort((a, b) => {
        if (a.key === ONLINE_COUNTRY.key) return 1;
        if (b.key === ONLINE_COUNTRY.key) return -1;
        return b.count - a.count || a.name.localeCompare(b.name, locale === "es" ? "es" : "pt-BR");
      });
  }, [eventCountries, events, locale]);

  const searchableBase = useMemo(() => {
    const suggestions: Suggestion[] = countryStats.map((country) => ({
      label: country.name,
      value: country.name,
      type: "country",
      countryKey: country.key,
    }));

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
        type: "event",
      });
    });

    cities.forEach((city) =>
      suggestions.push({ label: city, value: city, type: "city" })
    );
    categories.forEach((category) =>
      suggestions.push({
        label: category,
        value: category,
        type: "category",
      })
    );
    eventTypes.forEach((eventType) =>
      suggestions.push({
        label: formatEventTypeLabel(eventType, copy) || eventType,
        value: eventType,
        type: "type",
      })
    );
    tags.forEach((tag) =>
      suggestions.push({ label: tag, value: tag, type: "tag" })
    );

    return suggestions.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (candidate) =>
            normalize(candidate.value) === normalize(item.value) &&
            candidate.type === item.type
        )
    );
  }, [countryStats, events, copy]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalize(query);

    return events.filter((event) => {
      const country = eventCountries.get(event.id) || UNKNOWN_COUNTRY;

      if (selectedCountry && country.key !== selectedCountry) return false;
      if (!normalizedQuery) return true;

      const haystack = [
        event.title,
        event.short_description || "",
        event.description || "",
        event.city || "",
        event.country || "",
        country.name,
        event.venue || "",
        event.category || "",
        event.event_type || "",
        event.audience || "",
        ...(event.tags || []),
      ].join(" ");

      return normalize(haystack).includes(normalizedQuery);
    });
  }, [eventCountries, events, query, selectedCountry]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const normalizedQuery = normalize(query);

    return searchableBase
      .filter((item) => normalize(item.value).includes(normalizedQuery))
      .slice(0, 8);
  }, [query, searchableBase]);

  const activeCountry = countryStats.find(
    (country) => country.key === selectedCountry
  );

  function applyTextFilter(value: string) {
    setQuery(value);
    setIsFocused(false);
    setActiveSuggestionIndex(-1);
  }

  function applySuggestion(suggestion: Suggestion) {
    if (suggestion.countryKey) {
      setSelectedCountry(suggestion.countryKey);
      setQuery("");
    } else {
      setQuery(suggestion.value);
    }

    setIsFocused(false);
    setActiveSuggestionIndex(-1);
  }

  function selectCountry(countryKey: string | null) {
    setSelectedCountry(countryKey);
    setIsFocused(false);
    setActiveSuggestionIndex(-1);
  }

  function clearAllFilters() {
    setQuery("");
    setSelectedCountry(null);
    setIsFocused(false);
    setActiveSuggestionIndex(-1);
  }

  const resultsTitle = activeCountry
    ? query
      ? `${activeCountry.name}: “${query}”`
      : `${copy.results.eventsIn} ${activeCountry.name}`
    : query
      ? `${copy.results.resultsFor} “${query}”`
      : copy.results.upcoming;

  return (
    <>
      <CountryExplorer
        countries={countryStats}
        selectedCountry={selectedCountry}
        totalEvents={events.length}
        onSelect={selectCountry}
        locale={locale}
      />

      <section id="agenda-filters" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-[0.42fr_1fr] md:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#FFD600]">
                  {copy.filters.refineTitle}
                </p>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  {copy.filters.refineDescription}
                </p>
              </div>

              <div
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsFocused(false);
                  }
                }}
              >
                <div className="flex min-h-[54px] items-center rounded-2xl border border-white/10 bg-[#202020] px-4 transition focus-within:border-[#19B5C9]/50 focus-within:ring-4 focus-within:ring-[#19B5C9]/5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                    className="mr-3 h-5 w-5 shrink-0 text-white/35"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-3.2-3.2" />
                  </svg>
                  <input
                    type="search"
                    role="combobox"
                    aria-expanded={isFocused && suggestions.length > 0}
                    aria-controls="agenda-search-suggestions"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      activeSuggestionIndex >= 0
                        ? `agenda-suggestion-${activeSuggestionIndex}`
                        : undefined
                    }
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveSuggestionIndex(-1);
                    }}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" && suggestions.length > 0) {
                        event.preventDefault();
                        setActiveSuggestionIndex((current) =>
                          Math.min(current + 1, suggestions.length - 1)
                        );
                      }

                      if (event.key === "ArrowUp" && suggestions.length > 0) {
                        event.preventDefault();
                        setActiveSuggestionIndex((current) =>
                          Math.max(current - 1, 0)
                        );
                      }

                      if (
                        event.key === "Enter" &&
                        activeSuggestionIndex >= 0 &&
                        suggestions[activeSuggestionIndex]
                      ) {
                        event.preventDefault();
                        applySuggestion(suggestions[activeSuggestionIndex]);
                      }

                      if (event.key === "Escape") {
                        setIsFocused(false);
                        setActiveSuggestionIndex(-1);
                      }
                    }}
                    placeholder={copy.filters.placeholder}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />

                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="ml-3 rounded-full px-2 py-1 text-xs font-bold text-white/40 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9]"
                    >
                      {copy.filters.clear}
                    </button>
                  )}
                </div>

                {isFocused && suggestions.length > 0 && (
                  <div
                    id="agenda-search-suggestions"
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-[min(24rem,60vh)] overflow-y-auto rounded-2xl border border-white/10 bg-[#292929] shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
                  >
                    {suggestions.map((item, index) => (
                      <button
                        key={`${item.type}-${item.value}`}
                        id={`agenda-suggestion-${index}`}
                        type="button"
                        role="option"
                        aria-selected={activeSuggestionIndex === index}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onClick={() => applySuggestion(item)}
                        className={`flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition focus:outline-none last:border-b-0 ${
                          activeSuggestionIndex === index
                            ? "bg-white/[0.07]"
                            : "hover:bg-white/[0.05]"
                        }`}
                      >
                        <span className="truncate text-sm font-medium text-white">
                          {item.label}
                        </span>
                        <span className="ml-4 shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">
                          {copy.suggestions[item.type]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {(activeCountry || query) && (
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
                <span className="mr-1 text-xs font-medium text-white/35">
                  {copy.filters.activeFilters}
                </span>

                {activeCountry && (
                  <button
                    type="button"
                    onClick={() => setSelectedCountry(null)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#FFD600]/25 bg-[#FFD600]/10 px-3 py-1.5 text-xs font-bold text-[#FFE766] transition hover:bg-[#FFD600]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD600]"
                    aria-label={`${copy.filters.removeFilter} ${activeCountry.name}`}
                  >
                    {activeCountry.name}
                    <span aria-hidden="true">×</span>
                  </button>
                )}

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-2 rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-3 py-1.5 text-xs font-bold text-[#67D8E6] transition hover:bg-[#19B5C9]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9]"
                    aria-label={`${copy.filters.removeSearch} ${query}`}
                  >
                    {query}
                    <span aria-hidden="true">×</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="ml-auto text-xs font-bold text-white/40 transition hover:text-white focus-visible:outline-none focus-visible:text-white"
                >
                  {copy.filters.clearAll}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#EC4899]">
              {copy.results.chronological}
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              {resultsTitle}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              {activeCountry
                ? `${copy.results.selectionIn} ${activeCountry.name}.`
                : copy.results.defaultDescription}
            </p>
          </div>

          <div
            data-testid="agenda-results-count"
            aria-live="polite"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-bold text-white/55"
          >
            <span className="h-2 w-2 rounded-full bg-[#19B5C9]" />
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1
              ? copy.results.eventSingular
              : copy.results.eventPlural}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-white/15 bg-[linear-gradient(135deg,rgba(25,181,201,0.06),rgba(255,255,255,0.02),rgba(236,72,153,0.06))] px-6 py-16 text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#19B5C9]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
                className="h-7 w-7"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
              </svg>
            </div>
            <h3 className="mt-5 text-xl font-black text-white">
              {copy.results.emptyTitle}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/50">
              {copy.results.emptyDescription}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-6 rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-black text-black transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {copy.results.showAll}
            </button>
          </div>
        ) : (
          <div
            data-testid="agenda-results-grid"
            className="grid items-stretch gap-7 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  country={eventCountries.get(event.id) || UNKNOWN_COUNTRY}
                  onCountrySelect={selectCountry}
                  onTextFilter={applyTextFilter}
                  locale={locale}
                  copy={copy}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </>
  );
}
