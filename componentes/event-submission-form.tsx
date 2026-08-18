"use client";

import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useState,
} from "react";

type InterestType = "free_listing" | "promo_package" | "event_production";
type QuickPlatformId = "luma" | "sympla" | "eventbrite" | "meetup" | "other";

type Props = {
  defaultInterestType?: InterestType;
  title?: string;
  subtitle?: string;
};

type ExtractedEvent = {
  event_title: string;
  event_date?: string | null;
  end_date?: string | null;
  event_time?: string | null;
  city?: string | null;
  location?: string | null;
  event_link?: string | null;
  short_description?: string | null;
  tags?: string | null;
  image_url?: string | null;
  agenda_highlight?: string | null;
  internal_notes?: string | null;
};

const QUICK_PLATFORM_OPTIONS: Array<{
  id: QuickPlatformId;
  label: string;
  helper: string;
}> = [
  {
    id: "luma",
    label: "Luma",
    helper: "Puxa dados do evento pela página pública.",
  },
  {
    id: "sympla",
    label: "Sympla",
    helper: "Ideal para eventos com página de inscrição.",
  },
  {
    id: "eventbrite",
    label: "Eventbrite",
    helper: "Usa metadados públicos do evento.",
  },
  {
    id: "meetup",
    label: "Meetup",
    helper: "Bom para comunidades e encontros.",
  },
  {
    id: "other",
    label: "Outro link",
    helper: "Abre o formulário completo.",
  },
];

const FORMAT_OPTIONS = [
  "Meetup",
  "Conferência",
  "Workshop",
  "Hackathon",
  "Side event",
  "Networking",
  "Online",
];

const LEVEL_OPTIONS = [
  "Iniciante",
  "Intermediário",
  "Avançado",
  "Técnico",
  "Executivo",
];

const TOPIC_OPTIONS = [
  "Bitcoin",
  "DeFi",
  "IA",
  "Fintech",
  "Regulação",
  "Infraestrutura",
  "Comunidade",
];

const OPPORTUNITY_OPTIONS = [
  "Aprendizado",
  "Networking",
  "Parcerias",
  "Cobertura",
  "Patrocínio",
  "Agenda Pass",
];

