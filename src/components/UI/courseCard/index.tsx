"use client";

import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
import styles from "./index.module.css";
import type { Props } from "./types";

const CourseCard: FC<Props> = ({
  id,
  description,
  discountedPrice,
  originalPrice,
  thumbnailUrl,
  title,
}) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`/course/${id}`);
  };

  return (
    <div
      className={styles.couseCardContainer}
      role="link"
      tabIndex={0}
      aria-label={`View course ${title}`}
    >
      {/* Thumbnail */}
      <div className={styles.imageContainer}>
        <Image
          src={thumbnailUrl ?? "/placeholder.jpg"}
          alt="Course thumbnail"
          className="h-full w-full object-cover"
          fill
          objectFit="cover"
        />
      </div>

      {/* Content */}
      <div className={styles.contentContainer}>
        <h3 className={styles.titleWrapper}>{title}</h3>

        <p className="line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className={styles.priceContainer}>
          <div className={styles.priceWrapper}>
            <span className="relative text-sm text-gray-500">
              ₹{originalPrice}
              {discountedPrice ? (
                <span
                  className={`${styles.disctountedPriceAnimation} ${styles.animateStrike}`}
                />
              ) : null}
            </span>
            {discountedPrice ? (
              <span className={styles.disctountedPriceWrapper}>
                ₹{discountedPrice}
              </span>
            ) : null}
          </div>

          <Button
            type="primary"
            onClick={(event) => {
              event.stopPropagation();
              handleNavigate();
            }}
          >
            View Course
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
