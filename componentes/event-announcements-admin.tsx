"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  EventAnnouncement,
  EventAnnouncementDuplicate,
  EventAnnouncementSource,
  EventAnnouncementStatus,
} from "@/lib/event-announcement";
import { isVerificationStale } from "@/lib/event-announcement-admin";
import { supabase } from "@/lib/supabase/client";

type EditableAnnouncement = Omit<EventAnnouncement, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

const statusLabels: Record<EventAnnouncementStatus, string> = {
  draft: "Rascunho",
  review: "Em revisão",
  published: "Publicado",
  promoted: "Promovido",
  archived: "Arquivado",
};

const sourceLabels: Record<EventAnnouncementSource["type"], string> = {
  official: "Oficial",
  press: "Imprensa",
  social: "Rede social",
  other: "Outra",
};

function emptyAnnouncement(): EditableAnnouncement {
  return {
    title: "",
    slug: "",
    organizer: "",
    country: "",
    city: null,
    expected_year: new Date().getUTCFullYear() + 1,
    expected_period: null,
    official_url: "",
    sources: [],
    summary: null,
    agenda_insight: null,
    internal_notes: null,
    image_url: null,
    confidence: "low",
    status: "draft",
    last_verified_at: null,
    next_verification_at: null,
    published_at: null,
    promoted_event_id: null,
  };
}

