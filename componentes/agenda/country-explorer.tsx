"use client";

import { getDictionary, type Locale } from "@/lib/i18n";

export type CountryStat = {
  key: string;
  name: string;
  count: number;
  lat: number | null;
  lng: number | null;
};

type CountryExplorerProps = {
  countries: CountryStat[];
  selectedCountry: string | null;
  totalEvents: number;
  locale?: Locale;
  onSelect: (countryKey: string | null) => void;
};

const LATAM_BOUNDS = {
  minLat: -56.5,
  maxLat: 32.8,
  minLng: -117.5,
  maxLng: -34,
};

const MAP_SIZE = {
  width: 720,
  height: 560,
};

const SOUTH_AMERICA_OUTLINE: [number, number][] = [
  [-79.8, 12.4],
  [-74.2, 11.4],
  [-68.8, 9.2],
  [-63.2, 7.6],
  [-58.1, 5.2],
  [-52.4, 4.1],
  [-46.7, 1.2],
  [-41.5, -2.6],
  [-36.2, -7.4],
  [-35.2, -11.8],
  [-38.4, -16.2],
  [-40.4, -20.5],
  [-44.0, -23.4],
  [-47.6, -25.8],
  [-49.9, -29.6],
  [-51.6, -34.0],
  [-54.2, -38.8],
  [-58.1, -43.2],
  [-62.6, -48.0],
  [-66.2, -53.4],
  [-70.3, -55.6],
  [-72.9, -51.0],
  [-71.6, -45.2],
  [-72.1, -39.6],
  [-70.2, -34.2],
  [-70.8, -28.0],
  [-68.7, -22.5],
  [-69.8, -17.1],
  [-73.4, -12.7],
  [-76.8, -7.0],
  [-80.4, -1.1],
  [-78.2, 4.4],
  [-81.2, 8.6],
  [-79.8, 12.4],
];

const MESOAMERICA_OUTLINE: [number, number][] = [
  [-117.0, 32.2],
  [-110.6, 31.2],
  [-105.5, 27.8],
  [-101.4, 24.2],
  [-97.0, 21.1],
  [-92.3, 18.7],
  [-88.4, 16.6],
  [-84.9, 12.9],
  [-80.6, 9.4],
  [-77.2, 8.4],
  [-76.2, 10.6],
  [-80.2, 12.2],
  [-84.8, 14.5],
  [-88.2, 16.8],
  [-92.4, 17.9],
  [-96.5, 19.8],
  [-100.3, 22.6],
  [-104.5, 25.0],
  [-109.5, 27.7],
  [-114.0, 30.4],
  [-117.0, 32.2],
];

function projectGeoPoint([lng, lat]: [number, number]) {
  const { minLat, maxLat, minLng, maxLng } = LATAM_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * MAP_SIZE.width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * MAP_SIZE.height;

  return { x, y };
}

