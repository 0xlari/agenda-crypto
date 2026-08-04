"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ReferralProfile = {
  code: string;
  displayName: string;
  totalPoints: number;
};

type EventReferralShareProps = {
  eventTitle: string;
  eventSlug: string;
  hasTrail: boolean;
};

export default function EventReferralShare({
  eventTitle,
  eventSlug,
  hasTrail,
}: EventReferralShareProps) {
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyLabel, setCopyLabel] = useState("Copiar link");
  const [origin, setOrigin] = useState("https://www.agendacryptoo.com");

  useEffect(() => {
    async function loadReferralProfile() {
      const currentOrigin = window.location.origin;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.id || !user.email) {
        setOrigin(currentOrigin);
        setLoading(false);
        return;
      }

      const response = await fetch("/api/referrals/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          displayName:
            user.user_metadata?.full_name || user.user_metadata?.name || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      }

      setOrigin(currentOrigin);
      setLoading(false);
    }

    loadReferralProfile();
  }, []);

  const referralUrl = useMemo(() => {
    if (!profile) {
      return "";
    }

    return `${origin}/agenda/${eventSlug}?ref=${profile.code}`;
  }, [eventSlug, origin, profile]);

  const shareMessage = hasTrail
    ? `Estou acompanhando a trilha de ${eventTitle} na Agenda Crypto, com evento principal, side events e encontros conectados. Veja aqui: ${referralUrl}`
    : `Estou acompanhando ${eventTitle} na Agenda Crypto. Veja aqui: ${referralUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    shareMessage
  )}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    referralUrl
  )}&text=${encodeURIComponent(
    hasTrail
      ? `Estou acompanhando a trilha de ${eventTitle} na Agenda Crypto.`
      : `Estou acompanhando ${eventTitle} na Agenda Crypto.`
  )}`;

  async function copyReferralUrl() {
    if (!referralUrl) {
      return;
    }

    await navigator.clipboard.writeText(referralUrl);
    setCopyLabel("Link copiado");
    window.setTimeout(() => setCopyLabel("Copiar link"), 1800);
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-6 md:pb-12">
      <div className="overflow-hidden rounded-[32px] border border-[#19B5C9]/20 bg-[linear-gradient(135deg,rgba(25,181,201,0.14),rgba(236,72,153,0.08),rgba(255,214,0,0.10))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.24)] md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#19B5C9]">
              Compartilhe esta trilha
            </p>
            <h2 className="mt-3 text-2xl font-black text-white md:text-3xl">
              Convide sua comunidade para acompanhar este evento
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">
              Gere um link com seu código, compartilhe no WhatsApp ou Telegram e
              acumule pontos quando novas pessoas descobrirem a Agenda Crypto.
            </p>
          </div>

          {profile && (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
                Seus pontos
              </p>
              <p className="mt-1 text-3xl font-black text-[#FFD600]">
                {profile.totalPoints}
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <p className="mt-6 text-sm text-white/55">Carregando seu link...</p>
        ) : profile ? (
          <div className="mt-6">
            <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-[#9DEAF4] sm:text-sm">
              {referralUrl}
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={copyReferralUrl}
                className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black transition hover:bg-[#ffe04a]"
              >
                {copyLabel}
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#19B5C9]/35 bg-[#19B5C9]/10 px-5 py-3 text-center text-sm font-bold text-[#9DEAF4] transition hover:bg-[#19B5C9]/15"
              >
                Compartilhar no WhatsApp
              </a>
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#EC4899]/35 bg-[#EC4899]/10 px-5 py-3 text-center text-sm font-bold text-[#F8A9CF] transition hover:bg-[#EC4899]/15"
              >
                Compartilhar no Telegram
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-5">
            <p className="text-sm leading-7 text-white/65">
              Entre com sua conta para gerar seu link personalizado deste
              evento.
            </p>
            <button
              type="button"
              onClick={handleLogin}
              className="mt-4 rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black transition hover:bg-[#ffe04a]"
            >
              Entrar e gerar meu link
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
