"use client";

import { CartProvider } from "@/components/providers/cartProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <CartProvider>{children}</CartProvider>;
};

export default Providers;
