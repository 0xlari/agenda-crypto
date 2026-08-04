"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminDashboard from "@/componentes/admin-dashboard";
import { authFetch } from "@/lib/supabase/auth-fetch";

type AdminData = {
  stats: any;
  pendingEvents: any[];
  leads: any[];
  pendingSubmissions: any[];
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const response = await authFetch("/api/admin/overview");
        const json = await response.json();

        if (!response.ok) {
          setError(json.error || "Acesso negado.");
          return;
        }

        setData(json);
      } catch (err) {
        console.error("Erro ao carregar admin:", err);
        setError("Nao foi possivel carregar o painel.");
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">Carregando painel...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#EC4899]">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-black">Acesso restrito</h1>
          <p className="mt-3 text-white/60">{error || "Acesso negado."}</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black"
          >
            Voltar para o site
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#19B5C9]">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-black">Painel da Agenda Crypto</h1>
            <p className="mt-3 text-white/60">
              Operacao, leads e visao geral do produto em um so lugar.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/import-events"
              className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black"
            >
              Importar eventos
            </Link>

            <Link
              href="/agenda"
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
            >
              Ver agenda
            </Link>
          </div>
        </div>

        <AdminDashboard
          stats={data.stats}
          pendingEvents={data.pendingEvents}
          leads={data.leads}
          pendingSubmissions={data.pendingSubmissions}
        />
      </div>
    </main>
  );
}
