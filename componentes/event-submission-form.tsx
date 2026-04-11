"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Props = {
  defaultInterestType?: "free_listing" | "promo_package" | "event_production";
  title?: string;
  subtitle?: string;
};

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
  const [interestType, setInterestType] = useState<
    "free_listing" | "promo_package" | "event_production"
  >(defaultInterestType);

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  async function handleImageUpload(file: File) {
    try {
      setUploadingImage(true);
      setMessage("");

      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;

      const filePath = `submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (uploadError) {
        setMessage(`Erro ao enviar imagem: ${uploadError.message}`);
        return;
      }

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        setImageUrl(data.publicUrl);
        setMessage("Imagem enviada com sucesso.");
      }
    } catch {
      setMessage("Erro ao fazer upload da imagem.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
          city,
          location,
          event_link: eventLink,
          short_description: shortDescription,
          tags,
          image_url: imageUrl,
          interest_type: interestType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Algo deu errado.");
        return;
      }

      setMessage(data.message || "Recebemos seu evento.");
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
      setInterestType(defaultInterestType);
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#19B5C9]">
          Formulário
        </p>
        <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/65">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <input
          type="text"
          placeholder="Seu nome"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
          required
        />

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
          required
        />

        <input
          type="text"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="text"
          placeholder="Nome do evento"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Data do evento"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="text"
          placeholder="Data de fim do evento"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="text"
          placeholder="Cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="text"
          placeholder="Local ou online"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="url"
          placeholder="Link do evento"
          value={eventLink}
          onChange={(e) => setEventLink(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
        />

        <input
          type="text"
          placeholder="Tags ou categoria"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none md:col-span-2"
        />

        <div className="md:col-span-2 space-y-3">
          <input
            type="url"
            placeholder="Link da imagem (opcional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none"
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
              className="text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#19B5C9] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
            />

            {uploadingImage && (
              <p className="mt-3 text-sm text-white/60">Enviando imagem...</p>
            )}

            {imageUrl && (
              <div className="mt-4">
                <img
                  src={imageUrl}
                  alt="Prévia"
                  className="max-h-48 rounded-2xl border border-white/10 object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <textarea
          placeholder="Descrição curta do evento"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          className="min-h-[120px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/35 outline-none md:col-span-2"
        />

        <div className="md:col-span-2">
          <p className="mb-3 text-sm font-medium text-white/75">
            O que você deseja?
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setInterestType("free_listing")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                interestType === "free_listing"
                  ? "bg-[#19B5C9] text-black"
                  : "border border-white/10 bg-white/[0.04] text-white/70"
              }`}
            >
              Apenas listagem gratuita
            </button>

            <button
              type="button"
              onClick={() => setInterestType("promo_package")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                interestType === "promo_package"
                  ? "bg-[#FFD600] text-black"
                  : "border border-white/10 bg-white/[0.04] text-white/70"
              }`}
            >
              Quero saber sobre divulgação
            </button>

            <button
              type="button"
              onClick={() => setInterestType("event_production")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                interestType === "event_production"
                  ? "bg-[#EC4899] text-white"
                  : "border border-white/10 bg-white/[0.04] text-white/70"
              }`}
            >
              Quero falar sobre produção
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-full bg-[#FFD600] px-6 py-3 text-sm font-bold text-black transition hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar informações"}
          </button>

          {message && <p className="text-sm text-white/70">{message}</p>}
        </div>
      </form>
    </div>
  );
}