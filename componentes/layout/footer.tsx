"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { agendaHref, getDictionary, localeFromPathname } from "@/lib/i18n";

export default function Footer() {
  const locale = localeFromPathname(usePathname());
  const dict = getDictionary(locale);
  const nav = dict.nav;
  const footer = dict.footer;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={agendaHref(locale)} className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Agenda Crypto"
                width={100}
                height={100}
                className="h-8 w-auto"
                unoptimized
              />
            </Link>
            <p className="mt-2 max-w-xs font-[family-name:var(--font-inter)] text-sm leading-relaxed text-white/50">
              {footer.description}
            </p>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-xs text-white/30">
              {footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              {footer.navigation}
            </h4>
            <nav className="mt-2 flex flex-col gap-1.5 font-[family-name:var(--font-inter)]">
              <Link href={agendaHref(locale)} className="text-sm text-white/60 transition hover:text-[#19B5C9]">{nav.agenda}</Link>
              <Link href="/minha-agenda" className="text-sm text-white/60 transition hover:text-[#19B5C9]">{nav.myAgenda}</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              {footer.events}
            </h4>
            <nav className="mt-2 flex flex-col gap-1.5 font-[family-name:var(--font-inter)]">
              <Link href="/divulgacao" className="text-sm text-white/60 transition hover:text-[#FFD600]">{nav.promotion}</Link>
              <Link href="/producao-de-eventos" className="text-sm text-white/60 transition hover:text-[#FFD600]">{nav.production}</Link>
              <Link href="/admin" className="text-sm text-white/60 transition hover:text-[#FFD600]">{footer.submitEvent}</Link>
            </nav>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              {footer.community}
            </h4>
            <div className="mt-2 flex flex-col gap-1.5 font-[family-name:var(--font-inter)]">
              <a href="https://x.com/agendacrypto" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 transition hover:text-[#EC4899]">
                𝕏 Twitter
              </a>
              <a href="https://instagram.com/agendacrypto" target="_blank" rel="noopener noreferrer" className="text-sm text-white/60 transition hover:text-[#EC4899]">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#19B5C9]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
          </div>
          <p className="font-[family-name:var(--font-inter)] text-xs text-white/30">
            © {currentYear} Agenda Crypto. {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
