"use client";

import { useState } from "react";

type Stats = {
  publishedCount: number;
  activeCount: number;
  goingCount: number;
  agendaViewsCount: number;
  leadsCount: number;
};

type PendingEvent = {
  id: string;
  title: string;
  city: string | null;
  start_date: string;
  published: boolean;
};

type Lead = {
  id: string;
  contact_name: string;
  email: string;
  whatsapp: string | null;
  event_title: string;
  interest_type: string;
  created_at: string;
};

type PendingSubmission = {
  id: string;
  contact_name: string;
  email: string;
  whatsapp: string | null;
  event_title: string;
  event_date: string | null;
  city: string | null;
  location: string | null;
  short_description: string | null;
  tags: string | null;
  created_at: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard({
  stats,
  pendingEvents,
  leads,
  pendingSubmissions,
}: {
  stats: Stats;
  pendingEvents: PendingEvent[];
  leads: Lead[];
  pendingSubmissions: PendingSubmission[];
}) {
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedEventIds, setApprovedEventIds] = useState<string[]>([]);
  const [approvedSubmissionIds, setApprovedSubmissionIds] = useState<string[]>([]);

  async function handleApproveEvent(eventId: string) {
    setApprovingId(eventId);

    try {
      const response = await fetch("/api/admin/approve-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao aprovar evento.");
        return;
      }

      setApprovedEventIds((prev) => [...prev, eventId]);
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setApprovingId(null);
    }
  }

  async function handleApprove(id: string) {
  try {
    const res = await fetch("/api/admin/approve-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId: id,
      }),
    });

    if (!res.ok) {
      alert("Erro ao aprovar evento");
      return;
    }

    alert("Evento aprovado 🚀");

    // opcional: recarregar lista
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor");
  }
}

  const visiblePendingEvents = pendingEvents.filter(
    (event) => !approvedEventIds.includes(event.id)
  );

  const visiblePendingSubmissions = pendingSubmissions.filter(
    (submission) => !approvedSubmissionIds.includes(submission.id)
  );

  return (
    <div className="space-y-10">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/55">Eventos publicados</p>
          <p className="mt-2 text-3xl font-black">{stats.publishedCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/55">Eventos ativos hoje</p>
          <p className="mt-2 text-3xl font-black">{stats.activeCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/55">Pessoas que marcaram vou</p>
          <p className="mt-2 text-3xl font-black">{stats.goingCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/55">Acessos à agenda</p>
          <p className="mt-2 text-3xl font-black">{stats.agendaViewsCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-white/55">Leads recentes</p>
          <p className="mt-2 text-3xl font-black">{stats.leadsCount}</p>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#19B5C9]">
            Solicitações gratuitas
          </p>
          <h2 className="mt-2 text-2xl font-black">
            Eventos enviados para entrar na agenda
          </h2>
        </div>

        <div className="space-y-4">
          {visiblePendingSubmissions.length === 0 ? (
            <p className="text-sm text-white/60">
              Nenhuma solicitação nova no momento.
            </p>
          ) : (
            visiblePendingSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#19B5C9]/15 px-3 py-1 text-xs font-semibold text-[#19B5C9]">
                    Listagem gratuita
                  </span>
                  <span className="text-xs text-white/45">
                    {formatDate(submission.created_at)}
                  </span>
                </div>

                <h3 className="mt-3 text-xl font-bold">{submission.event_title}</h3>

                <div className="mt-3 grid gap-2 text-sm text-white/65 md:grid-cols-2">
                  <p><strong className="text-white">Responsável:</strong> {submission.contact_name}</p>
                  <p><strong className="text-white">Email:</strong> {submission.email}</p>
                  {submission.whatsapp && (
                    <p><strong className="text-white">WhatsApp:</strong> {submission.whatsapp}</p>
                  )}
                  {submission.city && (
                    <p><strong className="text-white">Cidade:</strong> {submission.city}</p>
                  )}
                  {submission.location && (
                    <p><strong className="text-white">Local:</strong> {submission.location}</p>
                  )}
                  {submission.event_date && (
                    <p><strong className="text-white">Data:</strong> {submission.event_date}</p>
                  )}
                </div>

                {submission.short_description && (
                  <p className="mt-4 text-sm leading-6 text-white/65">
                    {submission.short_description}
                  </p>
                )}

                {submission.tags && (
                  <p className="mt-3 text-xs text-white/45">
                    Tags: {submission.tags}
                  </p>
                )}

                <button
                  onClick={() => handleApprove(submission.id)}
                  disabled={approvingId === submission.id}
                  className="mt-5 rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
                >
                  {approvingId === submission.id
                    ? "Aprovando..."
                    : "Aprovar e publicar"}
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFD600]">
              Aprovação manual
            </p>
            <h2 className="mt-2 text-2xl font-black">Eventos pendentes</h2>
          </div>

          <div className="space-y-4">
            {visiblePendingEvents.length === 0 ? (
              <p className="text-sm text-white/60">
                Nenhum evento pendente no momento.
              </p>
            ) : (
              visiblePendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <p className="text-sm text-[#19B5C9]">
                    {formatDate(event.start_date)}
                  </p>
                  <h3 className="mt-1 text-lg font-bold">{event.title}</h3>
                  <p className="mt-1 text-sm text-white/60">
                    {event.city || "Online"}
                  </p>

                  <button
                    onClick={() => handleApproveEvent(event.id)}
                    disabled={approvingId === event.id}
                    className="mt-4 rounded-full bg-[#19B5C9] px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
                  >
                    {approvingId === event.id ? "Aprovando..." : "Aprovar evento"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#EC4899]">
              Leads
            </p>
            <h2 className="mt-2 text-2xl font-black">Últimos contatos</h2>
          </div>

          <div className="space-y-4">
            {leads.length === 0 ? (
              <p className="text-sm text-white/60">
                Nenhum lead recebido ainda.
              </p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                      {lead.interest_type}
                    </span>
                    <span className="text-xs text-white/45">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold">{lead.event_title}</h3>
                  <p className="mt-1 text-sm text-white/70">{lead.contact_name}</p>
                  <p className="text-sm text-white/55">{lead.email}</p>
                  {lead.whatsapp && (
                    <p className="text-sm text-white/55">{lead.whatsapp}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}