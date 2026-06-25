export const SITE_NAME = "Agenda Crypto";
export const SITE_URL = "https://www.agendacryptoo.com";
export const SEO_IMAGE = "/images/logo.png";

export const DEFAULT_DESCRIPTION =
  "Agenda de eventos cripto, web3 e blockchain no Brasil e na America Latina, com curadoria por pais, cidade, data e comunidade.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function cleanText(value: string | null | undefined) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

export function seoDescription(
  value: string | null | undefined,
  fallback = DEFAULT_DESCRIPTION,
  maxLength = 155
) {
  const cleaned = cleanText(value) || fallback;

  if (cleaned.length <= maxLength) return cleaned;

  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}
