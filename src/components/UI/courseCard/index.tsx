import Button from "antd/es/button";
import Image from "next/image";
import { FC } from "react";
import styles from "./index.module.css";

const CourseCard: FC<Props> = ({
  description,
  discountedPrice,
  originalPrice,
  thumbnailUrl,
  title,
}) => {
  return (
    <div className={styles.couseCardContainer}>
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

          <Button type="primary">View Course</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
