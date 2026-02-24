"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { message } from "antd";

type HttpError = {
  status?: number;
  message?: string;
  details?: string[];
};

const notifyError = (error: unknown) => {
  const err = error as HttpError;
  const messageText = err?.message ?? "Request failed.";
  message.error(messageText);
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: notifyError,
  }),
  mutationCache: new MutationCache({
    onError: notifyError,
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