function dateTimeLocal(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Nunca";
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function EventAnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState<EventAnnouncement[]>([]);
  const [filter, setFilter] = useState<EventAnnouncementStatus | "all">("all");
  const [form, setForm] = useState<EditableAnnouncement | null>(null);
  const [preview, setPreview] = useState<EditableAnnouncement | null>(null);
  const [duplicates, setDuplicates] = useState<EventAnnouncementDuplicate[]>([]);
  const [confirmedDuplicates, setConfirmedDuplicates] = useState(false);
  const [pendingSave, setPendingSave] = useState<{
    action: string;
    targetStatus: EventAnnouncementStatus;
  } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [access, setAccess] = useState<"loading" | "admin" | "denied">("loading");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const load = useCallback(async (accessToken: string) => {
    const response = await fetch("/api/admin/event-announcements", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (response.status === 401 || response.status === 403) {
      setAccess("denied");
      setAnnouncements([]);
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Não foi possível carregar o Vem aí.");
    setAnnouncements(data.announcements);
  }, []);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const session = data.session;
      if (!session || session.user.app_metadata?.role !== "admin") {
        setAnnouncements([]);
        setAccess("denied");
        return;
      }
      setToken(session.access_token);
      try {
        await load(session.access_token);
        if (active) setAccess("admin");
      } catch (error) {
        if (active) {
          setErrors([error instanceof Error ? error.message : "Erro ao carregar dados."]);
          setAccess("admin");
        }
      }
    });
    return () => { active = false; };
  }, [load]);

  const visible = useMemo(
    () => announcements.filter((item) => filter === "all" || item.status === filter),
    [announcements, filter]
  );

  function update<K extends keyof EditableAnnouncement>(key: K, value: EditableAnnouncement[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
    setConfirmedDuplicates(false);
  }

  function updateSource(index: number, patch: Partial<EventAnnouncementSource>) {
    if (!form) return;
    update("sources", form.sources.map((source, i) => (i === index ? { ...source, ...patch } : source)));
  }

  async function requestSave(
    announcement: EditableAnnouncement,
    targetStatus: EventAnnouncementStatus = announcement.status,
    action = "save",
    forceDuplicates = false
  ) {
    if (!token) return;
    setBusy(true);
    setMessage(null);
    setErrors([]);
    try {
      const response = await fetch("/api/admin/event-announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action,
          announcement,
          targetStatus,
          confirmDuplicates: forceDuplicates,
        }),
      });
      const data = await response.json();
      if (response.status === 409) {
        setDuplicates(data.duplicates || []);
        setConfirmedDuplicates(true);
        setPendingSave({ action, targetStatus });
        setForm({ ...announcement, status: targetStatus });
        return;
      }
      if (!response.ok) {
        setErrors(Array.isArray(data.details) ? data.details : [data.error || "Não foi possível salvar."]);
        return;
      }
      setDuplicates(data.duplicates || []);
      setConfirmedDuplicates(false);
      setPendingSave(null);
      setForm(null);
      setPreview(null);
      setMessage(action === "verify" ? "Verificação registrada." : "Anúncio atualizado com sucesso.");
      await load(token);
    } catch {
      setErrors(["Falha de conexão. O preenchimento foi preservado."]);
    } finally {
      setBusy(false);
    }
  }

  if (access === "loading") {
    return <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 text-white/60">Validando acesso ao Vem aí…</section>;
  }

  if (access === "denied") {
    return (
      <section className="rounded-[32px] border border-red-300/20 bg-red-300/[0.06] p-6" aria-live="polite">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-200">Vem aí</p>
        <h2 className="mt-2 text-2xl font-black">Acesso negado</h2>
        <p className="mt-2 text-sm text-white/60">Entre com uma conta que tenha a função administrativa.</p>
      </section>
    );
  }

  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#19B5C9]">Curadoria</p>
          <h2 className="mt-2 text-2xl font-black">Vem aí</h2>
          <p className="mt-2 text-sm text-white/55">Anúncios preliminares, separados dos eventos confirmados.</p>
        </div>
        <button onClick={() => { setForm(emptyAnnouncement()); setDuplicates([]); setErrors([]); setPendingSave(null); }} className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black">
          Novo anúncio
        </button>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {(["all", "draft", "review", "published", "promoted", "archived"] as const).map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${filter === status ? "bg-[#19B5C9] text-black" : "bg-white/[0.06] text-white/70"}`}>
            {status === "all" ? "Todos" : statusLabels[status]}
          </button>
        ))}
      </div>

      {message && <p className="mt-4 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-200" role="status">{message}</p>}
      {errors.length > 0 && (
        <div className="mt-4 rounded-xl bg-red-400/10 p-3 text-sm text-red-100" role="alert">
          {errors.map((error) => <p key={error}>{error}</p>)}
        </div>
      )}

      <div className="mt-6 space-y-3">
        {visible.length === 0 ? <p className="text-sm text-white/55">Nenhum anúncio neste status.</p> : visible.map((item) => {
          const stale = isVerificationStale(item);
          return (
            <article key={item.id} className="rounded-2xl border border-white/10 bg-black/15 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white/[0.07] px-3 py-1 text-xs">{statusLabels[item.status]}</span>
                    <span className={`rounded-full px-3 py-1 text-xs ${stale ? "bg-amber-300/15 text-amber-200" : "bg-emerald-300/15 text-emerald-200"}`}>
                      {stale ? "Verificação pendente" : "Verificado"}
                    </span>
                    <span className="rounded-full bg-[#19B5C9]/10 px-3 py-1 text-xs text-[#73d7e4]">Confiança {item.confidence}</span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-white/55">{item.organizer} · {item.country} · {item.expected_period ? `${item.expected_period}, ` : ""}{item.expected_year}</p>
                  <p className="mt-2 text-xs text-white/40">Última verificação: {formatDate(item.last_verified_at)} · Atualizado: {formatDate(item.updated_at)}</p>
                  <a href={item.official_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-[#19B5C9] underline">Fonte principal</a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.status !== "promoted" && <button onClick={() => { setForm({ ...item }); setDuplicates([]); setErrors([]); setPendingSave(null); }} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold">Editar</button>}
                  <button onClick={() => setPreview(item)} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold">Pré-visualizar</button>
                  {item.status !== "published" && item.status !== "promoted" && <button disabled={busy} onClick={() => requestSave(item, "published")} className="rounded-full bg-[#19B5C9] px-4 py-2 text-xs font-bold text-black disabled:opacity-50">Publicar</button>}
                  {item.status === "published" && <button disabled={busy} onClick={() => requestSave(item, "review")} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold disabled:opacity-50">Ocultar</button>}
                  {item.status !== "archived" && item.status !== "promoted" && <button disabled={busy} onClick={() => requestSave(item, "archived")} className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-red-200 disabled:opacity-50">Arquivar</button>}
                  {item.status !== "promoted" && <button disabled={busy} onClick={() => requestSave(item, item.status, "verify")} className="rounded-full border border-emerald-300/20 px-4 py-2 text-xs font-semibold text-emerald-200 disabled:opacity-50">Registrar verificação</button>}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label="Editar anúncio">
          <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[#252525] p-4 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs uppercase tracking-[0.25em] text-[#19B5C9]">Vem aí</p><h3 className="mt-2 text-2xl font-black">{form.id ? "Editar anúncio" : "Criar anúncio"}</h3></div>
              <button onClick={() => setForm(null)} className="rounded-full bg-white/[0.07] px-4 py-2 text-sm">Fechar</button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Título"><input value={form.title} onChange={(e) => update("title", e.target.value)} className="field" /></Field>
              <Field label="Organizador"><input value={form.organizer} onChange={(e) => update("organizer", e.target.value)} className="field" /></Field>
              <Field label="País"><input value={form.country} onChange={(e) => update("country", e.target.value)} className="field" /></Field>
              <Field label="Cidade (somente se confirmada)"><input value={form.city || ""} onChange={(e) => update("city", e.target.value || null)} className="field" /></Field>
              <Field label="Ano esperado"><input type="number" value={form.expected_year} onChange={(e) => update("expected_year", Number(e.target.value))} className="field" /></Field>
              <Field label="Período esperado"><input value={form.expected_period || ""} onChange={(e) => update("expected_period", e.target.value || null)} placeholder="Ex.: segundo semestre" className="field" /></Field>
              <Field label="URL oficial"><input type="url" value={form.official_url} onChange={(e) => update("official_url", e.target.value)} className="field" /></Field>
              <Field label="Imagem (URL)"><input type="url" value={form.image_url || ""} onChange={(e) => update("image_url", e.target.value || null)} className="field" /></Field>
              <Field label="Confiança"><select value={form.confidence} onChange={(e) => update("confidence", e.target.value as EditableAnnouncement["confidence"])} className="field"><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></Field>
              <Field label="Próxima verificação"><input type="datetime-local" value={dateTimeLocal(form.next_verification_at)} onChange={(e) => update("next_verification_at", e.target.value ? new Date(e.target.value).toISOString() : null)} className="field" /></Field>
              <Field label="Resumo factual" wide><textarea value={form.summary || ""} onChange={(e) => update("summary", e.target.value || null)} className="field min-h-28" /></Field>
              <Field label="Olhar da Agenda Crypto" wide><textarea value={form.agenda_insight || ""} onChange={(e) => update("agenda_insight", e.target.value || null)} className="field min-h-28" /></Field>
              <Field label="Notas internas (nunca públicas)" wide><textarea value={form.internal_notes || ""} onChange={(e) => update("internal_notes", e.target.value || null)} className="field min-h-28" /></Field>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between"><h4 className="font-bold">Fontes estruturadas</h4><button onClick={() => update("sources", [...form.sources, { url: "", type: "official", date: new Date().toISOString().slice(0, 10) }])} className="rounded-full bg-white/[0.07] px-3 py-2 text-xs">Adicionar fonte</button></div>
              <div className="mt-3 space-y-3">{form.sources.map((source, index) => (
                <div key={`${index}-${source.url}`} className="grid gap-2 md:grid-cols-[1fr_150px_150px_auto]">
                  <input type="url" value={source.url} onChange={(e) => updateSource(index, { url: e.target.value })} placeholder="https://…" className="field" />
                  <select value={source.type} onChange={(e) => updateSource(index, { type: e.target.value as EventAnnouncementSource["type"] })} className="field">{Object.entries(sourceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
                  <input type="date" value={source.date} onChange={(e) => updateSource(index, { date: e.target.value })} className="field" />
                  <button onClick={() => update("sources", form.sources.filter((_, i) => i !== index))} className="rounded-xl bg-red-300/10 px-3 text-xs text-red-200">Remover</button>
                </div>
              ))}</div>
            </div>

            <ConfirmationChecklist form={form} />
            {duplicates.length > 0 && <DuplicateWarning duplicates={duplicates} />}
            <div className="mt-6 flex flex-wrap gap-3">
              <button disabled={busy} onClick={() => requestSave(form, pendingSave?.targetStatus || form.status, pendingSave?.action || "save", confirmedDuplicates)} className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black disabled:opacity-50">{busy ? "Salvando…" : confirmedDuplicates ? "Salvar mesmo assim" : "Salvar"}</button>
              <button onClick={() => setPreview(form)} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold">Pré-visualizar</button>
            </div>
          </div>
        </div>
      )}

      {preview && <Preview announcement={preview} onClose={() => setPreview(null)} />}
      <style jsx global>{`.field{width:100%;border-radius:.75rem;background:rgba(255,255,255,.07);padding:.75rem 1rem;color:white;outline:none}.field:focus{box-shadow:0 0 0 2px #19B5C9}.field option{color:black}`}</style>
    </section>
  );
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) {
  return <label className={`text-sm text-white/65 ${wide ? "md:col-span-2" : ""}`}><span className="mb-2 block font-semibold text-white">{label}</span>{children}</label>;
}

