import {
  CreateOrderResponse,
  VerifyPaymentPayload,
  VerifyPaymentResponse,
} from "@/types/payment";
import { fetchJson } from "../http/client";

export const createOrder = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) =>
  fetchJson<CreateOrderResponse>("/api/payment/create-order", {
    method: "POST",
    body: JSON.stringify({ amount, currency }),
  });

export const verifyPayment = (payload: VerifyPaymentPayload) =>
  fetchJson<VerifyPaymentResponse>("/api/payment/verify-payment", {
    method: "POST",
    body: JSON.stringify(payload),
  });
