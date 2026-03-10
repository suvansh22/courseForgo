import { createOrder, verifyPayment } from "@/lib/api/payment";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "../providers/cartProvider";
import { useLoading } from "../providers/loadingProvider";
import { useSnackbar } from "../providers/snackbarProvider";

type ProcessPaymentInput = {
  amount: string;
  currency: string;
  name: string;
  email: string;
};

type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  on: (event: string, handler: (response: unknown) => void) => void;
  open: () => void;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayHandlerResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
};

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

const usePayment = () => {
  const { showLoading, hideLoading } = useLoading();
  const { showSnackbar } = useSnackbar();
  const { clearCart } = useCart();
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
  });
  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
  });

  const processPayment = async ({
    amount,
    currency,
    name,
    email,
  }: ProcessPaymentInput) => {
    showLoading();
    try {
      const parsedAmount = Number.parseFloat(amount);
      if (Number.isNaN(parsedAmount)) {
        throw new Error("Invalid payment amount.");
      }

      const response = await createOrderMutation
        .mutateAsync({
          amount: parsedAmount * 100,
          currency,
        })
        .catch(() => {
          throw new Error("Failed to create order. Please try again.");
        });
      const orderId = response.orderId;
      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!keyId) {
        throw new Error(
          "Razorpay key missing. Set NEXT_PUBLIC_RAZORPAY_KEY_ID.",
        );
      }

      const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor })
        .Razorpay;
      if (!Razorpay) {
        throw new Error("Payment gateway not loaded.");
      }

      await new Promise<void>((resolve, reject) => {
        const options: RazorpayOptions = {
          key: keyId,
          amount: parsedAmount * 100,
          currency,
          name: "The Serene Sedator",
          description: "Notes purchase",
          order_id: orderId,
          handler: async function (response: RazorpayHandlerResponse) {
            try {
              const data = {
                orderCreationId: orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              const res = await verifyPaymentMutation
                .mutateAsync(data)
                .catch(() => {
                  throw new Error("Payment verification failed.");
                });
              if (res.isOk) {
                clearCart();
                showSnackbar("success", {
                  content: "Payment successful.",
                });
                resolve();
              } else {
                reject(
                  new Error(
                    "Payment failed. Please try again. If the amount was deducted, contact support.",
                  ),
                );
              }
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name,
            email,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new Razorpay(options);
        paymentObject.on("payment.failed", function () {
          reject(
            new Error(
              "Payment failed. Please try again. If the amount was deducted, contact support.",
            ),
          );
        });
        paymentObject.open();
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again.";
      showSnackbar("error", { content: message });
    } finally {
      hideLoading();
    }
  };

  return {
    processPayment,
    isCreatingOrder: createOrderMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  };
};

export default usePayment;
