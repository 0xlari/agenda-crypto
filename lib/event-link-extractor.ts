import { isIP } from "node:net";

export type SupportedEventPlatform = "luma" | "sympla" | "eventbrite" | "meetup";

type JsonRecord = Record<string, unknown>;

export type ExtractedEventSubmission = {
  platform: SupportedEventPlatform;
  platform_label: string;
  event_title: string;
  event_date: string | null;
  end_date: string | null;
  event_time: string | null;
  event_link: string;
  city: string | null;
  location: string | null;
  short_description: string | null;
  tags: string | null;
  image_url: string | null;
  agenda_highlight: string;
  internal_notes: string;
};

const SUPPORTED_HOSTS: Record<SupportedEventPlatform, string[]> = {
  luma: ["lu.ma", "luma.com"],
  sympla: ["sympla.com.br", "sympla.com"],
  eventbrite: ["eventbrite.com", "eventbrite.com.br"],
  meetup: ["meetup.com"],
};

const PLATFORM_LABELS: Record<SupportedEventPlatform, string> = {
  luma: "Luma",
  sympla: "Sympla",
  eventbrite: "Eventbrite",
  meetup: "Meetup",
};

export class EventLinkExtractionError extends Error {
  status: number;
  publicMessage: string;

  constructor(publicMessage: string, status = 422) {
    super(publicMessage);
    this.name = "EventLinkExtractionError";
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

export function normalizeEventPlatform(
  platform: unknown
): SupportedEventPlatform | null {
  if (typeof platform !== "string") {
    return null;
  }

  const normalized = platform.trim().toLowerCase();

  if (
    normalized === "luma" ||
    normalized === "sympla" ||
    normalized === "eventbrite" ||
    normalized === "meetup"
  ) {
    return normalized;
  }

  return null;
}

export function getEventPlatformFromUrl(url: URL): SupportedEventPlatform | null {
  const hostname = normalizeHost(url.hostname);

  for (const [platform, hosts] of Object.entries(SUPPORTED_HOSTS)) {
    const matchesPlatform = hosts.some(
      (host) => hostname === host || hostname.endsWith(`.${host}`)
    );

    if (matchesPlatform) {
      return platform as SupportedEventPlatform;
    }
  }

  return null;
}

export async function extractEventFromUrl(
  inputUrl: string,
  platformHint?: unknown
): Promise<ExtractedEventSubmission> {
  const eventUrl = parsePublicUrl(inputUrl);
  const detectedPlatform = getEventPlatformFromUrl(eventUrl);
  const selectedPlatform = normalizeEventPlatform(platformHint);
  const platform = detectedPlatform || selectedPlatform;

  if (!platform || !detectedPlatform) {
    throw new EventLinkExtractionError(
      "Esse link ainda não é de uma plataforma suportada. Use Luma, Sympla, Eventbrite, Meetup ou preencha manualmente.",
      400
    );
  }

  const response = await fetch(eventUrl.href, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "AgendaCryptoBot/1.0 (+https://www.agendacryptoo.com/divulgacao)",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(9000),
  });

  if (!response.ok) {
    throw new EventLinkExtractionError(
      "Não consegui abrir esse link agora. Você pode preencher manualmente.",
      422
    );
  }

  const contentType = response.headers.get("content-type") || "";

  if (
    contentType &&
    !contentType.includes("text/html") &&
    !contentType.includes("application/xhtml+xml")
  ) {
    throw new EventLinkExtractionError(
      "Esse link não parece ser uma página de evento. Você pode preencher manualmente.",
      422
    );
  }

  const html = await response.text();
  const eventNode = findEventJsonLd(html);
  const metadata = extractPageMetadata(html);

  const title =
    readString(eventNode?.name) ||
    metadata.title ||
    inferTitleFromUrl(eventUrl);

  if (!title) {
    throw new EventLinkExtractionError(
      "Não consegui identificar o nome do evento. Complete pelo formulário manual.",
      422
    );
  }

  const startDate = readDateParts(eventNode?.startDate);
  const endDate = readDateParts(eventNode?.endDate);
  const locationInfo = readLocation(eventNode?.location);
  const description =
    readString(eventNode?.description) ||
    metadata.description ||
    "Evento enviado por link para curadoria da Agenda Crypto.";
  const imageUrl =
    toAbsoluteHttpUrl(readImageUrl(eventNode?.image), eventUrl) ||
    toAbsoluteHttpUrl(metadata.image, eventUrl);
  const platformLabel = PLATFORM_LABELS[platform];
  const shortDescription = truncate(cleanText(description), 700);

  const extracted: ExtractedEventSubmission = {
    platform,
    platform_label: platformLabel,
    event_title: truncate(cleanText(title), 180) || "Evento enviado por link",
    event_date: startDate.date,
    end_date: endDate.date,
    event_time: startDate.time,
    event_link: eventUrl.href,
    city: locationInfo.city,
    location: locationInfo.location,
    short_description: shortDescription,
    tags: `evento enviado por link, ${platformLabel}`,
    image_url: imageUrl,
    agenda_highlight: "",
    internal_notes: "",
  };

  extracted.agenda_highlight = buildAgendaHighlight(extracted);
  extracted.internal_notes = buildInternalNotes(extracted);

  return extracted;
}

function parsePublicUrl(inputUrl: string) {
  let url: URL;

  try {
    url = new URL(inputUrl.trim());
  } catch {
    throw new EventLinkExtractionError("Informe um link válido do evento.", 400);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new EventLinkExtractionError("Use um link http ou https.", 400);
  }

  const hostname = normalizeHost(url.hostname);

  if (isBlockedHost(hostname)) {
    throw new EventLinkExtractionError("Esse domínio não pode ser usado.", 400);
  }

  return url;
}

function normalizeHost(hostname: string) {
  return hostname.trim().toLowerCase().replace(/\.$/, "").replace(/^www\./, "");
}

function isBlockedHost(hostname: string) {
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    return true;
  }

