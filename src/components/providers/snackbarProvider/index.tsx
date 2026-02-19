"use client";

import message from "antd/es/message";
import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type SnackbarType = "success" | "error" | "warning" | "info" | "loading";

type SnackbarOptions = {
  content: ReactNode;
  duration?: number;
  key?: string;
};

type SnackbarContextValue = {
  showSnackbar: (type: SnackbarType, options: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const showSnackbar = useMemo(
    () => (type: SnackbarType, options: SnackbarOptions) => {
      messageApi.open({
        type,
        content: options.content,
        duration: options.duration ?? 3,
        key: options.key,
      });
    },
    [messageApi],
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {contextHolder}
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within SnackbarProvider.");
  }
  return context;
};
