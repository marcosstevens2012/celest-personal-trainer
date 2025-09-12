import "@repo/ui/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { businessStructuredData, generateStructuredData } from "../lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marco-stevens-trainer.com"),
  title: "Marco Stevens - Entrenador Personal en Madrid | Fitness y Bienestar",
  description:
    "Entrenador personal certificado en Madrid. Programas personalizados de fitness, fuerza y acondicionamiento físico. Transforma tu cuerpo y alcanza tus objetivos de salud.",
  keywords: [
    "entrenador personal Madrid",
    "fitness personalizado",
    "entrenamiento de fuerza",
    "acondicionamiento físico",
    "personal trainer Madrid",
    "coaching fitness",
    "ejercicio personalizado",
    "salud y bienestar",
  ],
  authors: [{ name: "Marco Stevens" }],
  creator: "Marco Stevens",
  openGraph: {
    title: "Marco Stevens - Entrenador Personal en Madrid",
    description:
      "Transforma tu cuerpo con entrenamientos personalizados. Entrenador certificado con más de 5 años de experiencia.",
    url: "https://marco-stevens-trainer.com",
    siteName: "Marco Stevens Personal Trainer",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marco Stevens - Entrenador Personal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marco Stevens - Entrenador Personal en Madrid",
    description: "Transforma tu cuerpo con entrenamientos personalizados",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://marco-stevens-trainer.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <meta name="theme-color" content="#1d4ed8" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateStructuredData(),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(businessStructuredData),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
