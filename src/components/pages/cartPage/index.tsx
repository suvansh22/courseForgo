"use client";

import CartCard from "@/components/UI/cartCard";
import usePayment from "@/components/hooks/usePayment";
import { useCart } from "@/components/providers/cartProvider";
import Button from "antd/es/button";
import { useSession } from "next-auth/react";
import styles from "./index.module.css";

const CartPage = () => {
  const { items, total, removeItem } = useCart();
  const { data } = useSession();
  const { processPayment } = usePayment();
  const buyNow = () => {
    processPayment({
      amount: total.toString(),
      currency: "INR",
      name: data?.user?.name as string,
      email: data?.user?.email as string,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.subtitle}>
          {items.length} item{items.length === 1 ? "" : "s"} in your cart
        </p>
      </div>

      <div className={styles.layout}>
        <section className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              Your cart is empty. Add a course to get started.
            </div>
          ) : (
            items.map((item) => (
              <CartCard
                key={`${item.id}-${item.accessType}`}
                title={item.title}
                thumbnailUrl={item.thumbnailUrl}
                originalPrice={item.originalPrice}
                discountedPrice={item.discountedPrice}
                onRemove={() => removeItem(item.id)}
                accessType={item.accessType}
              />
            ))
          )}
        </section>

        <aside className={styles.summary}>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Order Total</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>
                {"\u20B9"}
                {total}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Discounts</span>
              <span className={styles.discount}>Applied</span>
            </div>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>
                {"\u20B9"}
                {total}
              </span>
            </div>
            <Button
              onClick={buyNow}
              type="primary"
              block
              disabled={items.length === 0}
            >
              Buy Now
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
