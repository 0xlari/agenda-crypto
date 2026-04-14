"use client";

import { useState } from "react";

type NewsletterSignupProps = {
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function NewsletterSignup({
  title = "Receba os eventos antes de todo mundo",
  description = "Entre na lista da Agenda Crypto para acompanhar novidades, curadoria e os principais eventos do mercado.",
  compact = false,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("duplicate key")) {
          setMessage("Esse email já está inscrito.");
        } else {
          setMessage(data.error || "Erro ao realizar inscrição.");
        }
        return;
      }

      setMessage("Inscrição realizada com sucesso.");
      setEmail("");
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#2A2A2A]">
      <div className={`grid gap-0 ${compact ? "lg:grid-cols-1" : "lg:grid-cols-[1.1fr_0.9fr]"}`}>
        <div className="p-8 md:p-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
          </div>

          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#19B5C9]">
            Newsletter
          </p>

          <h3 className="mt-3 max-w-xl text-3xl font-black leading-tight text-white">
            {title}
          </h3>

          <p className="mt-3 max-w-2xl text-white/62">
            {description}
          </p>

          <form
            onSubmit={handleSubscribe}
            className="mt-6 flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center"
          >
            <input
              type="email"
              placeholder="Seu melhor email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full flex-1 rounded-full border border-white/10 bg-[#212121] px-5 py-3 text-white outline-none placeholder:text-white/35 sm:px-6"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="min-w-45 rounded-full bg-[#FFD600] px-6 py-3 font-bold text-black transition hover:bg-[#ffe44c] disabled:opacity-60 sm:w-auto"
            >
              {loading ? "Entrando..." : "Entrar na lista"}
            </button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-white/65">{message}</p>
          )}
        </div>

        {!compact && (
          <div className="relative hidden min-h-[280px] overflow-hidden lg:block">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(25,181,201,0.18),rgba(236,72,153,0.14),rgba(255,214,0,0.18))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(25,181,201,0.20),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.20),transparent_40%)]" />
            <div className="absolute left-8 top-8 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
              Agenda Crypto
            </div>
            <div className="absolute bottom-10 left-8 max-w-xs">
              <p className="text-sm font-medium text-white/55">
                Se tem data, tá na agenda.
              </p>
              <p className="mt-3 text-2xl font-black leading-tight text-white">
                Curadoria viva para quem acompanha o ecossistema de perto.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}