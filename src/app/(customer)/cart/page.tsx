import CartPage from "@/components/pages/cartPage";
import Script from "next/script";

export default function Cart() {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <CartPage />
    </>
  );
}
