"use client";

import AuthProvider from "@/components/providers/authProvider";
import { LoadingProvider } from "@/components/providers/loadingProvider";
import { SnackbarProvider } from "./snackbarProvider";

const CommonProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <LoadingProvider>
        <SnackbarProvider>{children}</SnackbarProvider>
      </LoadingProvider>
    </AuthProvider>
  );
};

export default CommonProviders;
