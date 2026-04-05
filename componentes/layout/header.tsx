import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#212121]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Agenda Crypto"
            width={100}
            height={100}
            className="h-10 w-auto"
            unoptimized
          />
          <span className="text-lg font-black tracking-tight text-white">
            
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]"
          >
            Home
          </Link>

          <Link
            href="/agenda"
            className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]"
          >
            Agenda
          </Link>

          <Link
            href="/divulgacao"
            className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]"
          >
            Divulgação
          </Link>

          <Link
            href="/producao-de-eventos"
            className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]"
          >
            Produção de Eventos
          </Link>
        </nav>
      </div>
    </header>
  );
}