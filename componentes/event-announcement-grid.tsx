import EventAnnouncementCard from "@/componentes/event-announcement-card";
import type { PublicEventAnnouncement } from "@/lib/event-announcement";

type Props = {
  announcements: PublicEventAnnouncement[];
  emptyTitle?: string;
  emptyDescription?: string;
};

export default function EventAnnouncementGrid({
  announcements,
  emptyTitle = "Ainda não há anúncios por aqui.",
  emptyDescription = "Nossa curadoria está acompanhando as próximas movimentações do ecossistema.",
}: Props) {
  if (announcements.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-white/15 bg-white/[0.025] px-5 py-12 text-center sm:px-8">
        <p className="text-lg font-bold text-white">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/55">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {announcements.map((announcement) => (
        <EventAnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
