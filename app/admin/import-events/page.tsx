"use client";

import { useState } from "react";

export default function AdminPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/import-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sheetUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Erro ao importar eventos.");
        return;
      }

      setMessage(data.message || "Eventos importados com sucesso.");
      setSheetUrl("");
    } catch {
      setMessage("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Admin</h1>
        <p className="text-zinc-400 mb-10">
          Cole o link CSV da planilha para importar eventos para a Agenda Crypto.
        </p>

        <div className="mb-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
          <p className="font-bold">Colunas obrigatórias</p>
          <p className="mt-1 font-mono text-xs text-amber-100/80">
            title, slug, city, country
          </p>
          <p className="mt-3 text-amber-100/70">
            Preencha <strong>country</strong> em todas as linhas presenciais.
            Use nomes consistentes, como Brazil, Argentina, Colombia, Mexico e
            Chile. A importação atualiza eventos existentes pelo slug.
          </p>
        </div>

        <form onSubmit={handleImport} className="flex flex-col gap-4">
          <input
            type="url"
            placeholder="https://docs.google.com/spreadsheets/d/..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-white px-6 py-3 font-medium text-black disabled:opacity-60"
          >
            {loading ? "Importando..." : "Importar eventos"}
          </button>
        </form>

        {message && (
          <p className="mt-6 text-sm text-zinc-400">{message}</p>
        )}
      </div>
    </main>
  );
}
