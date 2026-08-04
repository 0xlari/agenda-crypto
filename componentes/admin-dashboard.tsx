"use client";

import { useMemo, useState } from "react";
import { authFetch } from "@/lib/supabase/auth-fetch";

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
  lead_status?: string;
};

type PendingSubmission = {
  id: string;
  contact_name: string;
  email: string;
  whatsapp: string | null;
  event_title: string;
  event_date: string | null;
  end_date?: string | null;
  event_time: string | null;
  event_link?: string | null;
  city: string | null;
  location: string | null;
  short_description: string | null;
  tags: string | null;
  created_at: string;
  lead_status?: string;
  image_url?: string | null;
  interest_type: string | null;
  internal_notes?: string | null;
  agenda_highlight?: string | null;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getLeadStatusLabel(status?: string) {
  switch (status) {
    case "contacted":
      return "contatado";
    case "negotiating":
      return "negociação";
    case "closed":
      return "fechado";
    case "lost":
      return "perdido";
    default:
      return "novo";
  }
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
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [approvedEventIds, setApprovedEventIds] = useState<string[]>([]);
  const [hiddenSubmissionIds, setHiddenSubmissionIds] = useState<string[]>([]);
  const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [leadStatuses, setLeadStatuses] = useState<Record<string, string>>(
    Object.fromEntries(leads.map((lead) => [lead.id, lead.lead_status || "new"]))
  );

  async function handleApproveEvent(submissionId: string) {
    setLoadingId(submissionId);

    try {
      const response = await authFetch("/api/admin/approve-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao aprovar evento.");
        return;
      }

      setHiddenSubmissionIds((prev) => [...prev, submissionId]);
      alert("Evento aprovado com sucesso 🚀");
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleRejectSubmission(submissionId: string) {
    setLoadingId(submissionId);

    try {
      const response = await authFetch("/api/admin/reject-submission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao rejeitar submissão.");
        return;
      }

      setHiddenSubmissionIds((prev) => [...prev, submissionId]);
      alert("Submissão rejeitada.");
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleApproveManualEvent(eventId: string) {
    setLoadingId(eventId);

    try {
      const response = await authFetch("/api/admin/approve-event", {
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
      alert("Evento aprovado.");
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleLeadStatusChange(submissionId: string, nextStatus: string) {
    setLeadStatuses((prev) => ({
      ...prev,
      [submissionId]: nextStatus,
    }));

    try {
      const response = await authFetch("/api/admin/update-lead-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          submissionId,
          leadStatus: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao atualizar status.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
  }

  const visiblePendingEvents = pendingEvents.filter(
    (event) => !approvedEventIds.includes(event.id)
  );

  const visiblePendingSubmissions = pendingSubmissions.filter(
    (submission) => !hiddenSubmissionIds.includes(submission.id)
  );

  const latestLeads = useMemo(() => leads.slice(0, 20), [leads]);

  function startEditing(submission: PendingSubmission) {
  setEditingSubmissionId(submission.id);
  setEditForm({
    contact_name: submission.contact_name || "",
    email: submission.email || "",
    whatsapp: submission.whatsapp || "",
    event_title: submission.event_title || "",
    event_date: submission.event_date || "",
    end_date: submission.end_date || "",
    event_time: submission.event_time || "",
    city: submission.city || "",
    location: submission.location || "",
    event_link: submission.event_link || "",
    short_description: submission.short_description || "",
    tags: submission.tags || "",
    image_url: submission.image_url || "",
    interest_type: submission.interest_type || "free_listing",
    agenda_highlight: submission.agenda_highlight || "",
    internal_notes: submission.internal_notes || "",
  });
}

function cancelEditing() {
  setEditingSubmissionId(null);
  setEditForm({});
}

async function saveSubmissionEdits(submissionId: string) {
  try {
    setLoadingId(submissionId);

    const response = await authFetch("/api/admin/update-submission", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        submissionId,
        ...editForm,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Erro ao salvar alterações.");
      return;
    }

    alert("Alterações salvas com sucesso.");
    window.location.reload();
  } catch {
    alert("Erro ao conectar com o servidor.");
  } finally {
    setLoadingId(null);
  }
}

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
            visiblePendingSubmissions.map((submission) => {
              const whatsappHref = submission.whatsapp
                ? `https://wa.me/55${submission.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Olá, ${submission.contact_name}! Vi o envio do evento "${submission.event_title}" na Agenda Crypto e queria falar com você.`
                  )}`
                : null;

              return (
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

                    {submission.image_url ? (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={submission.image_url}
                          alt={submission.event_title}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] text-sm text-white/45">
                        Sem imagem enviada
                      </div>
                    )}

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
                      {submission.end_date && (
                        <p><strong className="text-white">Data fim:</strong> {submission.end_date}</p>
                      )}
                      {submission.event_time && (
                        <p>
                          <strong className="text-white">Horário:</strong> {submission.event_time}
                        </p>
                      )}

                      {submission.event_link && (
                        <p className="md:col-span-2">
                          <strong className="text-white">Link:</strong>{" "}
                          <a
                            href={submission.event_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#19B5C9] underline"
                          >
                            abrir link
                          </a>
                        </p>
                      )}

                  {submission.short_description && (
                    <p className="mt-4 text-sm leading-6 text-white/65">
                      {submission.short_description}
                    </p>
                  )}
                  {submission.agenda_highlight && (
                    <div className="mt-4 rounded-2xl border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#19B5C9]">
                        Destacar na Agenda Crypto
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {submission.agenda_highlight}
                      </p>
                    </div>
                  )}

                  {submission.tags && (
                    <p className="mt-3 text-xs text-white/45">
                      Tags: {submission.tags}
                    </p>
                  )}
                  {editingSubmissionId === submission.id && (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={editForm.contact_name || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, contact_name: e.target.value }))
          }
          placeholder="Responsável"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.email || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="Email"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.whatsapp || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, whatsapp: e.target.value }))
          }
          placeholder="WhatsApp"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.event_title || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, event_title: e.target.value }))
          }
          placeholder="Título do evento"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.event_date || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, event_date: e.target.value }))
          }
          placeholder="Data início"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.end_date || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, end_date: e.target.value }))
          }
          placeholder="Data fim"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />
        <input
          value={editForm.event_time || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, event_time: e.target.value }))
          }
          placeholder="Horário do evento"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.city || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, city: e.target.value }))
          }
          placeholder="Cidade"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.location || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="Local"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none"
        />

        <input
          value={editForm.event_link || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, event_link: e.target.value }))
          }
          placeholder="Link do evento"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />

        <input
          value={editForm.image_url || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, image_url: e.target.value }))
          }
          placeholder="URL da imagem"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />

        <input
          value={editForm.tags || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="Tags separadas por vírgula"
          className="rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />

        <textarea
          value={editForm.short_description || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, short_description: e.target.value }))
          }
          placeholder="Descrição curta"
          className="min-h-[110px] rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />
        <textarea
          value={editForm.agenda_highlight || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, agenda_highlight: e.target.value }))
          }
          placeholder="Olhar da Agenda Crypto"
          className="min-h-[110px] rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />


        <textarea
          value={editForm.internal_notes || ""}
          onChange={(e) =>
            setEditForm((prev) => ({ ...prev, internal_notes: e.target.value }))
          }
          placeholder="Observações internas"
          className="min-h-[110px] rounded-xl bg-white/10 px-4 py-3 text-white outline-none md:col-span-2"
        />
      </div>

    <div className="mt-4 flex flex-wrap gap-3">
      <button
        onClick={() => saveSubmissionEdits(submission.id)}
        disabled={loadingId === submission.id}
        className="rounded-full bg-[#19B5C9] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
      >
        Salvar alterações
      </button>

      <button
        onClick={cancelEditing}
        className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
      >
        Cancelar
      </button>
    </div>
  </div>
)}

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApproveEvent(submission.id)}
                      disabled={loadingId === submission.id}
                      className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black disabled:opacity-60"
                    >
                      {loadingId === submission.id ? "Aprovando..." : "Aprovar"}
                    </button>

                    <button
                      onClick={() => handleRejectSubmission(submission.id)}
                      disabled={loadingId === submission.id}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => startEditing(submission)}
                      disabled={loadingId === submission.id}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      Editar
                    </button>

                    {whatsappHref && (
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-[#19B5C9] px-5 py-3 text-sm font-bold text-black"
                      >
                        Falar no WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              );
            })
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
                    onClick={() => handleApproveManualEvent(event.id)}
                    disabled={loadingId === event.id}
                    className="mt-4 rounded-full bg-[#19B5C9] px-4 py-2 text-sm font-bold text-black disabled:opacity-60"
                  >
                    {loadingId === event.id ? "Aprovando..." : "Aprovar evento"}
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
            {latestLeads.length === 0 ? (
              <p className="text-sm text-white/60">
                Nenhum lead recebido ainda.
              </p>
            ) : (
              latestLeads.map((lead) => {
                const whatsappHref = lead.whatsapp
                  ? `https://wa.me/55${lead.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Olá, ${lead.contact_name}! Vi seu contato na Agenda Crypto e queria continuar essa conversa.`
                    )}`
                  : null;

                return (
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

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <select
                        value={leadStatuses[lead.id] || "new"}
                        onChange={(e) =>
                          handleLeadStatusChange(lead.id, e.target.value)
                        }
                        className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white outline-none"
                      >
                        <option value="new">novo</option>
                        <option value="contacted">contatado</option>
                        <option value="negotiating">negociação</option>
                        <option value="closed">fechado</option>
                        <option value="lost">perdido</option>
                      </select>

                      <span className="text-xs text-white/45">
                        Status atual: {getLeadStatusLabel(leadStatuses[lead.id])}
                      </span>

                      {whatsappHref && (
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-[#19B5C9] px-4 py-2 text-sm font-bold text-black"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
