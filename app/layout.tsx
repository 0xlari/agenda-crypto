import type { Metadata } from "next";
import "./globals.css";
import Header from "@/componentes/layout/header";

export const metadata: Metadata = {
  title: "Agenda Crypto",
  description: "Os eventos cripto que realmente importam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-black text-white">
        <Header />
        {children}
      </body>
    </html>
  );
}