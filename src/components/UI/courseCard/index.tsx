"use client";

import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, MouseEvent } from "react";
import CartButton from "./CartButton";
import styles from "./index.module.css";
import type { Props } from "./types";

const CourseCard: FC<Props> = (props) => {
  const router = useRouter();
  const {
    id,
    description,
    discountedPrice,
    originalPrice,
    thumbnailUrl,
    title,
    variant = "public",
    onEdit = () => {},
    onDelete = () => {},
  } = props;

  const thumbnailSrc = thumbnailUrl ?? "/placeholder.jpg";
  const truncatedDescription =
    description.length > 500
      ? `${description.slice(0, 500).trimEnd()}...`
      : description;

  const withStopPropagation =
    (handler: () => void) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      handler();
    };

  const renderPrice = (price: number) => (
    <>
      {"\u20B9"}
      {price}
    </>
  );

  const handleNavigate = () => {
    if (props.onNavigate) {
      props.onNavigate(id);
      return;
    }
    router.push(`/course/${id}`);
  };

  return (
    <div
      className={styles.couseCardContainer}
      role="link"
      tabIndex={0}
      aria-label={`View course ${title}`}
    >
      <div className={styles.imageContainer}>
        <Image
          src={thumbnailSrc}
          alt="Course thumbnail"
          className="h-full w-full object-cover"
          fill
          objectFit="cover"
        />
      </div>

      <div className={styles.contentContainer}>
        <h3 className={styles.titleWrapper}>{title}</h3>

        <p className="line-clamp-2 text-sm text-gray-600">
          {truncatedDescription}
        </p>

        <div className={styles.priceContainer}>
          <div className={styles.priceWrapper}>
            <span className="relative text-sm text-gray-500">
              {renderPrice(originalPrice)}
              {discountedPrice ? (
                <span
                  className={`${styles.disctountedPriceAnimation} ${styles.animateStrike}`}
                />
              ) : null}
            </span>
            {discountedPrice ? (
              <span className={styles.disctountedPriceWrapper}>
                {renderPrice(discountedPrice)}
              </span>
            ) : null}
          </div>

          <div className={styles.cardActions}>
            {variant === "admin" ? (
              <>
                <Button type={"default"} onClick={withStopPropagation(onEdit)}>
                  Edit
                </Button>
                <Button danger onClick={withStopPropagation(onDelete)}>
                  Remove
                </Button>
              </>
            ) : (
              <>
                <CartButton
                  id={id}
                  originalPrice={originalPrice}
                  title={title}
                  discountedPrice={discountedPrice}
                  thumbnailUrl={thumbnailUrl}
                />
                <Button
                  type="primary"
                  onClick={withStopPropagation(handleNavigate)}
                >
                  View Course
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
