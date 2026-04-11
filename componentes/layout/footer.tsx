import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#1A1A1A]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + descrição */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
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
              Curadoria viva dos eventos que realmente importam no ecossistema cripto.
            </p>
            <p className="mt-2 font-[family-name:var(--font-inter)] text-xs text-white/30">
              Se tem data, tá na agenda.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Navegação
            </h4>
            <nav className="mt-2 flex flex-col gap-1.5 font-[family-name:var(--font-inter)]">
              <Link href="/" className="text-sm text-white/60 transition hover:text-[#19B5C9]">Home</Link>
              <Link href="/agenda" className="text-sm text-white/60 transition hover:text-[#19B5C9]">Agenda</Link>
              <Link href="/minha-agenda" className="text-sm text-white/60 transition hover:text-[#19B5C9]">Minha Agenda</Link>
            </nav>
          </div>

          {/* Para eventos */}
          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Para eventos
            </h4>
            <nav className="mt-2 flex flex-col gap-1.5 font-[family-name:var(--font-inter)]">
              <Link href="/divulgacao" className="text-sm text-white/60 transition hover:text-[#FFD600]">Divulgação</Link>
              <Link href="/producao-de-eventos" className="text-sm text-white/60 transition hover:text-[#FFD600]">Produção de Eventos</Link>
              <Link href="/admin" className="text-sm text-white/60 transition hover:text-[#FFD600]">Cadastrar evento</Link>
            </nav>
          </div>

          {/* Redes */}
          <div>
            <h4 className="font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-[0.12em] text-white/40">
              Comunidade
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

        {/* Linha divisória + copyright */}
        <div className="mt-6 flex flex-col items-center gap-2 border-t border-white/10 pt-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#19B5C9]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFD600]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
          </div>
          <p className="font-[family-name:var(--font-inter)] text-xs text-white/30">
            © {new Date().getFullYear()} Agenda Crypto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
