"use client";

import AuthProvider from "@/components/providers/authProvider";
import { LoadingProvider } from "@/components/providers/loadingProvider";

const CommonProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <LoadingProvider>
      <AuthProvider>{children}</AuthProvider>
    </LoadingProvider>
  );
};

export default CommonProviders;
