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

        <div className="flex items-center gap-3">
          {loadingAuth ? (
            <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/60">
              Carregando...
            </div>
          ) : user ? (
            <>
              <div className="hidden items-center gap-3 md:flex">
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
    </header>
  );
}