"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase/client";

type Props = {
  eventId: string;
};

export default function EventResponse({ eventId }: Props) {
  const [selected, setSelected] = useState<"going" | "not_going" | null>(null);
  const [saved, setSaved] = useState(false);
  const [goingLoading, setGoingLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [goingCount, setGoingCount] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

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

      await fetch("/api/track-event", {
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

      const response = await fetch("/api/respond", {
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

      await fetch("/api/track-event", {
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
    setMounted(true);
  }, []);

  return (
    <>
      <div className="mt-5">
        <div className="flex items-center gap-2">
         <button
            onClick={() => handleResponse("going")}
            disabled={goingLoading}
            className={`
              flex-1 rounded-full px-4 py-2.5 text-xs font-black
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
            {goingLoading
              ? "Marcando..."
              : selected === "going"
              ? "Vou ✓"
              : "Vou"}
          </button>

          <button
            onClick={handleSave}
            disabled={saveLoading}
            className={`
              flex-1 rounded-full px-4 py-2.5 text-xs font-black
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
            {saveLoading
              ? "Salvando..."
              : saved
              ? "Salvo ✓"
              : "Salvar"}
          </button>
                  </div>

        <p className="mt-3 text-center text-[11px] font-medium text-white/45">
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
    </>
  );
}