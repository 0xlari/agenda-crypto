import type { PublicEventAnnouncement } from "@/lib/event-announcement";
import EventAnnouncementImage from "@/componentes/event-announcement-image";

type Props = {
  announcement: PublicEventAnnouncement;
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatLastVerified(value: string | null) {
  if (!value) return "Aguardando verificação";
  return dateFormatter.format(new Date(value));
}

export default function EventAnnouncementCard({ announcement }: Props) {
  const location = [announcement.city, announcement.country].filter(Boolean).join(", ");
  const expectedDate = [announcement.expected_period, announcement.expected_year]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] shadow-[0_16px_45px_rgba(0,0,0,0.16)] transition hover:-translate-y-1 hover:border-[#19B5C9]/35 motion-reduce:transform-none">
      <div className="aspect-[16/9] overflow-hidden border-b border-white/10">
        <EventAnnouncementImage
          src={announcement.image_url}
          alt={`Imagem de divulgação preliminar de ${announcement.title}`}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#EC4899]/25 bg-[#EC4899]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F8A9CF]">
            Informações preliminares
          </span>
          <span className="rounded-full border border-[#FFD600]/25 bg-[#FFD600]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#FFE86B]">
            Data a confirmar
          </span>
        </div>

        <h3 className="mt-4 text-xl font-black leading-tight text-white">
          {announcement.title}
        </h3>
        <p className="mt-2 text-sm font-semibold text-[#7DE8F4]">
          {announcement.organizer}
        </p>

        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Local esperado</dt>
            <dd className="mt-1 text-white/75">{location || "Local a confirmar"}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-white/40">Previsão</dt>
            <dd className="mt-1 text-white/75">{expectedDate || "Período a confirmar"}</dd>
          </div>
        </dl>

        {announcement.summary && (
          <p className="mt-5 text-sm leading-6 text-white/60">{announcement.summary}</p>
        )}

        {announcement.agenda_insight && (
          <div className="mt-5 rounded-2xl border border-[#19B5C9]/20 bg-[#19B5C9]/[0.07] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7DE8F4]">
              Olhar da Agenda Crypto
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{announcement.agenda_insight}</p>
          </div>
        )}

        <div className="mt-auto pt-6">
          <p className="text-xs text-white/40">
            Última verificação: {formatLastVerified(announcement.last_verified_at)}
          </p>
          <a
            href={announcement.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:border-[#19B5C9] hover:text-[#7DE8F4] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FFD600]"
            aria-label={`Consultar fonte oficial de ${announcement.title} (abre em nova aba)`}
          >
            Consultar fonte oficial ↗
          </a>
        </div>
      </div>
    </article>
  );
}
