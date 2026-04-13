import type { Metadata } from "next";
import "./globals.css";
import Header from "@/componentes/layout/header";
import UserPersistor from "@/componentes/user-persistor";

export const metadata: Metadata = {
  title: "Agenda Crypto",
  description: "Eventos cripto que realmente importam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <UserPersistor/>
        <Header />
        {children}
      </body>
    </html>
  );
}