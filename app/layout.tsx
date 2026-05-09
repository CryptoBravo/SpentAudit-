import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Spent Audit — Spent Memo",
  description:
    "A financial positioning audit for people who want clarity without obsessive budgeting. Built by Spent Memo.",
  metadataBase: new URL("https://spentmemo.com"),
  openGraph: {
    title: "Spent Audit",
    description: "Financial clarity without obsessive budgeting.",
    url: "https://spentmemo.com/audit",
    siteName: "Spent Memo",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[var(--paper)] antialiased">{children}</body>
    </html>
  );
}
