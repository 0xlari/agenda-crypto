import { getPublishedEvents } from "@/lib/supabase/queries";
import NewsletterSignup from "@/componentes/newsletter-signup";
import AgendaBrowser from "@/componentes/agenda/agenda-browser";
import Link from "next/link";

export default async function AgendaPage() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen bg-[#212121] text-[#F5F5F5]">
      {/* HERO */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-[#19B5C9]/30 bg-[#19B5C9]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#19B5C9]">
                  Se tem data, tá na agenda
                </span>

                <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
              </div>

              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Agenda Crypto
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/68 sm:text-lg">
                Descubra os eventos mais relevantes do mercado cripto em uma
                agenda viva, visual e feita para quem quer acompanhar o que
                realmente importa.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#19B5C9]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD600]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
              </div>

              <p className="text-sm font-semibold text-white">
                Quer divulgar um evento?
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Cadastre sua data na Agenda Crypto e aumente a visibilidade do
                seu evento dentro do ecossistema.
              </p>

              <Link
                href="/divulgacao"
                className="mt-6 inline-flex rounded-full bg-[#FFD600] px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.01] hover:bg-[#ffe44c]"
              >
                + Cadastre seu evento
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AgendaBrowser events={events} />

      {/* NEWSLETTER */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <NewsletterSignup compact />
        </div>
      </section>
    </main>
  );
}