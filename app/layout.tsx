import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "../components/Providers/QueryProvider";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteHub - Управління нотатками",
  description: "Сучасний додаток для створення та управління вашими нотатками з категоріями та пошуком",
  keywords: ["нотатки", "замітки", "організація", "продуктивність"],
  authors: [{ name: "NoteHub Team" }],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <QueryProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
