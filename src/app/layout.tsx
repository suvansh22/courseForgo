import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Serene Sedator",
  description: "Notes to ace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
