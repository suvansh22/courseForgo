import Footer from "@/components/UI/footer";
import Header from "@/components/UI/header";
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
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
