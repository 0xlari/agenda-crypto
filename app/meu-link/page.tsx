import type { Metadata } from "next";
import MeuLinkClient from "@/componentes/referrals/meu-link-client";

export const metadata: Metadata = {
  title: "Meu link | Agenda Crypto",
  description:
    "Crie seu link personalizado para compartilhar a Agenda Crypto e acumular pontos.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MeuLinkPage() {
  return <MeuLinkClient />;
}