export default function EventSubmissionForm({
  defaultInterestType = "free_listing",
  title = "Cadastre seu evento",
  subtitle = "Preencha as informações abaixo para entrar no radar da Agenda Crypto.",
}: Props) {
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [eventLink, setEventLink] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [tags, setTags] = useState("");
  const [endDate, setEndDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [audienceInsight, setAudienceInsight] = useState("");
  const [editorialNotes, setEditorialNotes] = useState("");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedOpportunities, setSelectedOpportunities] = useState<string[]>(
    []
  );
  const [interestType, setInterestType] =
    useState<InterestType>(defaultInterestType);

  const [selectedPlatform, setSelectedPlatform] =
    useState<QuickPlatformId | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractingEvent, setExtractingEvent] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  async function handleImageUpload(file: File) {
    try {
      setUploadingImage(true);
      setMessage("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/event-submissions/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        publicUrl?: string;
      };

      if (!response.ok || !data.publicUrl) {
        setMessage(data.error || "Erro ao enviar imagem.");
        return;
      }

      setImageUrl(data.publicUrl);
      setMessage("Imagem enviada com sucesso.");
    } catch {
      setMessage("Erro ao fazer upload da imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleQuickSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedPlatform || selectedPlatform === "other") {
      setShowManualForm(true);
      setMessage("Use o formulário completo para esse tipo de link.");
      return;
    }

    setExtractingEvent(true);
    setMessage("");

    try {
      const extractionResponse = await fetch(
        "/api/event-submissions/extract-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_url: eventLink,
            platform: selectedPlatform,
          }),
        }
      );

      const extractionData = (await extractionResponse.json()) as {
        error?: string;
        event?: ExtractedEvent;
      };

      if (!extractionResponse.ok || !extractionData.event) {
        setShowManualForm(true);
        setMessage(
          extractionData.error ||
            "Não consegui puxar tudo. Complete manualmente."
        );
        return;
      }

      const submissionResponse = await fetch("/api/event-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...extractionData.event,
          contact_name: contactName,
          email,
          whatsapp,
          interest_type: defaultInterestType,
        }),
      });

      const submissionData = (await submissionResponse.json()) as {
        error?: string;
        message?: string;
      };

      if (!submissionResponse.ok) {
        setMessage(submissionData.error || "Algo deu errado.");
        return;
      }

      resetFields();
      setMessage(
        submissionData.message ||
          "Recebemos seu evento. Vamos analisar as informações."
      );
    } catch {
      setShowManualForm(true);
      setMessage("Não consegui conectar com o servidor. Complete manualmente.");
    } finally {
      setExtractingEvent(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/event-submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact_name: contactName,
          email,
          whatsapp,
          event_title: eventTitle,
          event_date: eventDate,
          end_date: endDate,
          event_time: eventTime,
          city,
          location,
          event_link: eventLink,
          short_description: shortDescription,
          tags,
          image_url: imageUrl,
          interest_type: interestType,
          agenda_highlight: buildAgendaHighlightPayload({
            audienceInsight,
            formats: selectedFormats,
            levels: selectedLevels,
            opportunities: selectedOpportunities,
            topics: selectedTopics,
            editorialNotes,
          }),
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        setMessage(data.error || "Algo deu errado.");
        return;
      }

      resetFields();
      setMessage(data.message || "Recebemos seu evento.");
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function resetFields() {
    setContactName("");
    setEmail("");
    setWhatsapp("");
    setEventTitle("");
    setEventDate("");
    setEndDate("");
    setCity("");
    setLocation("");
    setEventLink("");
    setShortDescription("");
    setTags("");
    setImageUrl("");
    setEventTime("");
    setAudienceInsight("");
    setEditorialNotes("");
    setSelectedFormats([]);
    setSelectedLevels([]);
    setSelectedTopics([]);
    setSelectedOpportunities([]);
    setInterestType(defaultInterestType);
    setSelectedPlatform(null);
    setShowManualForm(false);
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 sm:p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#19B5C9]">
          Formulário
        </p>
        <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/65">{subtitle}</p>
      </div>

      <div className="mb-6 rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/8 p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19B5C9]">
              Envio rápido por link
            </p>
            <h4 className="mt-2 text-lg font-black text-white">
              Seu evento já está em uma plataforma?
            </h4>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Cole o link e a Agenda Crypto tenta puxar nome, data, local,
              descrição e imagem para o admin revisar.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowManualForm((current) => !current);
              setMessage("");
            }}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-[#FFD600]/35 hover:text-[#FFD600]"
          >
            {showManualForm ? "Voltar ao link" : "Preencher manualmente"}
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {QUICK_PLATFORM_OPTIONS.map((option) => {
            const isSelected = selectedPlatform === option.id;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setSelectedPlatform(option.id);
                  setMessage("");

                  if (option.id === "other") {
                    setShowManualForm(true);
                  } else {
                    setShowManualForm(false);
                  }
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-[#19B5C9]/70 bg-[#19B5C9]/15"
                    : "border-white/10 bg-white/[0.04] hover:border-[#19B5C9]/35 hover:bg-[#19B5C9]/10"
                }`}
              >
                <span className="text-sm font-bold text-white">
                  {option.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-white/55">
                  {option.helper}
                </span>
              </button>
            );
          })}
        </div>

        {!showManualForm &&
          selectedPlatform &&
          selectedPlatform !== "other" && (
            <form onSubmit={handleQuickSubmit} className="mt-5 grid gap-3">
              <input
                type="text"
                placeholder="Seu nome"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
                required
              />

              <input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
                required
              />

              <input
                type="text"
                placeholder="WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
              />

              <input
                type="url"
                placeholder="Cole o link do evento"
                value={eventLink}
                onChange={(e) => setEventLink(e.target.value)}
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
                required
              />

              <button
                type="submit"
                disabled={extractingEvent}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02] disabled:opacity-60"
              >
                {extractingEvent ? "Extraindo informações..." : "Extrair e enviar"}
              </button>
            </form>
          )}

        {!showManualForm && message && (
          <p className="mt-4 text-sm leading-6 text-white/70">{message}</p>
        )}
      </div>

      {showManualForm && (
        <form
          onSubmit={handleSubmit}
          className="grid gap-3 sm:gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            placeholder="Seu nome"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            required
          />

          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            required
          />

          <input
            type="text"
            placeholder="WhatsApp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="text"
            placeholder="Nome do evento"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            required
          />

          <input
            type="date"
            placeholder="Data do evento"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="date"
            placeholder="Data de fim do evento"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="text"
            placeholder="Horário do evento"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="text"
            placeholder="Cidade"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="text"
            placeholder="Local ou online"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="url"
            placeholder="Link do evento"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
          />

          <input
            type="text"
            placeholder="Tags ou categoria"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55 md:col-span-2"
          />

          <div className="rounded-[28px] border border-[#19B5C9]/20 bg-[#19B5C9]/8 p-4 md:col-span-2 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#19B5C9]">
              Insight editorial
            </p>
            <h4 className="mt-2 text-lg font-black text-white">
              Para quem vale a pena participar?
            </h4>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Escreva em formato de texto. A Agenda Crypto transforma isso em
              um bloco limpo para curadoria, sem você precisar formatar.
            </p>

            <textarea
              placeholder="Ex: Para quem vale a pena: desenvolvedores, estudantes de tecnologia, pesquisadores e pessoas que desejam compreender o Bitcoin além do mercado. Iniciantes são aceitos, mas vale estudar os fundamentos antes..."
              value={audienceInsight}
              onChange={(e) => setAudienceInsight(e.target.value)}
              className="mt-4 min-h-[150px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            />

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <EditorialChipGroup
                label="Formato"
                options={FORMAT_OPTIONS}
                selected={selectedFormats}
                setSelected={setSelectedFormats}
              />
              <EditorialChipGroup
                label="Nível"
                options={LEVEL_OPTIONS}
                selected={selectedLevels}
                setSelected={setSelectedLevels}
              />
              <EditorialChipGroup
                label="Tema"
                options={TOPIC_OPTIONS}
                selected={selectedTopics}
                setSelected={setSelectedTopics}
              />
              <EditorialChipGroup
                label="Oportunidade"
                options={OPPORTUNITY_OPTIONS}
                selected={selectedOpportunities}
                setSelected={setSelectedOpportunities}
              />
            </div>

            <textarea
              placeholder="Olhar da Agenda Crypto: por que esse evento importa?"
              value={editorialNotes}
              onChange={(e) => setEditorialNotes(e.target.value)}
              className="mt-4 min-h-[95px] w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            />
          </div>

          <div className="space-y-3 md:col-span-2">
            <input
              type="url"
              placeholder="Link da imagem (opcional)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55"
            />

            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-sm text-white/60">
                Ou envie uma imagem do evento
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="w-full text-sm text-white/70 file:mb-2 file:mr-4 file:w-full file:rounded-full file:border-0 file:bg-[#19B5C9] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black sm:file:mb-0 sm:file:w-auto"
              />

              {uploadingImage && (
                <p className="mt-3 text-sm text-white/60">Enviando imagem...</p>
              )}

              {imageUrl && (
                <div className="mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- Preview accepts user-provided and Supabase URLs. */}
                  <img
                    src={imageUrl}
                    alt="Prévia"
                    className="max-h-48 w-full rounded-2xl border border-white/10 object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <textarea
            placeholder="Descrição curta do evento"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            className="min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none transition hover:border-[#19B5C9]/35 focus:border-[#19B5C9]/55 md:col-span-2"
          />

          <div className="md:col-span-2">
            <p className="mb-3 text-sm font-medium text-white/75">
              O que você deseja?
            </p>

            <div className="grid gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <button
                type="button"
                onClick={() => setInterestType("free_listing")}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                  interestType === "free_listing"
                    ? "bg-[#19B5C9] text-black"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-[#19B5C9]/35 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
                }`}
              >
                Apenas listagem gratuita
              </button>

              <button
                type="button"
                onClick={() => setInterestType("promo_package")}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                  interestType === "promo_package"
                    ? "bg-[#FFD600] text-black"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-[#FFD600]/35 hover:bg-[#FFD600]/10 hover:text-[#FFD600]"
                }`}
              >
                Quero saber sobre divulgação
              </button>

              <button
                type="button"
                onClick={() => setInterestType("event_production")}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition sm:w-auto ${
                  interestType === "event_production"
                    ? "bg-[#EC4899] text-white"
                    : "border border-white/10 bg-white/[0.04] text-white/70 hover:border-[#EC4899]/35 hover:bg-[#EC4899]/10 hover:text-[#EC4899]"
                }`}
              >
                Quero falar sobre produção
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02] disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Enviando..." : "Enviar informações"}
            </button>

            {message && <p className="text-sm text-white/70">{message}</p>}
          </div>
        </form>
      )}
    </div>
  );
}

