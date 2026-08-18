import type { Metadata } from "next";

export const SITE_NAME = "Agenda Crypto";
export const SITE_URL = "https://www.agendacryptoo.com";
export const SEO_IMAGE = "/images/logo.png";

export const DEFAULT_DESCRIPTION =
  "Agenda de eventos cripto, web3 e blockchain no Brasil e na America Latina, com curadoria por pais, cidade, data e comunidade.";

export const DEFAULT_KEYWORDS = [
  "agenda crypto",
  "eventos cripto",
  "eventos web3",
  "eventos blockchain",
  "eventos bitcoin",
  "eventos ethereum",
  "comunidade cripto",
  "Brasil",
  "America Latina",
];

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  robots?: Metadata["robots"];
  twitterCard?: "summary" | "summary_large_image";
};

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function absoluteImageUrl(image = SEO_IMAGE) {
  return /^https?:\/\//i.test(image) ? image : absoluteUrl(image);
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

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image = SEO_IMAGE,
  imageAlt = SITE_NAME,
  robots,
  twitterCard,
}: PageMetadataOptions): Metadata {
  const normalizedDescription = seoDescription(description, DEFAULT_DESCRIPTION, 170);
  const normalizedKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...keywords]));
  const imageUrl = absoluteImageUrl(image);

  return {
    title,
    description: normalizedDescription,
    keywords: normalizedKeywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: SITE_NAME,
      url: path,
      title,
      description: normalizedDescription,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: twitterCard ?? (image === SEO_IMAGE ? "summary" : "summary_large_image"),
      title,
      description: normalizedDescription,
      images: [imageUrl],
    },
    ...(robots ? { robots } : {}),
  };
}

export function formatDateForSeo(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function isEmptyJsonLdValue(value: unknown) {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  );
}

export function compactJsonLd(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(compactJsonLd).filter((item) => !isEmptyJsonLdValue(item));
  }

  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, item]) => [key, compactJsonLd(item)] as const)
        .filter(([, item]) => !isEmptyJsonLdValue(item))
    );
  }

  return value;
}
