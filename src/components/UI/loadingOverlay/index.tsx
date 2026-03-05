"use client";
import { Spin } from "antd";

type LoadingOverlayProps = {
  isVisible: boolean;
  scope?: "screen" | "container";
};

const LoadingOverlay = ({
  isVisible,
  scope = "screen",
}: LoadingOverlayProps) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${
        scope === "container" ? "absolute w-full h-full" : "fixed"
      } inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center rounded-2xl bg-white/95 px-6 py-5 text-gray-900 shadow-xl">
        <Spin size="small" className="text-center" />
      </div>
    </div>
  );
};

export default LoadingOverlay;