  const ipVersion = isIP(hostname);

  if (ipVersion === 4) {
    const [first, second] = hostname.split(".").map(Number);
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      first >= 224 ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 198 && second >= 18 && second <= 19)
    );
  }

  if (ipVersion === 6) {
    return (
      hostname === "::1" ||
      hostname.startsWith("fc") ||
      hostname.startsWith("fd") ||
      hostname.startsWith("fe80")
    );
  }

  return false;
}

function findEventJsonLd(html: string): JsonRecord | null {
  const scripts = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  const eventNodes: JsonRecord[] = [];

  for (const script of scripts) {
    const rawJson = decodeHtmlEntities(script[1].trim());

    try {
      const parsed = JSON.parse(rawJson) as unknown;
      eventNodes.push(...flattenJsonLd(parsed).filter(isEventLikeNode));
    } catch {
      continue;
    }
  }

  return (
    eventNodes.find((node) => readString(node.name) && node.startDate) ||
    eventNodes.find((node) => readString(node.name)) ||
    eventNodes[0] ||
    null
  );
}

function flattenJsonLd(value: unknown): JsonRecord[] {
  if (Array.isArray(value)) {
    return value.flatMap(flattenJsonLd);
  }

  const record = asRecord(value);

  if (!record) {
    return [];
  }

  const graph = record["@graph"];
  const graphItems = Array.isArray(graph) ? graph.flatMap(flattenJsonLd) : [];

  return [record, ...graphItems];
}

function isEventLikeNode(node: JsonRecord) {
  const type = node["@type"];
  const types = Array.isArray(type) ? type : [type];

  return types.some((item) => {
    const value = readString(item)?.toLowerCase();
    return value ? value.endsWith("event") || value.includes("event") : false;
  });
}

function extractPageMetadata(html: string) {
  return {
    title:
      getMetaContent(html, ["og:title", "twitter:title"]) ||
      readTitleTag(html),
    description: getMetaContent(html, [
      "og:description",
      "twitter:description",
      "description",
    ]),
    image: getMetaContent(html, ["og:image", "twitter:image"]),
  };
}

function getMetaContent(html: string, names: string[]) {
  const acceptedNames = names.map((name) => name.toLowerCase());
  const metaTags = html.match(/<meta\b[^>]*>/gi) || [];

  for (const tag of metaTags) {
    const property = getAttribute(tag, "property")?.toLowerCase();
    const name = getAttribute(tag, "name")?.toLowerCase();
    const key = property || name;

    if (!key || !acceptedNames.includes(key)) {
      continue;
    }

    const content = getAttribute(tag, "content");

    if (content) {
      return cleanText(content);
    }
  }

  return null;
}

