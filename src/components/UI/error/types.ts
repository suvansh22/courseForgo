export interface ErrorProps {
  message?: string;
  retryButtonText?: string;
  onRetry?: () => void | Promise<void>;
}
