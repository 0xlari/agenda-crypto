"use client";

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
  onSelect: (countryKey: string | null) => void;
};

const LATAM_BOUNDS = {
  minLat: -60,
  maxLat: 35,
  minLng: -120,
  maxLng: -30,
};

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
    x: Math.min(89, Math.max(11, rawX)),
    y: Math.min(88, Math.max(12, rawY)),
  };
}

function eventLabel(count: number) {
  return `${count} evento${count === 1 ? "" : "s"}`;
}

export default function CountryExplorer({
  countries,
  selectedCountry,
  totalEvents,
  onSelect,
}: CountryExplorerProps) {
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
                Explore por país
              </div>

              <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Onde o ecossistema se encontra?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                Escolha um país para ver só os eventos daquela região. O mapa e
                a lista ficam sincronizados com a busca.
              </p>

              <div
                className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:max-h-[280px] lg:grid-cols-2 lg:overflow-y-auto lg:pr-2"
                aria-label="Filtros por país"
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
                  <span className="text-sm font-extrabold">Todos os países</span>
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
                      aria-label={`Filtrar por ${country.name}: ${eventLabel(
                        country.count
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
                viewBox="0 0 640 520"
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

                <rect width="640" height="520" fill="url(#radar-grid)" />
                <circle cx="355" cy="260" r="205" fill="none" stroke="#19B5C9" strokeOpacity="0.08" />
                <circle cx="355" cy="260" r="135" fill="none" stroke="#FFFFFF" strokeOpacity="0.05" />
                <path
                  d="M94 60c38-22 92-20 132-2 33 15 54 41 86 54 37 15 82 10 108 41 21 25 8 58 18 86 10 29 43 45 55 73 11 28-2 59-17 84-18 30-43 55-58 86-15 30-18 65-39 92-13 17-35 32-54 22-21-11-17-42-29-62-19-32-57-49-70-84-12-31 2-65-7-97-10-35-46-57-55-92-8-29 6-60-3-88-10-31-47-47-65-73-12-18-12-45 5-60 13-12 33-8 47-20 13-11 13-31 24-45z"
                  fill="url(#latam-fill)"
                  stroke="#67D8E6"
                  strokeOpacity="0.3"
                  strokeWidth="2"
                />
                <path d="M118 145c77 13 129 42 179 94 39 41 69 87 108 128" fill="none" stroke="#FFFFFF" strokeDasharray="5 9" strokeOpacity="0.12" />
              </svg>

              <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#EC4899] shadow-[0_0_12px_rgba(236,72,153,0.9)]" />
                Radar LATAM
              </div>

              {mappedCountries.map(({ country, position }) => {
                const active = selectedCountry === country.key;
                const muted = selectedCountry !== null && !active;

                return (
                  <button
                    key={country.key}
                    type="button"
                    aria-pressed={active}
                    aria-label={`Filtrar mapa por ${country.name}: ${eventLabel(
                      country.count
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
                Cada ponto reúne os próximos eventos daquele país.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
