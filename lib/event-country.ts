export type EventLocation = {
  city?: string | null;
  country?: string | null;
  isOnline?: boolean | null;
};

export type ResolvedCountry = {
  key: string;
  name: string;
  storageName: string | null;
  aliases: string[];
  cities: string[];
  lat: number | null;
  lng: number | null;
};

export const COUNTRY_DIRECTORY: ResolvedCountry[] = [
  {
    key: "brasil",
    name: "Brasil",
    storageName: "Brazil",
    aliases: ["brasil", "brazil", "br"],
    cities: [
      "são paulo",
      "rio de janeiro",
      "florianópolis",
      "são josé do rio preto",
      "belo horizonte",
      "brasília",
      "curitiba",
      "porto alegre",
      "recife",
      "salvador",
    ],
    lat: -14.24,
    lng: -51.93,
  },
  {
    key: "argentina",
    name: "Argentina",
    storageName: "Argentina",
    aliases: ["argentina", "ar"],
    cities: ["buenos aires", "córdoba", "mendoza", "rosario"],
    lat: -38.42,
    lng: -63.62,
  },
  {
    key: "colombia",
    name: "Colômbia",
    storageName: "Colombia",
    aliases: ["colombia", "colômbia", "co"],
    cities: ["bogotá", "medellín", "cali", "cartagena"],
    lat: 4.57,
    lng: -74.3,
  },
  {
    key: "mexico",
    name: "México",
    storageName: "Mexico",
    aliases: ["méxico", "mexico", "mx"],
    cities: [
      "ciudad de méxico",
      "mexico city",
      "guadalajara",
      "monterrey",
    ],
    lat: 23.63,
    lng: -102.55,
  },
  {
    key: "chile",
    name: "Chile",
    storageName: "Chile",
    aliases: ["chile", "cl"],
    cities: ["santiago", "valparaíso", "concepción"],
    lat: -35.68,
    lng: -71.54,
  },
  {
    key: "uruguai",
    name: "Uruguai",
    storageName: "Uruguay",
    aliases: ["uruguai", "uruguay", "uy"],
    cities: ["montevidéu", "montevideo", "punta del este"],
    lat: -32.52,
    lng: -55.77,
  },
  {
    key: "peru",
    name: "Peru",
    storageName: "Peru",
    aliases: ["peru", "perú", "pe"],
    cities: ["lima", "cusco", "arequipa"],
    lat: -9.19,
    lng: -75.02,
  },
  {
    key: "equador",
    name: "Equador",
    storageName: "Ecuador",
    aliases: ["equador", "ecuador", "ec"],
    cities: ["quito", "guayaquil"],
    lat: -1.83,
    lng: -78.18,
  },
  {
    key: "paraguai",
    name: "Paraguai",
    storageName: "Paraguay",
    aliases: ["paraguai", "paraguay", "py"],
    cities: ["assunção", "asunción", "ciudad del este"],
    lat: -23.44,
    lng: -58.44,
  },
  {
    key: "bolivia",
    name: "Bolívia",
    storageName: "Bolivia",
    aliases: ["bolívia", "bolivia", "bo"],
    cities: ["la paz", "santa cruz de la sierra", "cochabamba"],
    lat: -16.29,
    lng: -63.59,
  },
  {
    key: "venezuela",
    name: "Venezuela",
    storageName: "Venezuela",
    aliases: ["venezuela", "ve"],
    cities: ["caracas", "maracaibo"],
    lat: 6.42,
    lng: -66.59,
  },
  {
    key: "panama",
    name: "Panamá",
    storageName: "Panama",
    aliases: ["panamá", "panama", "pa"],
    cities: ["cidade do panamá", "panama city", "ciudad de panamá"],
    lat: 8.54,
    lng: -80.78,
  },
  {
    key: "costa-rica",
    name: "Costa Rica",
    storageName: "Costa Rica",
    aliases: ["costa rica", "cr"],
    cities: ["san josé", "san jose"],
    lat: 9.75,
    lng: -83.75,
  },
];

export const ONLINE_COUNTRY: ResolvedCountry = {
  key: "online",
  name: "Online",
  storageName: null,
  aliases: ["online"],
  cities: [],
  lat: null,
  lng: null,
};

export const UNKNOWN_COUNTRY: ResolvedCountry = {
  key: "outros-locais",
  name: "Outros locais",
  storageName: null,
  aliases: [],
  cities: [],
  lat: null,
  lng: null,
};

export function normalizeText(text: string) {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function toKey(text: string) {
  return normalizeText(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCountryByValue(value?: string | null) {
  const normalizedValue = normalizeText(value || "");
  if (!normalizedValue) return null;

  return (
    COUNTRY_DIRECTORY.find((country) =>
      [...country.aliases, country.storageName || ""].some(
        (alias) => normalizeText(alias) === normalizedValue
      )
    ) || null
  );
}

export function getCountryByCity(city?: string | null) {
  const normalizedCity = normalizeText(city || "");
  if (!normalizedCity) return null;

  return (
    COUNTRY_DIRECTORY.find((country) =>
      country.cities.some((knownCity) =>
        normalizedCity.includes(normalizeText(knownCity))
      )
    ) || null
  );
}

export function resolveEventCountry({ city, country, isOnline }: EventLocation) {
  const cityCountry = getCountryByCity(city);

  // City wins when old imports stored a contradictory default country.
  if (cityCountry) return cityCountry;

  const knownCountry = getCountryByValue(country);
  if (knownCountry) return knownCountry;

  if (country?.trim()) {
    return {
      key: toKey(country) || UNKNOWN_COUNTRY.key,
      name: country.trim(),
      storageName: country.trim(),
      aliases: [country.trim()],
      cities: [],
      lat: null,
      lng: null,
    } satisfies ResolvedCountry;
  }

  if (isOnline) return ONLINE_COUNTRY;
  return UNKNOWN_COUNTRY;
}

export function countryForStorage(location: EventLocation) {
  return resolveEventCountry(location).storageName;
}