function ConfirmationChecklist({ form }: { form: EditableAnnouncement }) {
  const checks = [
    ["Título", Boolean(form.title)], ["Organizador", Boolean(form.organizer)], ["País", Boolean(form.country)],
    ["Ano atual ou futuro", form.expected_year >= new Date().getUTCFullYear()], ["Fonte oficial", form.sources.some((source) => source.type === "official" && source.url)],
  ] as const;
  return <div className="mt-5 rounded-2xl bg-white/[0.04] p-4"><h4 className="font-bold">Campos confirmados e pendentes</h4><div className="mt-3 flex flex-wrap gap-2">{checks.map(([label, ok]) => <span key={label} className={`rounded-full px-3 py-1 text-xs ${ok ? "bg-emerald-300/15 text-emerald-200" : "bg-amber-300/15 text-amber-200"}`}>{ok ? "Confirmado" : "Pendente"}: {label}</span>)}</div></div>;
}

function DuplicateWarning({ duplicates }: { duplicates: EventAnnouncementDuplicate[] }) {
  return <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/[0.08] p-4" role="alert"><h4 className="font-bold text-amber-100">Possíveis duplicatas</h4><p className="mt-1 text-sm text-white/60">Compare antes de salvar ou publicar.</p><ul className="mt-3 space-y-2 text-sm">{duplicates.map((item) => <li key={item.key}><strong>{item.title}</strong> <span className="text-white/50">em {item.table}; coincide: {item.matches.join(", ")}</span></li>)}</ul></div>;
}

