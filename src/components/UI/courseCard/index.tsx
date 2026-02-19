"use client";

import Button from "antd/es/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";
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
  } = props;

  if (props.variant === "admin") {
    const { isActive, pdfName, onSelect, onEdit, onDelete } = props;
    return (
      <article
        className={`${styles.adminCard} ${isActive ? styles.adminCardActive : ""}`}
        onClick={onSelect}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect();
          }
        }}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
      >
        <div className={styles.adminImageWrapper}>
          <Image
            src={thumbnailUrl ?? "/placeholder.jpg"}
            alt={title}
            fill
            className={styles.adminImage}
            sizes="(max-width: 768px) 100vw, 240px"
          />
        </div>
        <div className={styles.adminInfo}>
          <div className={styles.adminTitleRow}>
            <h3 className={styles.adminTitle}>{title}</h3>
            <span className={styles.adminPrice}>
              {"\u20B9"}
              {discountedPrice ?? originalPrice}
            </span>
          </div>
          <p className={styles.adminDescription}>{description}</p>
          <div className={styles.adminMeta}>
            <span className={styles.adminMetaItem}>
              {"\u20B9"}
              {originalPrice} list
            </span>
            {discountedPrice ? (
              <span className={styles.adminMetaItem}>
                {"\u20B9"}
                {discountedPrice} discounted
              </span>
            ) : null}
            {pdfName ? (
              <span className={styles.adminMetaItem}>PDF: {pdfName}</span>
            ) : (
              <span className={styles.adminMetaItem}>PDF: none</span>
            )}
          </div>
        </div>
        <div className={styles.adminActions}>
          <Button
            type={isActive ? "primary" : "default"}
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
          >
            {isActive ? "Editing" : "Open"}
          </Button>
          <Button
            danger
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            Remove
          </Button>
        </div>
      </article>
    );
  }

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
