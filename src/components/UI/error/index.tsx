"use client";

import { ExclamationCircleOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import { useState } from "react";
import styles from "./index.module.css";
import type { ErrorProps } from "./types";

const Error = ({
  message = "Something went wrong. Please try again.",
  retryButtonText = "Retry",
  onRetry,
}: ErrorProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <section className={styles.errorContainer} role="alert" aria-live="polite">
      <div className={styles.iconShell}>
        <ExclamationCircleOutlined className={styles.errorIcon} />
      </div>
      <h2 className={styles.errorTitle}>Something went wrong</h2>
      <p className={styles.errorMessage}>{message}</p>

      {onRetry && (
        <Button
          type="primary"
          loading={isRetrying}
          onClick={handleRetry}
          className={styles.retryButton}
        >
          {retryButtonText}
        </Button>
      )}
    </section>
  );
};

export default Error;