function Preview({ announcement, onClose }: { announcement: EditableAnnouncement; onClose: () => void }) {
  return <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/85 p-4 sm:p-10" role="dialog" aria-modal="true" aria-label="Pré-visualização"><article className="mx-auto max-w-2xl overflow-hidden rounded-[28px] bg-white text-[#212121]">{announcement.image_url && <img src={announcement.image_url} alt="" className="h-56 w-full object-cover" />}{/* eslint-disable-line @next/next/no-img-element */}<div className="p-6 sm:p-8"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#138a99]">Vem aí · {announcement.expected_year}</p><h3 className="mt-3 text-3xl font-black">{announcement.title || "Título pendente"}</h3><p className="mt-2 text-sm text-black/55">{announcement.organizer} · {announcement.country}{announcement.city ? `, ${announcement.city}` : ""}</p>{announcement.summary && <p className="mt-6 leading-7">{announcement.summary}</p>}{announcement.agenda_insight && <div className="mt-6 rounded-2xl bg-[#212121] p-5 text-white"><p className="text-xs font-bold uppercase tracking-wider text-[#19B5C9]">Olhar da Agenda Crypto</p><p className="mt-2 leading-7 text-white/80">{announcement.agenda_insight}</p></div>}<div className="mt-6 flex justify-end"><button onClick={onClose} className="rounded-full bg-[#212121] px-5 py-3 text-sm font-bold text-white">Fechar prévia</button></div></div></article></div>;
}
