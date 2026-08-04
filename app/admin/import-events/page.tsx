"use client";

import { useState } from "react";
import { authFetch } from "@/lib/supabase/auth-fetch";

export default function AdminPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await authFetch("/api/import-events", {
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
