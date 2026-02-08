"use client";

import Button from "antd/es/button";
import Image from "next/image";
import { FC, useMemo, useState } from "react";
import { courseCardsMock } from "@/components/mockData";
import styles from "./index.module.css";

type Course = {
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
  const [inCart, setInCart] = useState(false);
  const data = useMemo(() => course ?? fallbackCourse, [course]);

  return (
    <main className={styles.page}>
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
            <Button type="primary" onClick={() => setInCart(true)}>
              {inCart ? "Go to cart" : "Add to cart"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoursePage;
