"use client";

import { CartProvider } from "@/components/providers/cartProvider";
import CommonProviders from "./CommonProvider";

const CustomerAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CommonProviders>
      <CartProvider>{children}</CartProvider>
    </CommonProviders>
  );
};

export default CustomerAppProvider;
