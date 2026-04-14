"use client";

import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type AuthUser = {
  id: string;
  email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
};

export default function Header() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user as AuthUser | null);
      setLoadingAuth(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser((session?.user as AuthUser) ?? null);
      setLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email ||
    "Minha conta";

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#212121]/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        {/* Hamburguer mobile - lado esquerdo */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition hover:bg-white/10 md:hidden"
          aria-label="Menu"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Agenda Crypto"
            width={100}
            height={100}
            className="h-8 w-auto sm:h-10"
            unoptimized
          />
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
          <Link
            href="/minha-agenda"
            className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]"
          >
            Minha Agenda
          </Link>
        </nav>

        {/* Botões desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {loadingAuth ? (
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">
              Carregando...
            </div>
          ) : user ? (
            <>
              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="max-w-[180px] truncate text-sm font-medium text-white/80">
                  {displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={handleGoogleLogin}
              className="rounded-full bg-[#FFD600] px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02]"
            >
              Entrar com Google
            </button>
          )}
        </div>
      </div>

      {/* Menu mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#212121] px-6 pb-4 pt-3 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]">Home</Link>
            <Link href="/agenda" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]">Agenda</Link>
            <Link href="/divulgacao" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]">Divulgação</Link>
            <Link href="/producao-de-eventos" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]">Produção de Eventos</Link>
            <Link href="/minha-agenda" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-white/70 transition hover:text-[#19B5C9]">Minha Agenda</Link>
          </nav>

          <div className="mt-4 border-t border-white/10 pt-4">
            {loadingAuth ? (
              <div className="text-sm text-white/60">Carregando...</div>
            ) : user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate text-sm text-white/80">{displayName}</span>
                </div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full rounded-full border border-white/10 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={() => { handleGoogleLogin(); setMenuOpen(false); }}
                className="w-full rounded-full bg-[#FFD600] py-2.5 text-sm font-bold text-black transition hover:bg-[#ffe44c]"
              >
                Entrar com Google
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}