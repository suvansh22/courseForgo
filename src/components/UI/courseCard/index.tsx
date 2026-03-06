"use client";

import { ACCESS_TYPE } from "@/types/purchase";
import { DownloadOutlined } from "@ant-design/icons";
import EyeOutlined from "@ant-design/icons/EyeOutlined";
import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC, MouseEvent } from "react";
import styles from "./index.module.css";
import type { Props } from "./types";

const PriceContainer = ({
  originalPrice,
  discountedPrice,
  title,
}: {
  originalPrice: number;
  discountedPrice?: number;
  title: string;
}) => {
  const renderPrice = (price: number) => (
    <>
      {"\u20B9"}
      {price}
    </>
  );
  return (
    <div className={styles.priceContainer}>
      <span className={styles.smallTitle}>{title}</span>
      <div className={styles.priceWrapper}>
        <span
          className={`relative ${discountedPrice ? "text-sm text-gray-500" : styles.disctountedPriceWrapper}`}
        >
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
    </div>
  );
};

const CourseCard: FC<Props> = (props) => {
  const router = useRouter();
  const {
    id,
    description,
    readPrice,
    readDiscountedPrice,
    downloadPrice,
    downloadDiscountedPrice,
    thumbnailUrl,
    title,
    purchaseInfo,
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
      onClick={handleNavigate}
    >
      <div className={styles.imageContainer}>
        <div className={styles.viewButton}>
          {variant === "public" &&
          purchaseInfo?.accessType &&
          purchaseInfo?.link ? (
            <>
              {purchaseInfo.accessType === ACCESS_TYPE.READ_ONLY ? (
                <Button icon={<EyeOutlined />} />
              ) : null}
              {purchaseInfo.accessType === ACCESS_TYPE.CAN_DOWNLOAD ? (
                <Button icon={<DownloadOutlined />} />
              ) : null}
            </>
          ) : null}
        </div>
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

        <div>
          {variant === "public" ? (
            <div className={styles.pricesWrapper}>
              <PriceContainer
                originalPrice={readPrice}
                discountedPrice={readDiscountedPrice}
                title="Read only"
              />
              <PriceContainer
                originalPrice={downloadPrice}
                discountedPrice={downloadDiscountedPrice}
                title="Download"
              />
            </div>
          ) : null}
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
