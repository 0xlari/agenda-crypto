"use client";

import { useEffect, useState } from "react";
import {
  buildEmptyEventIntelligencePayload,
  normalizeEventIntelligenceInput,
  type EventIntelligencePayload,
  type IntelligenceJsonItem,
} from "@/lib/event-intelligence";

type FieldDefinition = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

const textInputClass =
  "w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#19B5C9]/70";

const textareaClass =
  "min-h-[112px] w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 focus:border-[#19B5C9]/70";

function toDatetimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }

  return date.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString();
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5">
      <div className="mb-5">
        <h3 className="text-lg font-black text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const inputValue = value ?? "";

  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={inputValue}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder={placeholder}
          className={textareaClass}
        />
      ) : (
        <input
          value={inputValue}
          onChange={(event) => onChange(event.target.value || null)}
          placeholder={placeholder}
          className={textInputClass}
        />
      )}
    </label>
  );
}

function StringListEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  function updateItem(index: number, nextValue: string) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          {label}
        </p>
        <button
          type="button"
          onClick={() => onChange([...value, ""])}
          className="rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-3 py-2 text-xs font-bold text-[#19B5C9]"
        >
          Adicionar
        </button>
      </div>

      <div className="space-y-3">
        {value.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/40">
            Nenhum tópico adicionado.
          </p>
        ) : (
          value.map((item, index) => (
            <div key={`${label}-${index}`} className="flex gap-2">
              <input
                value={item}
                onChange={(event) => updateItem(index, event.target.value)}
                placeholder={placeholder}
                className={textInputClass}
              />
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="rounded-2xl border border-white/10 px-3 text-xs font-bold text-white/50 hover:text-white"
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StructuredListEditor({
  label,
  value,
  onChange,
  fields,
  emptyLabel = "Nenhum item adicionado.",
}: {
  label: string;
  value: IntelligenceJsonItem[];
  onChange: (value: IntelligenceJsonItem[]) => void;
  fields: FieldDefinition[];
  emptyLabel?: string;
}) {
  function addItem() {
    onChange([
      ...value,
      Object.fromEntries(fields.map((field) => [field.key, ""])),
    ]);
  }

  function updateItem(index: number, key: string, nextValue: string) {
    onChange(
      value.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: nextValue } : item
      )
    );
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
          {label}
        </p>
        <button
          type="button"
          onClick={addItem}
          className="rounded-full border border-[#FFD600]/30 bg-[#FFD600]/10 px-3 py-2 text-xs font-bold text-[#FFD600]"
        >
          Adicionar item
        </button>
      </div>

      <div className="space-y-4">
        {value.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-white/40">
            {emptyLabel}
          </p>
        ) : (
          value.map((item, index) => (
            <div
              key={`${label}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white/70">
                  Item {index + 1}
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/50 hover:text-white"
                >
                  Remover
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <label
                    key={field.key}
                    className={field.multiline ? "md:col-span-2" : undefined}
                  >
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
                      {field.label}
                    </span>
                    {field.multiline ? (
                      <textarea
                        value={item[field.key] ?? ""}
                        onChange={(event) =>
                          updateItem(index, field.key, event.target.value)
                        }
                        placeholder={field.placeholder}
                        className={textareaClass}
                      />
                    ) : (
                      <input
                        value={item[field.key] ?? ""}
                        onChange={(event) =>
                          updateItem(index, field.key, event.target.value)
                        }
                        placeholder={field.placeholder}
                        className={textInputClass}
                      />
                    )}
                  </label>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const peopleFields: FieldDefinition[] = [
  { key: "name", label: "Nome" },
  { key: "role", label: "Cargo/papel" },
  { key: "company", label: "Empresa" },
  {
    key: "why_relevant",
    label: "Por que é relevante",
    multiline: true,
  },
  { key: "source_url", label: "Fonte" },
];

const companyFields: FieldDefinition[] = [
  { key: "name", label: "Nome" },
  { key: "category", label: "Categoria" },
  {
    key: "why_relevant",
    label: "Por que é relevante",
    multiline: true,
  },
  { key: "source_url", label: "Fonte" },
];

const organizationFields: FieldDefinition[] = [
  { key: "name", label: "Nome" },
  { key: "category", label: "Categoria/papel" },
  { key: "url", label: "URL" },
  { key: "notes", label: "Observações", multiline: true },
];

const marketSignalFields: FieldDefinition[] = [
  { key: "signal", label: "Sinal" },
  { key: "strength", label: "Força do sinal" },
  { key: "evidence", label: "Evidência", multiline: true },
];

const announcementFields: FieldDefinition[] = [
  { key: "title", label: "Anúncio" },
  { key: "announced_at", label: "Data" },
  { key: "source_url", label: "Fonte" },
  { key: "description", label: "Descrição", multiline: true },
];

const competitiveEventFields: FieldDefinition[] = [
  { key: "name", label: "Evento" },
  { key: "date", label: "Data" },
  { key: "url", label: "URL" },
  { key: "relevance", label: "Relação competitiva", multiline: true },
];

const sideEventFields: FieldDefinition[] = [
  { key: "name", label: "Nome" },
  { key: "date", label: "Data" },
  { key: "url", label: "URL" },
  { key: "relationship", label: "Relação com o evento" },
];

const relatedNewsFields: FieldDefinition[] = [
  { key: "title", label: "Título" },
  { key: "url", label: "URL" },
  { key: "source", label: "Fonte" },
  { key: "published_at", label: "Publicado em" },
  { key: "relevance", label: "Relevância", multiline: true },
];

const linkFields: FieldDefinition[] = [
  { key: "title", label: "Título" },
  { key: "url", label: "URL" },
  { key: "source_type", label: "Tipo de fonte" },
  { key: "notes", label: "Notas", multiline: true },
];

const researchSourceFields: FieldDefinition[] = [
  { key: "title", label: "Título" },
  { key: "url", label: "URL" },
  { key: "source_type", label: "Tipo de fonte" },
  { key: "accessed_at", label: "Acessado em" },
  { key: "notes", label: "Notas", multiline: true },
];

export default function EventIntelligenceEditor({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  const [form, setForm] = useState<EventIntelligencePayload>(
    buildEmptyEventIntelligencePayload
  );
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadIntelligence() {
      setStatus("loading");
      setMessage(null);

      try {
        const response = await fetch(
          `/api/admin/event-intelligence?eventId=${encodeURIComponent(eventId)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erro ao carregar inteligência.");
        }

        if (!active) return;

        setForm(
          data.intelligence
            ? normalizeEventIntelligenceInput(data.intelligence)
            : buildEmptyEventIntelligencePayload()
        );
        setStatus("idle");
      } catch (error) {
        if (!active) return;

        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "Erro ao carregar inteligência."
        );
      }
    }

    loadIntelligence();

    return () => {
      active = false;
    };
  }, [eventId]);

  function updateField<Key extends keyof EventIntelligencePayload>(
    key: Key,
    value: EventIntelligencePayload[Key]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  async function handleSave() {
    setStatus("saving");
    setMessage(null);

    try {
      const response = await fetch("/api/admin/event-intelligence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          intelligence: form,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar inteligência.");
      }

      setForm(normalizeEventIntelligenceInput(data.intelligence));
      setStatus("saved");
      setMessage("Inteligência editorial salva.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Erro ao salvar inteligência."
      );
    }
  }

  const isBusy = status === "loading" || status === "saving";

  return (
    <div className="space-y-5">
      <div className="rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/10 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#19B5C9]">
          Inteligência editorial
        </p>
        <h3 className="mt-2 text-2xl font-black text-white">{eventTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Esta camada fica separada do cadastro base do evento e só aparece no
          admin enquanto não for conectada às páginas públicas.
        </p>
      </div>

      {message && (
        <p
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "error"
              ? "border-red-400/30 bg-red-400/10 text-red-100"
              : "border-[#19B5C9]/30 bg-[#19B5C9]/10 text-[#19B5C9]"
          }`}
        >
          {message}
        </p>
      )}

      {status === "loading" ? (
        <p className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm text-white/55">
          Carregando inteligência do evento...
        </p>
      ) : (
        <>
          <Section
            title="Identidade e histórico"
            description="Quem organiza, qual é o histórico e como o evento se posiciona no ecossistema."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Organizador"
                value={form.organizer_name}
                onChange={(value) => updateField("organizer_name", value)}
              />
              <Field
                label="URL do organizador"
                value={form.organizer_url}
                onChange={(value) => updateField("organizer_url", value)}
              />
              <Field
                label="Número da edição"
                value={form.edition_number ? String(form.edition_number) : null}
                onChange={(value) =>
                  updateField(
                    "edition_number",
                    value ? Math.max(1, Math.trunc(Number(value) || 0)) : null
                  )
                }
              />
              <Field
                label="Relevância do organizador"
                value={form.organizer_relevance}
                onChange={(value) => updateField("organizer_relevance", value)}
                multiline
              />
              <Field
                label="Histórico do evento"
                value={form.event_history}
                onChange={(value) => updateField("event_history", value)}
                multiline
              />
              <Field
                label="Posicionamento"
                value={form.event_positioning}
                onChange={(value) => updateField("event_positioning", value)}
                multiline
              />
            </div>
          </Section>

          <Section
            title="Pessoas, empresas e instituições"
            description="Mapeamento de quem dá sinal de qualidade, distribuição ou oportunidade comercial."
          >
            <div className="space-y-6">
              <StructuredListEditor
                label="Speakers ou pessoas-chave"
                value={form.key_speakers}
                onChange={(value) => updateField("key_speakers", value)}
                fields={peopleFields}
              />
              <StructuredListEditor
                label="Empresas-chave"
                value={form.key_companies}
                onChange={(value) => updateField("key_companies", value)}
                fields={companyFields}
              />
              <StructuredListEditor
                label="Instituições"
                value={form.key_institutions}
                onChange={(value) => updateField("key_institutions", value)}
                fields={organizationFields}
              />
              <StructuredListEditor
                label="Patrocinadores"
                value={form.sponsors}
                onChange={(value) => updateField("sponsors", value)}
                fields={organizationFields}
              />
              <StructuredListEditor
                label="Parceiros"
                value={form.partners}
                onChange={(value) => updateField("partners", value)}
                fields={organizationFields}
              />
            </div>
          </Section>

          <Section
            title="Temas e sinais"
            description="Assuntos, sinais de mercado e contexto competitivo que ajudam a explicar o momento do evento."
          >
            <div className="space-y-6">
              <StringListEditor
                label="Tópicos principais"
                value={form.main_topics}
                onChange={(value) => updateField("main_topics", value)}
                placeholder="Ex.: Bitcoin, DeFi, regulação..."
              />
              <StructuredListEditor
                label="Sinais de mercado"
                value={form.market_signals}
                onChange={(value) => updateField("market_signals", value)}
                fields={marketSignalFields}
              />
              <StructuredListEditor
                label="Anúncios relevantes"
                value={form.notable_announcements}
                onChange={(value) => updateField("notable_announcements", value)}
                fields={announcementFields}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Contexto regional"
                  value={form.regional_context}
                  onChange={(value) => updateField("regional_context", value)}
                  multiline
                />
                <Field
                  label="Contexto do ecossistema"
                  value={form.ecosystem_context}
                  onChange={(value) => updateField("ecosystem_context", value)}
                  multiline
                />
              </div>
              <StructuredListEditor
                label="Eventos concorrentes ou complementares"
                value={form.competitive_events}
                onChange={(value) => updateField("competitive_events", value)}
                fields={competitiveEventFields}
              />
            </div>
          </Section>

          <Section
            title="Leitura da Agenda"
            description="A análise editorial que transforma informação solta em orientação para o público."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Por que importa"
                value={form.why_it_matters}
                onChange={(value) => updateField("why_it_matters", value)}
                multiline
              />
              <Field
                label="Quem deveria ir"
                value={form.who_should_go}
                onChange={(value) => updateField("who_should_go", value)}
                multiline
              />
              <Field
                label="Quem talvez deva pular"
                value={form.who_should_skip}
                onChange={(value) => updateField("who_should_skip", value)}
                multiline
              />
              <Field
                label="Oportunidade de negócio"
                value={form.business_opportunity}
                onChange={(value) => updateField("business_opportunity", value)}
                multiline
              />
              <Field
                label="Oportunidade de networking"
                value={form.networking_opportunity}
                onChange={(value) => updateField("networking_opportunity", value)}
                multiline
              />
              <Field
                label="Ângulo editorial"
                value={form.editorial_angle}
                onChange={(value) => updateField("editorial_angle", value)}
                multiline
              />
              <div className="md:col-span-2">
                <Field
                  label="Olhar da Agenda Crypto"
                  value={form.agenda_take}
                  onChange={(value) => updateField("agenda_take", value)}
                  multiline
                />
              </div>
            </div>
          </Section>

          <Section
            title="Contexto do evento"
            description="Trilhas, side events, links e notícias que ajudam a explicar o entorno do evento."
          >
            <div className="space-y-6">
              <StructuredListEditor
                label="Side events ou trilhas relacionadas"
                value={form.side_events}
                onChange={(value) => updateField("side_events", value)}
                fields={sideEventFields}
              />
              <StructuredListEditor
                label="Notícias relacionadas"
                value={form.related_news}
                onChange={(value) => updateField("related_news", value)}
                fields={relatedNewsFields}
              />
              <StructuredListEditor
                label="Links relevantes"
                value={form.relevant_links}
                onChange={(value) => updateField("relevant_links", value)}
                fields={linkFields}
              />
            </div>
          </Section>

          <Section
            title="Pesquisa e confiabilidade"
            description="Controle interno de fontes, status da apuração e confiança editorial."
          >
            <div className="grid gap-4 md:grid-cols-3">
              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Status da pesquisa
                </span>
                <select
                  value={form.research_status}
                  onChange={(event) =>
                    updateField("research_status", event.target.value)
                  }
                  className={textInputClass}
                >
                  <option value="draft">Rascunho</option>
                  <option value="researching">Em pesquisa</option>
                  <option value="reviewed">Revisado</option>
                  <option value="ready">Pronto</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Confiança
                </span>
                <select
                  value={form.research_confidence ?? ""}
                  onChange={(event) =>
                    updateField("research_confidence", event.target.value || null)
                  }
                  className={textInputClass}
                >
                  <option value="">Não definida</option>
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                  Atualizado em
                </span>
                <input
                  type="datetime-local"
                  value={toDatetimeLocal(form.research_updated_at)}
                  onChange={(event) =>
                    updateField(
                      "research_updated_at",
                      fromDatetimeLocal(event.target.value)
                    )
                  }
                  className={textInputClass}
                />
              </label>
              <div className="md:col-span-3">
                <Field
                  label="Notas de pesquisa"
                  value={form.research_notes}
                  onChange={(value) => updateField("research_notes", value)}
                  multiline
                />
              </div>
            </div>

            <div className="mt-6">
              <StructuredListEditor
                label="Fontes de pesquisa"
                value={form.research_sources}
                onChange={(value) => updateField("research_sources", value)}
                fields={researchSourceFields}
              />
            </div>
          </Section>

          <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-white/10 bg-[#212121]/95 p-4 shadow-2xl backdrop-blur">
            <p className="text-sm text-white/55">
              {status === "saved"
                ? "Última alteração salva."
                : "Salve para gravar na tabela event_intelligence."}
            </p>
            <button
              type="button"
              onClick={handleSave}
              disabled={isBusy}
              className="rounded-full bg-[#FFD600] px-6 py-3 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "saving" ? "Salvando..." : "Salvar inteligência"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
