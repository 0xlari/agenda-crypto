import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/componentes/layout/header";
import Footer from "@/componentes/layout/footer";
import UserPersistor from "@/componentes/user-persistor";
import { OnboardingProvider } from "@/componentes/onboarding/onboarding-context";
import { DEFAULT_DESCRIPTION, SEO_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

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
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "Agenda Crypto | Eventos cripto no Brasil e America Latina",
    template: "%s | Agenda Crypto",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "agenda cripto",
    "eventos cripto",
    "eventos web3",
    "eventos blockchain",
    "eventos bitcoin",
    "eventos crypto Brasil",
    "eventos crypto America Latina",
    "side events cripto",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "events",
  alternates: {
    canonical: "/agenda",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/agenda",
    siteName: SITE_NAME,
    title: "Agenda Crypto | Eventos cripto no Brasil e America Latina",
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: SEO_IMAGE,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Agenda Crypto | Eventos cripto no Brasil e America Latina",
    description: DEFAULT_DESCRIPTION,
    images: [SEO_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: SEO_IMAGE,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#212121",
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