function geoPath(points: [number, number][]) {
  return points
    .map((point, index) => {
      const { x, y } = projectGeoPoint(point);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function toMapPosition(country: CountryStat) {
  if (country.lat === null || country.lng === null) return null;

  const { minLat, maxLat, minLng, maxLng } = LATAM_BOUNDS;

  if (
    country.lat < minLat ||
    country.lat > maxLat ||
    country.lng < minLng ||
    country.lng > maxLng
  ) {
    return null;
  }

  const rawX = ((country.lng - minLng) / (maxLng - minLng)) * 100;
  const rawY = ((maxLat - country.lat) / (maxLat - minLat)) * 100;

  return {
    x: Math.min(94, Math.max(6, rawX)),
    y: Math.min(92, Math.max(8, rawY)),
  };
}

type CountryExplorerCopy = ReturnType<typeof getDictionary>["countryExplorer"];

function eventLabel(count: number, copy: CountryExplorerCopy) {
  return `${count} ${count === 1 ? copy.eventSingular : copy.eventPlural}`;
}

export default function CountryExplorer({
  countries,
  selectedCountry,
  totalEvents,
  locale = "pt",
  onSelect,
}: CountryExplorerProps) {
  const copy = getDictionary(locale).countryExplorer;
  const mappedCountries = countries
    .map((country) => ({ country, position: toMapPosition(country) }))
    .filter(
      (
        item
      ): item is {
        country: CountryStat;
        position: { x: number; y: number };
      } => item.position !== null
    );

  return (
    <section className="border-b border-white/10 bg-[#1C1C1C]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(25,181,201,0.08),rgba(255,255,255,0.025)_45%,rgba(236,72,153,0.08))] shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
          <div className="grid lg:grid-cols-[0.88fr_1.12fr]">
            <div className="relative z-10 p-5 sm:p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#67D8E6]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#19B5C9] shadow-[0_0_12px_rgba(25,181,201,0.9)]" />
                {copy.eyebrow}
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {copy.title}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                {copy.description}
              </p>

              <div
                className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:max-h-[280px] lg:grid-cols-2 lg:overflow-y-auto lg:pr-2"
                aria-label={copy.ariaLabel}
              >
                <button
                  type="button"
                  data-testid="country-filter-all"
                  aria-pressed={selectedCountry === null}
                  onClick={() => onSelect(null)}
                  className={`group col-span-2 flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9] sm:col-span-1 lg:col-span-2 ${
                    selectedCountry === null
                      ? "border-[#19B5C9]/60 bg-[#19B5C9] text-black shadow-[0_10px_30px_rgba(25,181,201,0.2)]"
                      : "border-white/10 bg-black/20 text-white hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  <span className="text-sm font-extrabold">{copy.allCountries}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-black ${
                      selectedCountry === null
                        ? "bg-black/10 text-black"
                        : "bg-white/8 text-white/55"
                    }`}
                  >
                    {totalEvents}
                  </span>
                </button>

                {countries.map((country) => {
                  const active = selectedCountry === country.key;

                  return (
                    <button
                      key={country.key}
                      type="button"
                      data-testid={`country-filter-${country.key}`}
                      aria-pressed={active}
                      aria-label={`${copy.filterBy} ${country.name}: ${eventLabel(
                        country.count,
                        copy
                      )}`}
                      onClick={() => onSelect(country.key)}
                      className={`flex min-w-0 items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19B5C9] ${
                        active
                          ? "border-[#FFD600]/60 bg-[#FFD600] text-black shadow-[0_10px_30px_rgba(255,214,0,0.15)]"
                          : "border-white/10 bg-black/20 text-white hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"
                      }`}
                    >
                      <span className="truncate text-sm font-bold">
                        {country.name}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black ${
                          active
                            ? "bg-black/10 text-black"
                            : "bg-white/8 text-white/50"
                        }`}
                      >
                        {country.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative hidden min-h-[440px] overflow-hidden border-l border-white/10 bg-[#151515] lg:block">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_46%,rgba(25,181,201,0.16),transparent_42%),radial-gradient(circle_at_35%_72%,rgba(236,72,153,0.1),transparent_36%)]" />

              <svg
                viewBox={`0 0 ${MAP_SIZE.width} ${MAP_SIZE.height}`}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full opacity-80"
              >
                <defs>
                  <linearGradient id="latam-fill" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#19B5C9" stopOpacity="0.18" />
                    <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.14" />
                  </linearGradient>
                  <pattern id="radar-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                    <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#FFFFFF" strokeOpacity="0.055" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width={MAP_SIZE.width} height={MAP_SIZE.height} fill="url(#radar-grid)" />
                <circle cx="470" cy="302" r="215" fill="none" stroke="#19B5C9" strokeOpacity="0.08" />
                <circle cx="470" cy="302" r="142" fill="none" stroke="#FFFFFF" strokeOpacity="0.05" />
                <path
                  d={`${geoPath(MESOAMERICA_OUTLINE)} Z`}
                  fill="url(#latam-fill)"
                  stroke="#67D8E6"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                />
                <path
                  d={`${geoPath(SOUTH_AMERICA_OUTLINE)} Z`}
                  fill="url(#latam-fill)"
                  stroke="#67D8E6"
                  strokeOpacity="0.36"
                  strokeWidth="2"
                />
                <path
                  d="M446 103c-5 46 1 91 16 136 21 63 21 121-12 176"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeDasharray="5 9"
                  strokeOpacity="0.13"
                />
                <path
                  d="M506 87c35 52 47 116 38 182-8 59-3 111 24 157"
                  fill="none"
                  stroke="#19B5C9"
                  strokeDasharray="4 12"
                  strokeOpacity="0.1"
                />
              </svg>

              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#EC4899] shadow-[0_0_12px_rgba(236,72,153,0.9)]" />
                {copy.radar}
              </div>

              {mappedCountries.map(({ country, position }) => {
                const active = selectedCountry === country.key;
                const muted = selectedCountry !== null && !active;

                return (
                  <button
                    key={country.key}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${copy.filterMapBy} ${country.name}: ${eventLabel(
                      country.count,
                      copy
                    )}`}
                    onClick={() => onSelect(country.key)}
                    style={{ left: `${position.x}%`, top: `${position.y}%` }}
                    className={`group absolute -translate-x-1/2 -translate-y-1/2 transition duration-300 focus-visible:outline-none ${
                      muted ? "opacity-35" : "opacity-100"
                    }`}
                  >
                    <span
                      className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border transition duration-300 ${
                        active
                          ? "motion-safe:animate-ping border-[#FFD600]/40 bg-[#FFD600]/15"
                          : "border-[#19B5C9]/20 bg-[#19B5C9]/10 group-hover:scale-125"
                      }`}
                    />
                    <span
                      className={`relative flex h-8 min-w-8 items-center justify-center rounded-full border px-2 text-[11px] font-black shadow-[0_8px_28px_rgba(0,0,0,0.45)] transition duration-200 ${
                        active
                          ? "border-[#FFD600] bg-[#FFD600] text-black"
                          : "border-[#19B5C9]/50 bg-[#17292B] text-[#67D8E6] group-hover:-translate-y-0.5 group-hover:border-[#19B5C9]"
                      }`}
                    >
                      {country.count}
                    </span>
                    <span
                      className={`absolute left-1/2 top-[calc(100%+7px)] -translate-x-1/2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold shadow-lg backdrop-blur-md transition ${
                        active
                          ? "border-[#FFD600]/30 bg-[#FFD600] text-black"
                          : "border-white/10 bg-black/70 text-white/75 group-hover:text-white"
                      }`}
                    >
                      {country.name}
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-6 right-6 max-w-[210px] rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs leading-5 text-white/45 backdrop-blur-md">
                {copy.footnote}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