function getAttribute(tag: string, attributeName: string) {
  const quoted = tag.match(
    new RegExp(`${attributeName}\\s*=\\s*(["'])(.*?)\\1`, "i")
  );

  if (quoted?.[2]) {
    return decodeHtmlEntities(quoted[2]);
  }

  const unquoted = tag.match(
    new RegExp(`${attributeName}\\s*=\\s*([^\\s"'>]+)`, "i")
  );

  return unquoted?.[1] ? decodeHtmlEntities(unquoted[1]) : null;
}

function readTitleTag(html: string) {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return titleMatch?.[1] ? cleanText(titleMatch[1]) : null;
}

function readDateParts(value: unknown) {
  const text = readString(value);

  if (!text) {
    return { date: null, time: null };
  }

  return {
    date: text.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || null,
    time: text.match(/[T\s](\d{2}:\d{2})/)?.[1] || null,
  };
}

function readLocation(value: unknown) {
  const location = Array.isArray(value) ? value[0] : value;
  const locationText = readString(location);

  if (locationText) {
    return { location: locationText, city: null };
  }

  const locationRecord = asRecord(location);

  if (!locationRecord) {
    return { location: null, city: null };
  }

  const name = readString(locationRecord.name);
  const address = locationRecord.address;
  const addressText = readString(address);

  if (addressText) {
    return {
      location: joinUnique([name, addressText]),
      city: null,
    };
  }

  const addressRecord = asRecord(address);
  const city =
    readString(addressRecord?.addressLocality) ||
    readString(addressRecord?.addressRegion);
  const street = readString(addressRecord?.streetAddress);
  const region = readString(addressRecord?.addressRegion);
  const country = readString(addressRecord?.addressCountry);

  return {
    location: joinUnique([name, street, city, region, country]),
    city,
  };
}

function readImageUrl(value: unknown): string | null {
  const text = readString(value);

  if (text) {
    return text;
  }

  if (Array.isArray(value)) {
    return value.map(readImageUrl).find(Boolean) || null;
  }

  const record = asRecord(value);

  return readString(record?.url) || readString(record?.contentUrl);
}

function toAbsoluteHttpUrl(value: string | null, base: URL) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value, base.href);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function inferTitleFromUrl(url: URL) {
  const slug = url.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    ?.replace(/[-_]+/g, " ");

  return slug ? cleanText(slug) : null;
}

function buildAgendaHighlight(event: ExtractedEventSubmission) {
  const parts = [
    `Evento extraído automaticamente de ${event.platform_label}.`,
    event.city ? `Cidade identificada: ${event.city}.` : null,
    event.event_date ? `Data identificada: ${event.event_date}.` : null,
  ].filter(Boolean);

  return `${parts.join(" ")} Revisar título, data, cidade, imagem e relevância antes de aprovar na Agenda Crypto.`;
}

function buildInternalNotes(event: ExtractedEventSubmission) {
  return [
    "Origem: envio rápido por link.",
    `Plataforma detectada: ${event.platform_label}.`,
    "Extração automática sem IA paga; revisar antes de publicar.",
  ].join(" ");
}

function asRecord(value: unknown): JsonRecord | null {
  return typeof value === "object" && value !== null
    ? (value as JsonRecord)
    : null;
}

function readString(value: unknown) {
  if (typeof value === "string" || typeof value === "number") {
    return cleanText(String(value));
  }

  return null;
}

function cleanText(value: string) {
  return stripHtml(decodeHtmlEntities(value)).replace(/\s+/g, " ").trim();
}

function stripHtml(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };

  return value
    .replace(/&([a-z]+);/gi, (entity, name: string) => {
      return namedEntities[name.toLowerCase()] || entity;
    })
    .replace(/&#(\d+);/g, (_entity, code: string) => {
      return String.fromCharCode(Number(code));
    })
    .replace(/&#x([0-9a-f]+);/gi, (_entity, code: string) => {
      return String.fromCharCode(parseInt(code, 16));
    });
}

function truncate(value: string | null, maxLength: number) {
  if (!value || value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3).trim()}...`;
}

function joinUnique(parts: Array<string | null | undefined>) {
  const values = parts.filter(Boolean) as string[];
  const uniqueValues = values.filter(
    (value, index) => values.findIndex((item) => item === value) === index
  );

  return uniqueValues.length > 0 ? uniqueValues.join(", ") : null;
}
