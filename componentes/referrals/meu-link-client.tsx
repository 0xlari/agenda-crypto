"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ReferralProfile = {
  code: string;
  displayName: string;
  totalPoints: number;
};

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
};

export default function MeuLinkClient() {
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copyLabel, setCopyLabel] = useState("Copiar link");
  const [origin, setOrigin] = useState("https://www.agendacryptoo.com");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const currentOrigin = window.location.origin;
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      setUser((authUser as AuthUser | null) || null);

      if (!authUser?.id || !authUser.email) {
        setOrigin(currentOrigin);
        setLoading(false);
        return;
      }

      const displayName =
        authUser.user_metadata?.full_name ||
        authUser.user_metadata?.name ||
        authUser.email.split("@")[0];

      const response = await fetch("/api/referrals/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authUser.id,
          email: authUser.email,
          displayName,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setProfile(data.profile);
      }

      setOrigin(currentOrigin);
      setLoading(false);
    }

    loadProfile();
  }, []);

  const referralUrl = useMemo(() => {
    if (!profile) {
      return "";
    }

    return `${origin}/r/${profile.code}`;
  }, [origin, profile]);
  const shareMessage = `Estou usando a Agenda Crypto para acompanhar os principais eventos de cripto e Web3. Entra pelo meu link e acompanha comigo: ${referralUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    referralUrl
  )}&text=${encodeURIComponent(
    "Estou usando a Agenda Crypto para acompanhar eventos de cripto e Web3."
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
    <main className="min-h-screen bg-[#212121] text-white">
      <section className="border-b border-white/10 bg-[radial-gradient(circle_at_20%_0%,rgba(25,181,201,0.20),transparent_32%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,0.16),transparent_30%),#212121]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#19B5C9]">
              Referral Agenda Crypto
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">
              Meu link de compartilhamento
            </h1>
            <p className="mt-5 text-base leading-8 text-white/68 md:text-lg">
              Compartilhe a Agenda Crypto com seu nome, convide sua comunidade
              para descobrir eventos e acumule pontos para futuras recompensas,
              mascote e sorteios.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[#2A2A2A] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:p-8">
            {loading ? (
              <p className="text-white/62">Carregando seu link...</p>
            ) : profile ? (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#FFD600]">
                      Seu codigo
                    </p>
                    <h2 className="mt-2 text-3xl font-black text-white">
                      {profile.code}
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                      Link criado para {profile.displayName}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#FFD600]/25 bg-[#FFD600]/10 px-5 py-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FFD600]">
                      Pontos
                    </p>
                    <p className="mt-1 text-4xl font-black text-white">
                      {profile.totalPoints}
                    </p>
                  </div>
                </div>

                <div className="mt-7 rounded-[24px] border border-white/10 bg-black/20 p-4 font-mono text-xs leading-6 text-[#9DEAF4] sm:text-sm">
                  {referralUrl}
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
              </>
            ) : (
              <div>
                <h2 className="text-2xl font-black text-white">
                  Entre para criar seu link personalizado
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/62">
                  O link precisa estar conectado a uma conta para pontuar com
                  segurança e evitar duplicidade nos sorteios.
                </p>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="mt-6 rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black transition hover:bg-[#ffe04a]"
                >
                  Entrar com Google
                </button>
              </div>
            )}
          </div>

          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(25,181,201,0.12),rgba(255,255,255,0.035))] p-6 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#19B5C9]">
              Como pontua no MVP
            </p>
            <div className="mt-6 space-y-4">
              {[
                ["+1", "visita unica pelo link geral"],
                ["+2", "visita unica em evento ou trilha"],
                ["+5", "cadastro na newsletter via referral"],
              ].map(([points, label]) => (
                <div
                  key={label}
                  className="rounded-[22px] border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-3xl font-black text-[#FFD600]">{points}</p>
                  <p className="mt-1 text-sm font-semibold text-white/70">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {user && (
              <p className="mt-6 text-xs leading-6 text-white/45">
                Pontos repetidos do mesmo navegador sao limitados por visitante,
                link e acao.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
