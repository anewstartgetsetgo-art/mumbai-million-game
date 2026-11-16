
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mumbai Million | Flying Dog Game",
  description: "Play Mumbai Million, collect coins and share your story.",
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
