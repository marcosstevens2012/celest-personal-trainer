import "@repo/ui/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "../components/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Celest Personal Trainer - Admin",
  description: "Panel de administración para entrenadores personales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} antialiased min-h-screen bg-gray-50`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
