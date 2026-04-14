import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/componentes/layout/header";
import Footer from "@/componentes/layout/footer";
import UserPersistor from "@/componentes/user-persistor";
import { OnboardingProvider } from "@/componentes/onboarding/onboarding-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} bg-black text-white`}>
        <OnboardingProvider>
          <UserPersistor />
          <Header />
          {children}
          <Footer />
        </OnboardingProvider>
      </body>
    </html>
  );
}