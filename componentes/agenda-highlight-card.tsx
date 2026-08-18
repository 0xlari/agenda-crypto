import { parseAgendaHighlight } from "@/lib/agenda-highlight";

type Props = {
  value?: string | null;
  eyebrow?: string;
  title?: string;
  showHeader?: boolean;
};

const TAG_GROUPS = [
  {
    key: "format",
    label: "Formato",
    className: "border-[#19B5C9]/25 bg-[#19B5C9]/10 text-[#7DE8F4]",
  },
  {
    key: "level",
    label: "Nível",
    className: "border-[#FFD600]/25 bg-[#FFD600]/10 text-[#FFE86B]",
  },
  {
    key: "topic",
    label: "Tema",
    className: "border-[#EC4899]/25 bg-[#EC4899]/10 text-[#F8A9CF]",
  },
  {
    key: "opportunity",
    label: "Oportunidade",
    className: "border-white/15 bg-white/[0.06] text-white/75",
  },
] as const;

export default function AgendaHighlightCard({
  value,
  eyebrow = "Insight editorial",
  title = "Resumo editorial",
  showHeader = true,
}: Props) {
  const highlight = parseAgendaHighlight(value);

  if (!value || (!highlight.fallback && !highlight.isStructured)) {
    return null;
  }

  if (highlight.fallback) {
    return (
      <div className="rounded-2xl border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#19B5C9]">
          {title}
        </p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-white/75">
          <LinkedText text={highlight.fallback} />
        </p>
      </div>
    );
  }

  const agendaViewClassName = showHeader
    ? "mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"
    : "rounded-2xl border border-white/10 bg-black/20 p-4";

  return (
    <div className="rounded-3xl border border-[#19B5C9]/20 bg-[linear-gradient(135deg,rgba(25,181,201,0.12),rgba(255,255,255,0.035),rgba(236,72,153,0.08))] p-5">
      {showHeader && (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19B5C9]">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-xl font-black text-white">{title}</h3>
        </>
      )}

      {highlight.agendaView && (
        <div className={agendaViewClassName}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFD600]">
            Olhar da Agenda Crypto
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/78">
            <LinkedText text={highlight.agendaView} />
          </p>
        </div>
      )}

      {highlight.audience && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFD600]">
            Para quem vale a pena
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/78">
            <LinkedText text={highlight.audience} />
          </p>
        </div>
      )}

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {TAG_GROUPS.map((group) => {
          const values = highlight[group.key];

          if (values.length === 0) {
            return null;
          }

          return (
            <div
              key={group.key}
              className="rounded-2xl border border-white/10 bg-black/15 p-4"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {values.map((item) => (
                  <span
                    key={item}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${group.className}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {highlight.note && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Nota interna
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/70">
            <LinkedText text={highlight.note} />
          </p>
        </div>
      )}
    </div>
  );
}

function LinkedText({ text }: { text: string }) {
  const parts = splitLinkedText(text);

  return (
    <>
      {parts.map((part, index) =>
        part.href ? (
          <a
            key={`${part.href}-${index}`}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#19B5C9] underline decoration-[#19B5C9]/35 underline-offset-4 transition hover:text-[#7DE8F4]"
          >
            {part.text}
          </a>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        )
      )}
    </>
  );
}

function splitLinkedText(text: string) {
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
  const parts: Array<{ text: string; href?: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index) });
    }

    const markdownText = match[1];
    const markdownHref = match[2];
    const rawHref = match[3];
    const href = getSafeHttpUrl(markdownHref || rawHref);

    if (href) {
      parts.push({
        text: markdownText || rawHref,
        href,
      });
    } else {
      parts.push({ text: match[0] });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }

  return parts;
}

function getSafeHttpUrl(value?: string) {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}
