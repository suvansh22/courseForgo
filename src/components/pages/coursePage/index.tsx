"use client";

import { useCart } from "@/components/providers/cartProvider";
import { ACCESS_TYPE } from "@/types/purchase";
import { Radio, RadioChangeEvent } from "antd";
import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, useMemo, useState } from "react";
import styles from "./index.module.css";

type Course = {
  id: string;
  title: string;
  description: string;
  readPrice: number;
  readDiscountedPrice?: number;
  downloadPrice: number;
  downloadDiscountedPrice?: number;
  thumbnailUrl?: string;
};

const CoursePage: FC<{ course: Course }> = ({ course }) => {
  const [value, setValue] = useState<ACCESS_TYPE>(ACCESS_TYPE.READ_ONLY);
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const inCart = useMemo(
    () => isInCart({ id: course.id, accessType: value }),
    [course.id, isInCart, value],
  );
  const readPrice = course.readPrice;
  const readDiscountedPrice = course.readDiscountedPrice;
  const downloadPrice = course.downloadPrice;
  const downloadDiscountedPrice = course.downloadDiscountedPrice;

  const handleCartClick = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    addItem({
      id: course.id,
      title: course.title,
      originalPrice:
        value === ACCESS_TYPE.READ_ONLY ? readPrice : downloadPrice,
      discountedPrice:
        value === ACCESS_TYPE.READ_ONLY
          ? readDiscountedPrice
          : downloadDiscountedPrice,
      thumbnailUrl: course.thumbnailUrl,
      accessType: value,
    });
  };

  const onChange = (e: RadioChangeEvent) => {
    const selectedValue = e.target.value as ACCESS_TYPE;
    setValue(selectedValue);
  };

  return (
    <div className={styles.page}>
      <section className={styles.card}>
        <div className={styles.imageWrapper}>
          <Image
            src={course.thumbnailUrl ?? "/placeholder.jpg"}
            alt={course.title}
            fill
            className={styles.image}
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.description}>{course.description}</p>

          <div className={styles.priceRow}>
            <Radio.Group
              value={value}
              onChange={onChange}
              className={styles.optionsWrapper}
              options={[
                {
                  value: ACCESS_TYPE.READ_ONLY,
                  label: (
                    <div key="read_only_option" className={styles.priceBlock}>
                      <p className={styles.priceLabel}>Read Access</p>
                      <div className={styles.priceWrapper}>
                        <span className={styles.originalPrice}>
                          {"\u20B9"}
                          {readPrice}
                          {readDiscountedPrice ? (
                            <span
                              className={`${styles.discountedPriceAnimation} ${styles.animateStrike}`}
                            />
                          ) : null}
                        </span>
                        {readDiscountedPrice ? (
                          <span className={styles.discountedPrice}>
                            {"\u20B9"}
                            {readDiscountedPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ),
                },
                {
                  value: ACCESS_TYPE.CAN_DOWNLOAD,
                  label: (
                    <div
                      key="can_download_option"
                      className={styles.priceBlock}
                    >
                      <p className={styles.priceLabel}>Download Access</p>
                      <div className={styles.priceWrapper}>
                        <span className={styles.originalPrice}>
                          {"\u20B9"}
                          {downloadPrice}
                          {downloadDiscountedPrice ? (
                            <span
                              className={`${styles.discountedPriceAnimation} ${styles.animateStrike}`}
                            />
                          ) : null}
                        </span>
                        {downloadDiscountedPrice ? (
                          <span className={styles.discountedPrice}>
                            {"\u20B9"}
                            {downloadDiscountedPrice}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="primary"
              onClick={handleCartClick}
              className={styles.addToCartButton}
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
