"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AdminDashboard from "@/componentes/admin-dashboard";
import EventAnnouncementsAdmin from "@/componentes/event-announcements-admin";
import { supabase } from "@/lib/supabase/client";

type AdminData = {
  stats: { publishedCount: number; activeCount: number; goingCount: number; agendaViewsCount: number; leadsCount: number };
  pendingEvents: Array<{ id: string; title: string; city: string | null; start_date: string; published: boolean }>;
  leads: Array<{ id: string; contact_name: string; email: string; whatsapp: string | null; event_title: string; interest_type: string; created_at: string; lead_status?: string }>;
  pendingSubmissions: Array<{ id: string; contact_name: string; email: string; whatsapp: string | null; event_title: string; event_date: string | null; end_date?: string | null; event_time: string | null; event_link?: string | null; city: string | null; location: string | null; short_description: string | null; tags: string | null; created_at: string; lead_status?: string; image_url?: string | null; interest_type: string | null; internal_notes?: string | null; agenda_highlight?: string | null }>;
};

export default function AdminPageClient() {
  const [access, setAccess] = useState<"loading" | "denied" | "admin">("loading");
  const [token, setToken] = useState<string | null>(null);
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(async ({ data: sessionData }) => {
      if (!active) return;
      const refreshed = sessionData.session
        ? await supabase.auth.refreshSession()
        : null;
      const session = refreshed?.data.session || sessionData.session;
      if (!session || session.user.app_metadata?.role !== "admin") {
        setAccess("denied");
        return;
      }

      setToken(session.access_token);
      try {
        const response = await fetch("/api/admin/overview", {
          headers: { Authorization: `Bearer ${session.access_token}` }, cache: "no-store",
        });
        if (response.status === 401 || response.status === 403) {
          setAccess("denied");
          return;
        }
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || "Não foi possível carregar o admin.");
        if (!active) return;
        setData(payload);
        setAccess("admin");
      } catch (requestError) {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Erro ao carregar o admin.");
        setAccess("denied");
      }
    });
    return () => { active = false; };
  }, []);

  if (access === "loading") {
    return <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">Verificando acesso…</main>;
  }

  if (access === "denied" || !data || !token) {
    return (
      <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#19B5C9]">Área protegida</p>
          <h1 className="mt-3 text-3xl font-black">Acesso administrativo necessário</h1>
          <p className="mt-4 text-white/65">Entre com a conta administradora da Agenda Crypto para acessar dados, leads e ações de publicação.</p>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          <Link href="/agenda" className="mt-6 inline-flex rounded-full bg-[#FFD600] px-5 py-3 font-bold text-black">Voltar para a agenda</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#212121] px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#19B5C9]">Admin</p>
            <h1 className="mt-3 text-4xl font-black">Painel da Agenda Crypto</h1>
            <p className="mt-3 text-white/60">Operação, leads e visão geral do produto em um só lugar.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/import-events" className="rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black">Importar eventos</Link>
            <Link href="/admin/dashboard" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">Ver inteligência</Link>
            <Link href="/agenda" className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white">Ver agenda</Link>
          </div>
        </div>
        <AdminDashboard accessToken={token} stats={data.stats} pendingEvents={data.pendingEvents} leads={data.leads} pendingSubmissions={data.pendingSubmissions} />
        <div className="mt-10"><EventAnnouncementsAdmin /></div>
      </div>
    </main>
  );
}
