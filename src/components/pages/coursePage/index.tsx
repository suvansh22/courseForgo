"use client";

import { courseCardsMock } from "@/components/mockData";
import { useCart } from "@/components/providers/cartProvider";
import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import styles from "./index.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
};

const fallbackCourse: Course = {
  ...courseCardsMock[0],
  thumbnailUrl: "/placeholder.jpg",
};

const CoursePage: FC<{ course?: Course }> = ({ course }) => {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const data = useMemo(() => course ?? fallbackCourse, [course]);
  const inCart = isInCart(data.id);

  const handleAddToCart = () => {
    addItem({
      id: data.id,
      title: data.title,
      originalPrice: data.originalPrice,
      discountedPrice: data.discountedPrice,
      thumbnailUrl: data.thumbnailUrl,
    });
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={data.thumbnailUrl ?? "/placeholder.jpg"}
            alt={data.title}
            fill
            className={styles.image}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{data.title}</h1>
          <p className={styles.description}>{data.description}</p>

          <div className={styles.priceRow}>
            <div className={styles.priceWrapper}>
              <span className={styles.originalPrice}>
                {"\u20B9"}
                {data.originalPrice}
                {data.discountedPrice ? (
                  <span
                    className={`${styles.discountedPriceAnimation} ${styles.animateStrike}`}
                  />
                ) : null}
              </span>
              {data.discountedPrice ? (
                <span className={styles.discountedPrice}>
                  {"\u20B9"}
                  {data.discountedPrice}
                </span>
              ) : null}
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              onClick={() => {
                if (inCart) {
                  router.push("/cart");
                  return;
                }
                handleAddToCart();
              }}
            >
              {inCart ? "Go to cart" : "Add to cart"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CoursePage;
