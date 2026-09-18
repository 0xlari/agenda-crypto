"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [access, setAccess] = useState<"loading" | "denied" | "admin">("loading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      const refreshed = data.session ? await supabase.auth.refreshSession() : null;
      const session = refreshed?.data.session || data.session;
      if (!session || session.user.app_metadata?.role !== "admin") {
        setAccess("denied");
        return;
      }
      setToken(session.access_token);
      setAccess("admin");
    });
    return () => { active = false; };
  }, []);

  async function handleImport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/import-events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  if (access === "loading") {
    return <main className="min-h-screen bg-black px-6 py-16 text-white">Verificando acesso…</main>;
  }

  if (access === "denied" || !token) {
    return (
      <main className="min-h-screen bg-black px-6 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/10 p-8">
          <h1 className="text-3xl font-bold">Área administrativa protegida</h1>
          <p className="mt-3 text-zinc-400">Entre com a conta administradora para importar eventos.</p>
          <Link href="/agenda" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-bold text-black">Voltar para a agenda</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Admin</h1>
        <p className="text-zinc-400 mb-10">
          Cole o link da planilha ou CSV para importar eventos para a Agenda Crypto.
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
