"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import LoadingOverlay from "@/components/UI/loadingOverlay";

type LoadingContextValue = {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  setLoading: (value: boolean) => void;
  runWithLoading: <T>(fn: () => Promise<T> | T) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [activeCount, setActiveCount] = useState(0);

  const showLoading = useCallback(() => {
    setActiveCount((count) => count + 1);
  }, []);

  const hideLoading = useCallback(() => {
    setActiveCount((count) => Math.max(0, count - 1));
  }, []);

  const setLoading = useCallback((value: boolean) => {
    setActiveCount(value ? 1 : 0);
  }, []);

  const runWithLoading = useCallback(
    async <T,>(fn: () => Promise<T> | T) => {
      showLoading();
      try {
        return await fn();
      } finally {
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const value = useMemo(
    () => ({
      isLoading: activeCount > 0,
      showLoading,
      hideLoading,
      setLoading,
      runWithLoading,
    }),
    [activeCount, showLoading, hideLoading, setLoading, runWithLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay isVisible={activeCount > 0} />
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider.");
  }
  return context;
};
