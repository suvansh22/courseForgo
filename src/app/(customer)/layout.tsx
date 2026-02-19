import Footer from "@/components/UI/footer";
import Header from "@/components/UI/header";
import CustomerAppProvider from "@/components/providers/CustomerAppProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomerAppProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CustomerAppProvider>
  );
}
