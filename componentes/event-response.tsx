"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";
import { authFetch } from "@/lib/supabase/auth-fetch";

type Props = {
  eventId: string;
  title?: string;
  startDate?: string;
  endDate?: string | null;
  eventTime?: string | null;
  city?: string | null;
  venue?: string | null;
};

export default function EventResponse({
  eventId,
  title,
  startDate,
  endDate,
  eventTime,
  city,
  venue,
}: Props) {
  const [selected, setSelected] = useState<"going" | "not_going" | null>(null);
  const [saved, setSaved] = useState(false);
  const [goingLoading, setGoingLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [goingCount, setGoingCount] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCalendarPrompt, setShowCalendarPrompt] = useState(false);

  async function loadCounts() {
    try {
      const response = await fetch("/api/event-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setGoingCount(data.going || 0);
      }
    } catch (error) {
      console.error("Erro ao carregar contagem:", error);
    }
  }

  async function openLoginModalIfNeeded() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setGoingLoading(false);
      setSaveLoading(false);
      setLoginModalOpen(true);
      return null;
    }

    return user;
  }

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.href,
      },
    });
  }

  async function handleSave() {
    try {
      setSaveLoading(true);
      setFeedback(null);

      const user = await openLoginModalIfNeeded();

      if (!user) return;

      if (saved) {
        await authFetch("/api/untrack-event", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            eventId,
            type: "save",
          }),
        });

        setSaved(false);
        setFeedback("Evento removido da Minha Agenda.");
        return;
      }


      await authFetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
          type: "save",
        }),
      });

      setFeedback("Evento salvo na área Minha Agenda.");
      setSaved(true);
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      setFeedback("Não foi possível salvar o evento.");
    } finally {
      setSaveLoading(false);
    }
  }
  async function handleResponse(responseType: "going" | "not_going") {
    try {
      setGoingLoading(true);
      setFeedback(null);

      const user = await openLoginModalIfNeeded();

      if (!user) {
        setGoingLoading(false);
        return;
      }

      if (selected === "going") {
        await authFetch("/api/unrespond", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event_id: eventId,
            user_id: user.id,
          }),
        });

        setSelected(null);
        setFeedback("Você removeu sua presença neste evento.");
        await loadCounts();
        return;
      }

      const response = await authFetch("/api/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: eventId,
          user_id: user.id,
          response: responseType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao salvar resposta");
        return;
      }

      await authFetch("/api/track-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          eventId,
          type: responseType === "going" ? "rsvp_yes" : "rsvp_no",
        }),
      });

      setSelected(responseType);
      setFeedback("Você marcou que vai neste evento. Ele apareceu na área Minha Agenda.");
      setShowCalendarPrompt(true);
      await loadCounts();

    } catch (error) {
      console.error("Erro ao responder evento:", error);
      alert("Erro ao conectar com o servidor");
    } finally {
      setGoingLoading(false);
    }
  }

  useEffect(() => {
    if (eventId) {
      loadCounts();
    }
  }, [eventId]);
  
  useEffect(() => {
  async function loadUserState() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const response = await authFetch("/api/event-user-state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        eventId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
      return;
    }

    setSaved(data.saved);
    setSelected(data.going ? "going" : null);
  }

  if (eventId) {
    loadUserState();
  }
}, [eventId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  function getGoogleCalendarUrl() {
  const safeTitle = title || "Evento Agenda Crypto";

  const safeStartDate =
    startDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate)
      ? startDate
      : new Date().toISOString().split("T")[0];

  const safeEndDate =
    endDate && /^\d{4}-\d{2}-\d{2}$/.test(endDate)
      ? endDate
      : safeStartDate;

  const safeTime =
    eventTime && /^\d{2}:\d{2}$/.test(eventTime)
      ? eventTime
      : "09:00";

  const start = new Date(`${safeStartDate}T${safeTime}:00`);
  const end = new Date(`${safeEndDate}T${safeTime}:00`);

  if (end <= start) {
    end.setHours(start.getHours() + 2);
  }

  const format = (date: Date) =>
    date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: safeTitle,
    dates: `${format(start)}/${format(end)}`,
    details: "Evento salvo pela Agenda Crypto.",
    location: [venue, city].filter(Boolean).join(", "),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

  return (
    <>
      <div className="mt-5">
        <div className="grid w-full grid-cols-2 gap-3">
         <button
            onClick={() => handleResponse("going")}
            disabled={goingLoading}
            className={`
              flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black text-center
              transition-all duration-200
              active:scale-[0.98]
              disabled:opacity-60
              ${
                selected === "going"
                  ? "bg-[#19B5C9] text-black shadow-[0_0_18px_rgba(25,181,201,0.35)]"
                  : "bg-[#19B5C9] text-black hover:brightness-110"
              }
            `}

          >
            {goingLoading ? (
              "Marcando..."
            ) : (
              <>
                <span className="text-base leading-none">✓</span>
                <span>{selected === "going" ? "Indo" : "Vou"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`
              flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-black text-center
              transition-all duration-200
              active:scale-[0.98]
              disabled:opacity-60
              ${
                saved
                  ? "bg-[#FFD600] text-black shadow-[0_0_18px_rgba(255,214,0,0.35)]"
                  : "bg-[#FFD600] text-black hover:brightness-110"
              }
            `}
          >
            {saveLoading ? (
              "Salvando..."
            ) : (
              <>
                <span className="text-base leading-none">{saved ? "✓" : "✦"}</span>
                <span>{saved ? "Salvo" : "Salvar"}</span>
              </>
            )}
          </button>
                  </div>

        <p className="mt-2 text-center text-[12px] font-medium text-white/40">
          {goingCount > 0
            ? `🔥 ${goingCount} ${goingCount === 1 ? "pessoa vai" : "pessoas vão"}`
            : "Seja a primeira pessoa a marcar presença"}
        </p>
        {feedback && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-xs leading-relaxed text-white/70">
            {feedback}
          </div>
        )}
      </div>

      {mounted &&
        loginModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 px-5 backdrop-blur-sm">
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-[#212121] p-6 text-white shadow-[0_20px_100px_rgba(0,0,0,0.75)]">
              <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[#19B5C9]/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-[#EC4899]/10 blur-3xl" />

              <div className="relative z-10">
                <div className="mb-5 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FFD600]">
                  Agenda Pass
                </p>

               <h2 className="mt-3 text-2xl font-black leading-tight text-white">
                    Faça login para montar sua agenda
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-white/65">
                    Entre com Google para salvar eventos, marcar presença e acompanhar sua rota pelo ecossistema cripto.
                  </p>

                  <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-white">
                      Com sua conta, você pode:
                    </p>

                    <ul className="mt-3 space-y-2 text-sm text-white/60">
                      <li>• salvar eventos para ver depois</li>
                      <li>• marcar os eventos em que pretende ir</li>
                      <li>• confirmar presença e desbloquear Agenda Pass</li>
                      <li>• evoluir seu mascote com sua participação</li>
                    </ul>
                  </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={handleLogin}
                    className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
                  >
                    Entrar com Google
                  </button>

                  <button
                    onClick={() => setLoginModalOpen(false)}
                    className="text-sm font-medium text-white/45 transition hover:text-white"
                  >
                    Agora não
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
        {mounted &&
  showCalendarPrompt &&
  createPortal(
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm">
      <div className="w-full max-w-[380px] rounded-[28px] border border-[#19B5C9]/20 bg-[#212121] p-6 text-center text-white shadow-[0_20px_80px_rgba(0,0,0,0.65)]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#19B5C9]/15 text-2xl">
          📅
        </div>

        <h3 className="text-xl font-black">
          Você marcou que vai.
        </h3>

        <p className="mt-3 text-sm leading-7 text-white/65">
          Quer adicionar este evento ao seu Google Calendar agora?
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowCalendarPrompt(false)}
            className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-black text-black transition hover:brightness-110"
          >
            Adicionar ao Google Calendar
          </a>

          <button
            onClick={() => setShowCalendarPrompt(false)}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/60 transition hover:text-white"
          >
            Depois
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}
    </>
  );
}
