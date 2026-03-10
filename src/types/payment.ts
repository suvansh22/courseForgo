type CreateOrderResponse = {
  orderId: string;
};
type VerifyPaymentResponse = {
  message: string;
  isOk: boolean;
};

type VerifyPaymentPayload = {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
};

export type { CreateOrderResponse, VerifyPaymentResponse, VerifyPaymentPayload };
