"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Intelligence = Record<string, unknown> & { id?: string; event_id?: string };
type Edition = Record<string, unknown> & {
  id: string; title: string; slug: string; start_date: string; end_date?: string | null;
  city?: string | null; country?: string | null; image_url?: string | null; series_id?: string | null;
  intelligence: Intelligence | null;
  child_events: Array<{ id: string; title: string; slug: string; start_date: string; published: boolean }>;
};
type EventSeries = Record<string, unknown> & {
  id: string; name: string; slug: string; description?: string | null; image_url?: string | null;
  origin_city?: string | null; origin_country?: string | null; editions: Edition[];
};
type HubData = { series: EventSeries[]; ungrouped_events: Edition[] };

const seriesFields = [
  ["name", "Nome do evento"], ["slug", "Slug"], ["description", "Sobre o evento"],
  ["organizer_name", "Organizador"], ["organizer_url", "Site do organizador"],
  ["official_url", "Site oficial"], ["image_url", "Imagem / logo"],
  ["origin_city", "Cidade de origem"], ["origin_country", "País de origem"],
  ["cadence", "Periodicidade"], ["main_focus", "Foco principal"], ["audience", "Público recorrente"],
  ["internal_notes", "Notas internas"],
] as const;

const eventFields = [
  ["title", "Título da edição"], ["slug", "Slug"], ["start_date", "Data inicial"],
  ["end_date", "Data final"], ["event_time", "Horário"], ["city", "Cidade"],
  ["country", "País"], ["venue", "Local"], ["category", "Categoria"],
  ["event_type", "Tipo"], ["audience", "Público"], ["registration_url", "Link de inscrição"],
  ["source_url", "Fonte oficial"], ["image_url", "Imagem"], ["short_description", "Descrição curta"],
  ["description", "Descrição completa"],
] as const;

const intelligenceTextFields = [
  ["organizer_name", "Organizador nesta edição"], ["organizer_url", "URL do organizador"],
  ["organizer_relevance", "Relevância do organizador"], ["edition_number", "Número da edição"],
  ["event_history", "Histórico"], ["event_positioning", "Posicionamento"],
  ["regional_context", "Contexto regional"], ["ecosystem_context", "Contexto do ecossistema"],
  ["why_it_matters", "Por que importa"], ["who_should_go", "Quem deve ir"],
  ["who_should_skip", "Quem pode não aproveitar"], ["business_opportunity", "Oportunidade comercial"],
  ["networking_opportunity", "Oportunidade de networking"], ["editorial_angle", "Ângulo editorial"],
  ["agenda_take", "Olhar da Agenda"], ["research_confidence", "Confiança da pesquisa"],
  ["research_status", "Status da pesquisa"], ["research_notes", "Lacunas e notas"],
] as const;

const intelligenceJsonFields = [
  ["key_speakers", "Speakers"], ["key_companies", "Empresas"],
  ["key_institutions", "Instituições"], ["sponsors", "Patrocinadores"], ["partners", "Parceiros"],
  ["market_signals", "Sinais de mercado"], ["notable_announcements", "Anúncios relevantes"],
  ["competitive_events", "Eventos comparáveis"], ["side_events", "Side events (dados editoriais)"],
  ["related_news", "Notícias relacionadas"], ["relevant_links", "Links relevantes"],
  ["research_sources", "Fontes da pesquisa"],
] as const;

