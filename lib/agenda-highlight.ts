type HighlightField =
  | "agendaView"
  | "audience"
  | "format"
  | "level"
  | "topic"
  | "opportunity"
  | "note";

export type ParsedAgendaHighlight = {
  agendaView: string | null;
  audience: string | null;
  format: string[];
  level: string[];
  topic: string[];
  opportunity: string[];
  note: string | null;
  fallback: string | null;
  isStructured: boolean;
};

const LABEL_ALIASES: Record<HighlightField, string[]> = {
  agendaView: [
    "Olhar da Agenda Crypto",
    "Observação para curadoria",
    "Observacao para curadoria",
  ],
  audience: ["Para quem vale a pena", "Público ideal", "Publico ideal"],
  format: ["Formato"],
  level: ["Nível", "Nivel"],
  topic: ["Tema"],
  opportunity: ["Oportunidade"],
  note: ["Nota interna"],
};

const LABEL_TO_FIELD = Object.entries(LABEL_ALIASES).reduce<
  Record<string, HighlightField>
>((acc, [field, labels]) => {
  labels.forEach((label) => {
    acc[normalizeLabel(label)] = field as HighlightField;
  });

  return acc;
}, {});

const LABEL_PATTERN = new RegExp(
  `^(${Object.values(LABEL_ALIASES)
    .flat()
    .map(escapeRegExp)
    .join("|")}):\\s*`,
  "gim"
);

export function parseAgendaHighlight(
  value?: string | null
): ParsedAgendaHighlight {
  const emptyHighlight: ParsedAgendaHighlight = {
    agendaView: null,
    audience: null,
    format: [],
    level: [],
    topic: [],
    opportunity: [],
    note: null,
    fallback: null,
    isStructured: false,
  };

  const normalizedValue = value?.replace(/\r\n/g, "\n").trim();

  if (!normalizedValue) {
    return emptyHighlight;
  }

  const matches = [...normalizedValue.matchAll(LABEL_PATTERN)];

  if (matches.length === 0) {
    return {
      ...emptyHighlight,
      fallback: normalizedValue,
    };
  }

  const parsed = { ...emptyHighlight, isStructured: true };

  matches.forEach((match, index) => {
    const rawLabel = match[1];
    const field = LABEL_TO_FIELD[normalizeLabel(rawLabel)];
    const contentStart = match.index + match[0].length;
    const contentEnd =
      index + 1 < matches.length ? matches[index + 1].index : normalizedValue.length;
    const content = normalizedValue.slice(contentStart, contentEnd).trim();

    if (!field || !content) {
      return;
    }

    if (field === "agendaView" || field === "audience" || field === "note") {
      parsed[field] = content;
      return;
    }

    parsed[field] = content
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  });

  const hasStructuredContent =
    parsed.agendaView ||
    parsed.audience ||
    parsed.note ||
    parsed.format.length > 0 ||
    parsed.level.length > 0 ||
    parsed.topic.length > 0 ||
    parsed.opportunity.length > 0;

  return hasStructuredContent
    ? parsed
    : {
        ...emptyHighlight,
        fallback: normalizedValue,
      };
}

function normalizeLabel(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
