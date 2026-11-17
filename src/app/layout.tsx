
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://mumbai-million-game.vercel.app"
  ),

  title: "Mumbai Million | Flying Dog Game",

  description:
    "Play Mumbai Million, a fun flying dog game! Fly past rooftops, collect shiny coins and share your adventure.",

  applicationName: "Mumbai Million",

  keywords: [
    "Mumbai Million",
    "Mumbai Million game",
    "Mumbai Million online",
    "Flying Dog Game",
    "casual online game"
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Mumbai Million | Flying Dog Game",
    description:
      "Fly past rooftops, collect shiny coins and share your adventure in Mumbai Million!",
    url: "/",
    siteName: "Mumbai Million",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Mumbai Million | Flying Dog Game",
    description:
      "Fly past rooftops, collect shiny coins and share your adventure!",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