function Field({ label, value, onChange, multiline = false, mono = false }: {
  label: string; value: unknown; onChange: (value: string) => void; multiline?: boolean; mono?: boolean;
}) {
  const className = `mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#19B5C9]/70 ${mono ? "font-mono text-xs" : ""}`;
  return (
    <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/45">
      {label}
      {multiline ? (
        <textarea className={`${className} min-h-28 resize-y normal-case tracking-normal`} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={`${className} normal-case tracking-normal`} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function filled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === "object") return Object.keys(value).length > 0;
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function editionScore(edition: Edition) {
  const intel = edition.intelligence || {};
  const values = [edition.description, edition.audience, intel.organizer_name, intel.event_history,
    intel.key_speakers, intel.key_companies, intel.sponsors, intel.main_topics, intel.why_it_matters,
    intel.business_opportunity, intel.research_sources, intel.research_confidence];
  return Math.round(values.filter(filled).length / values.length * 100);
}

function yearOf(edition: Edition) {
  return edition.start_date ? new Date(`${edition.start_date}T12:00:00`).getFullYear() : "Edição";
}

export default function EventIntelligenceHub() {
  const [access, setAccess] = useState<"loading" | "denied" | "admin">("loading");
  const [token, setToken] = useState("");
  const [data, setData] = useState<HubData>({ series: [], ungrouped_events: [] });
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);
  const [selectedEditionId, setSelectedEditionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [seriesDraft, setSeriesDraft] = useState<Record<string, unknown>>({});
  const [eventDraft, setEventDraft] = useState<Record<string, unknown>>({});
  const [intelligenceDraft, setIntelligenceDraft] = useState<Record<string, unknown>>({});
  const [jsonDrafts, setJsonDrafts] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newSeries, setNewSeries] = useState({ name: "", slug: "", event_id: "" });

  const request = useCallback(async (path: string, init?: RequestInit) => {
    const response = await fetch(path, {
      ...init,
      cache: "no-store",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init?.headers || {}) },
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Não foi possível concluir a ação.");
    return payload;
  }, [token]);

  const load = useCallback(async () => {
    if (!token) return;
    const payload = await request("/api/admin/event-intelligence");
    setData(payload);
    setSelectedSeriesId((current) => current || payload.series[0]?.id || null);
  }, [request, token]);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data: sessionData }) => {
      const refreshed = sessionData.session ? await supabase.auth.refreshSession() : null;
      const session = refreshed?.data.session || sessionData.session;
      if (!active) return;
      if (!session || session.user.app_metadata?.role !== "admin") return setAccess("denied");
      setToken(session.access_token);
      setAccess("admin");
    });
    return () => { active = false; };
  }, []);

  useEffect(() => { if (token) void load().catch(() => setAccess("denied")); }, [load, token]);

  const selectedSeries = data.series.find((item) => item.id === selectedSeriesId) || null;
  const selectedEdition = selectedSeries?.editions.find((item) => item.id === selectedEditionId) || null;

  useEffect(() => {
    if (!selectedSeries) return;
    setSeriesDraft({ ...selectedSeries });
    setSelectedEditionId(null);
  }, [selectedSeriesId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!selectedEdition) return;
    const intelligence = selectedEdition.intelligence || {};
    setEventDraft({ ...selectedEdition });
    setIntelligenceDraft({ ...intelligence });
    setJsonDrafts(Object.fromEntries(intelligenceJsonFields.map(([key]) => [key, JSON.stringify(intelligence[key] || [], null, 2)])));
  }, [selectedEditionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredSeries = useMemo(() => {
    const query = search.toLocaleLowerCase("pt-BR").trim();
    return data.series.filter((item) => !query || `${item.name} ${item.origin_city || ""} ${item.origin_country || ""}`.toLocaleLowerCase("pt-BR").includes(query));
  }, [data.series, search]);

  async function saveSeries() {
    if (!selectedSeries) return;
    setBusy(true); setMessage(null);
    try {
      await request("/api/admin/event-intelligence", { method: "PATCH", body: JSON.stringify({ action: "update_series", series_id: selectedSeries.id, series: seriesDraft }) });
      await load(); setMessage("Visão geral atualizada.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao salvar."); }
    finally { setBusy(false); }
  }

  async function saveEdition() {
    if (!selectedEdition) return;
    setBusy(true); setMessage(null);
    try {
      const parsed = { ...intelligenceDraft };
      for (const [key] of intelligenceJsonFields) parsed[key] = JSON.parse(jsonDrafts[key] || "[]");
      const topics = intelligenceDraft.main_topics;
      parsed.main_topics = Array.isArray(topics) ? topics : String(topics || "").split(",").map((item) => item.trim()).filter(Boolean);
      if (parsed.edition_number) parsed.edition_number = Number(parsed.edition_number);
      await request("/api/admin/event-intelligence", { method: "PATCH", body: JSON.stringify({ action: "update_edition", event_id: selectedEdition.id, event: eventDraft, intelligence: parsed }) });
      await load(); setMessage("Edição e inteligência atualizadas.");
    } catch (error) { setMessage(error instanceof SyntaxError ? "Revise os campos JSON: há um formato inválido." : error instanceof Error ? error.message : "Erro ao salvar."); }
    finally { setBusy(false); }
  }

  async function linkEdition(eventId: string) {
    if (!selectedSeries) return;
    setBusy(true);
    try {
      await request("/api/admin/event-intelligence", { method: "PATCH", body: JSON.stringify({ action: "link_edition", series_id: selectedSeries.id, event_id: eventId }) });
      await load(); setMessage("Edição vinculada ao evento-mãe.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao vincular."); }
    finally { setBusy(false); }
  }

  async function createSeries() {
    setBusy(true); setMessage(null);
    try {
      const payload = await request("/api/admin/event-intelligence", { method: "POST", body: JSON.stringify({ series: { name: newSeries.name, slug: newSeries.slug }, event_id: newSeries.event_id || undefined }) });
      await load(); setSelectedSeriesId(payload.series.id); setShowCreate(false); setNewSeries({ name: "", slug: "", event_id: "" });
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao criar."); }
    finally { setBusy(false); }
  }

  if (access === "loading") return <main className="min-h-screen bg-[#08080C] px-6 py-16 text-white">Preparando a Central de Inteligência…</main>;
  if (access === "denied") return <main className="min-h-screen bg-[#08080C] px-6 py-16 text-white"><div className="mx-auto max-w-xl rounded-3xl border border-white/10 p-8"><h1 className="text-3xl font-black">Acesso administrativo necessário</h1><Link href="/admin" className="mt-6 inline-flex rounded-full bg-[#FFD600] px-5 py-3 font-bold text-black">Voltar</Link></div></main>;

  return (
    <main className="min-h-screen bg-[#08080C] text-white">
      <header className="border-b border-white/10 bg-[#0D0D12] px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-[#19B5C9]"><Link href="/admin">Admin</Link><span className="text-white/20">/</span><span>Inteligência</span></div><h1 className="mt-2 text-3xl font-black">Central de Inteligência de Eventos</h1><p className="mt-1 text-sm text-white/50">Uma visão permanente do evento e todas as suas edições.</p></div>
          <button onClick={() => setShowCreate(true)} className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black">+ Novo evento-mãe</button>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#0D0D12] p-5 lg:min-h-[calc(100vh-118px)] lg:border-b-0 lg:border-r">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar evento, cidade ou país" className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none focus:border-[#19B5C9]/60" />
          <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/40"><span>Eventos-mãe</span><span>{filteredSeries.length}</span></div>
          <div className="mt-3 space-y-2">
            {filteredSeries.map((item) => {
              const scores = item.editions.map(editionScore);
              const average = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
              return <button key={item.id} onClick={() => setSelectedSeriesId(item.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selectedSeriesId === item.id ? "border-[#19B5C9]/60 bg-[#19B5C9]/10" : "border-white/8 bg-white/[0.025] hover:border-white/20"}`}><div className="flex items-start justify-between gap-3"><strong className="text-sm">{item.name}</strong><span className="rounded-full bg-white/8 px-2 py-1 text-[10px] text-white/55">{average}%</span></div><p className="mt-2 text-xs text-white/40">{item.editions.length} {item.editions.length === 1 ? "edição" : "edições"} · {[item.origin_city, item.origin_country].filter(Boolean).join(", ") || "Origem não informada"}</p></button>;
            })}
          </div>
          <div className="mt-7 rounded-2xl border border-dashed border-white/10 p-4"><p className="text-xs font-bold uppercase tracking-[0.14em] text-white/45">Sem evento-mãe</p><p className="mt-2 text-2xl font-black">{data.ungrouped_events.length}</p><p className="mt-1 text-xs text-white/40">edições disponíveis para vincular</p></div>
        </aside>

        <section className="min-w-0 p-5 lg:p-8">
          {selectedSeries ? <>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#19B5C9]">Evento permanente</p><h2 className="mt-2 text-4xl font-black">{selectedSeries.name}</h2><p className="mt-3 max-w-3xl text-sm leading-6 text-white/55">{String(selectedSeries.description || "A descrição geral ainda não foi preenchida.")}</p></div><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-black/25 p-4"><span className="text-xs text-white/40">Edições</span><strong className="mt-1 block text-2xl">{selectedSeries.editions.length}</strong></div><div className="rounded-2xl bg-black/25 p-4"><span className="text-xs text-white/40">Side events</span><strong className="mt-1 block text-2xl">{selectedSeries.editions.reduce((sum, item) => sum + item.child_events.length, 0)}</strong></div></div></div>
            </div>

            <div className="mt-6 flex gap-2 overflow-x-auto border-b border-white/10 pb-px">
              <button onClick={() => setSelectedEditionId(null)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${!selectedEditionId ? "border-[#FFD600] text-white" : "border-transparent text-white/45"}`}>Visão geral</button>
              {[...selectedSeries.editions].sort((a,b) => b.start_date.localeCompare(a.start_date)).map((edition) => <button key={edition.id} onClick={() => setSelectedEditionId(edition.id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold ${selectedEditionId === edition.id ? "border-[#FFD600] text-white" : "border-transparent text-white/45"}`}>{yearOf(edition)} <span className="ml-1 text-xs font-normal opacity-55">{editionScore(edition)}%</span></button>)}
            </div>

            {message ? <div className="mt-5 rounded-2xl border border-[#19B5C9]/25 bg-[#19B5C9]/10 px-4 py-3 text-sm text-[#8EEAF5]">{message}</div> : null}

            {!selectedEdition ? <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"><div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Ficha permanente</p><h3 className="mt-2 text-xl font-black">Visão geral do evento</h3></div><button disabled={busy} onClick={saveSeries} className="rounded-full bg-[#19B5C9] px-5 py-2.5 text-sm font-black text-black disabled:opacity-50">{busy ? "Salvando…" : "Salvar"}</button></div><div className="mt-6 grid gap-5 md:grid-cols-2">{seriesFields.map(([key,label]) => <div key={key} className={key === "description" || key === "internal_notes" || key === "audience" ? "md:col-span-2" : ""}><Field label={label} value={seriesDraft[key]} multiline={["description","internal_notes","audience"].includes(key)} onChange={(value) => setSeriesDraft((draft) => ({ ...draft, [key]: value }))} /></div>)}</div></div><div className="space-y-5"><div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><h3 className="font-black">Vincular outra edição</h3><p className="mt-2 text-xs leading-5 text-white/45">Escolha um evento já cadastrado. Ele aparecerá como uma nova aba anual.</p><select className="mt-4 w-full rounded-xl border border-white/10 bg-[#111118] px-3 py-3 text-sm" defaultValue="" onChange={(event) => { if (event.target.value) void linkEdition(event.target.value); }}><option value="">Selecionar evento…</option>{data.ungrouped_events.map((event) => <option key={event.id} value={event.id}>{yearOf(event)} · {event.title}</option>)}</select></div><div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><h3 className="font-black">Linha do tempo</h3><div className="mt-4 space-y-3">{[...selectedSeries.editions].sort((a,b) => a.start_date.localeCompare(b.start_date)).map((edition) => <button key={edition.id} onClick={() => setSelectedEditionId(edition.id)} className="flex w-full items-center justify-between rounded-xl bg-black/20 p-3 text-left"><span><strong className="block text-sm">{yearOf(edition)}</strong><span className="text-xs text-white/40">{edition.city || "Cidade não informada"}</span></span><span className="text-xs text-[#19B5C9]">{editionScore(edition)}%</span></button>)}</div></div></div></div> :
            <div className="mt-6 space-y-6"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#19B5C9]">Edição {yearOf(selectedEdition)}</p><h3 className="mt-2 text-2xl font-black">{selectedEdition.title}</h3></div><div className="flex items-center gap-3"><span className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/55">Completude {editionScore(selectedEdition)}%</span><button disabled={busy} onClick={saveEdition} className="rounded-full bg-[#FFD600] px-5 py-2.5 text-sm font-black text-black disabled:opacity-50">{busy ? "Salvando…" : "Salvar edição"}</button></div></div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><h4 className="text-lg font-black">Dados da edição</h4><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{eventFields.map(([key,label]) => <div key={key} className={["description","short_description","audience"].includes(key) ? "md:col-span-2 xl:col-span-3" : ""}><Field label={label} value={eventDraft[key]} multiline={["description","short_description","audience"].includes(key)} onChange={(value) => setEventDraft((draft) => ({ ...draft, [key]: value }))} /></div>)}</div></div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><h4 className="text-lg font-black">Análise e inteligência editorial</h4><div className="mt-5 grid gap-5 md:grid-cols-2">{intelligenceTextFields.map(([key,label]) => <div key={key} className={!['edition_number','research_confidence','research_status','organizer_name','organizer_url'].includes(key) ? "md:col-span-2" : ""}><Field label={label} value={intelligenceDraft[key]} multiline={!['edition_number','research_confidence','research_status','organizer_name','organizer_url'].includes(key)} onChange={(value) => setIntelligenceDraft((draft) => ({ ...draft, [key]: value }))} /></div>)}<div className="md:col-span-2"><Field label="Temas principais (separados por vírgula)" value={Array.isArray(intelligenceDraft.main_topics) ? intelligenceDraft.main_topics.join(", ") : intelligenceDraft.main_topics} onChange={(value) => setIntelligenceDraft((draft) => ({ ...draft, main_topics: value }))} /></div></div></div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div><h4 className="text-lg font-black">Pessoas, empresas e evidências</h4><p className="mt-1 text-xs text-white/40">Campos estruturados em JSON para preservar nomes, cargos, empresas, URLs e fontes.</p></div><div className="mt-5 grid gap-5 xl:grid-cols-2">{intelligenceJsonFields.map(([key,label]) => <Field key={key} label={label} value={jsonDrafts[key]} mono multiline onChange={(value) => setJsonDrafts((draft) => ({ ...draft, [key]: value }))} />)}</div></div>
              {selectedEdition.child_events.length ? <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><h4 className="text-lg font-black">Eventos ligados a esta edição</h4><div className="mt-4 grid gap-3 md:grid-cols-2">{selectedEdition.child_events.map((event) => <div key={event.id} className="rounded-2xl bg-black/20 p-4"><strong className="text-sm">{event.title}</strong><p className="mt-1 text-xs text-white/40">{event.start_date} · {event.published ? "Publicado" : "Rascunho"}</p></div>)}</div></div> : null}
            </div>}
          </> : <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-white/40">Crie ou selecione um evento-mãe para começar.</div>}
        </section>
      </div>

      {showCreate ? <div className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-5"><div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#15151C] p-6 shadow-2xl"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#19B5C9]">Novo cadastro</p><h2 className="mt-2 text-2xl font-black">Criar evento-mãe</h2></div><button onClick={() => setShowCreate(false)} className="rounded-full border border-white/10 px-3 py-2 text-sm">Fechar</button></div><div className="mt-6 space-y-4"><Field label="Nome" value={newSeries.name} onChange={(name) => setNewSeries((draft) => ({ ...draft, name, slug: draft.slug || name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }))} /><Field label="Slug" value={newSeries.slug} onChange={(slug) => setNewSeries((draft) => ({ ...draft, slug }))} /><label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/45">Primeira edição (opcional)<select value={newSeries.event_id} onChange={(event) => setNewSeries((draft) => ({ ...draft, event_id: event.target.value }))} className="mt-2 w-full rounded-xl border border-white/10 bg-[#111118] px-3 py-3 text-sm text-white normal-case tracking-normal"><option value="">Vincular depois</option>{data.ungrouped_events.map((event) => <option key={event.id} value={event.id}>{yearOf(event)} · {event.title}</option>)}</select></label></div><button disabled={busy || !newSeries.name || !newSeries.slug} onClick={createSeries} className="mt-6 w-full rounded-full bg-[#FFD600] px-5 py-3 font-black text-black disabled:opacity-40">{busy ? "Criando…" : "Criar evento-mãe"}</button></div></div> : null}
    </main>
  );
}