function EditorialChipGroup({
  label,
  options,
  selected,
  setSelected,
}: {
  label: string;
  options: string[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
      <p className="mb-3 text-sm font-semibold text-white/80">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              aria-pressed={isSelected}
              onClick={() => toggleSelection(option, setSelected)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                isSelected
                  ? "border-[#FFD600]/70 bg-[#FFD600] text-black"
                  : "border-white/10 bg-white/[0.04] text-white/65 hover:border-[#19B5C9]/45 hover:bg-[#19B5C9]/10 hover:text-[#19B5C9]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function toggleSelection(
  option: string,
  setSelected: Dispatch<SetStateAction<string[]>>
) {
  setSelected((current) =>
    current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option]
  );
}

function buildAgendaHighlightPayload({
  audienceInsight,
  formats,
  levels,
  opportunities,
  topics,
  editorialNotes,
}: {
  audienceInsight: string;
  formats: string[];
  levels: string[];
  opportunities: string[];
  topics: string[];
  editorialNotes: string;
}) {
  const sections = [
    formatLongSection("Para quem vale a pena", audienceInsight),
    formatListSection("Formato", formats),
    formatListSection("Nível", levels),
    formatListSection("Tema", topics),
    formatListSection("Oportunidade", opportunities),
    formatLongSection("Olhar da Agenda Crypto", editorialNotes),
  ].filter(Boolean);

  return sections.join("\n\n");
}

function formatListSection(label: string, values: string[]) {
  return values.length > 0 ? `${label}: ${values.join(", ")}` : "";
}

function formatLongSection(label: string, value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "";
  }

  return normalizedValue.toLowerCase().startsWith(`${label.toLowerCase()}:`)
    ? normalizedValue
    : `${label}:\n${normalizedValue}`;
}
