
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://mumbai-million-game.vercel.app"
  ),

  title: "Mumbai Million - Play the Flying Dog Game Online",

  description:
    "Play Mumbai Million, a fun flying dog game! Fly past rooftops, collect shiny coins, enjoy daily stories and share your adventure.",

  applicationName: "Mumbai Million",

  keywords: [
    "Mumbai Million",
    "Mumbai Million game",
    "Mumbai Million online game",
    "Flying Dog Game",
    "Flying Dog game online",
    "casual browser games",
    "coin collecting game"
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Mumbai Million - Flying Dog Game",
    description:
      "Fly past rooftops, collect shiny coins and share your story in Mumbai Million!",
    url: "/",
    siteName: "Mumbai Million",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "Mumbai Million - Flying Dog Game",
    description:
      "Fly past rooftops, collect shiny coins and share your story!",
  },

  robots: {
    index: true,
    follow: true,
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
