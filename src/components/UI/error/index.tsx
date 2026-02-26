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
    <div className={styles.errorContainer}>
      <ExclamationCircleOutlined className={styles.errorIcon} />
      <p className={styles.errorMessage}>{message}</p>
      {onRetry && (
        <Button
          type="primary"
          danger
          loading={isRetrying}
          onClick={handleRetry}
          className={styles.retryButton}
        >
          {retryButtonText}
        </Button>
      )}
    </div>
  );
};

export default Error;
