"use client";

import { useState } from "react";

export default function NewsletterSection() {
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
        setMessage(data.error || "Algo deu errado.");
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
    <section className="py-20 border-t border-zinc-800 text-center">
      <h2 className="text-2xl font-semibold mb-4">
        Receba a Agenda Crypto
      </h2>

      <p className="text-zinc-400 mb-6">
        Eventos e insights direto no seu email.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center gap-2 items-center"
      >
        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 rounded-md bg-zinc-900 border border-zinc-700 w-full max-w-sm"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-white text-black rounded-md font-medium disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Entrar"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-sm text-zinc-400">{message}</p>
      )}
    </section>
  );
}