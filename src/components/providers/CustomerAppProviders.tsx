"use client";

import { CartProvider } from "@/components/providers/cartProvider";
import { SnackbarProvider } from "@/components/providers/snackbarProvider";
import CommonProviders from "./CommonProvider";

const CustomerAppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CommonProviders>
      <SnackbarProvider>
        <CartProvider>{children}</CartProvider>
      </SnackbarProvider>
    </CommonProviders>
  );
};

export default CustomerAppProvider;
