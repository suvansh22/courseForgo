import { DeleteOutlined } from "@ant-design/icons";
import Button from "antd/es/button";
import Image from "next/image";
import styles from "./index.module.css";

type Props = {
  title: string;
  thumbnailUrl?: string;
  originalPrice: number;
  discountedPrice?: number;
  onRemove: () => void;
};

const CartCard = ({
  title,
  thumbnailUrl,
  originalPrice,
  discountedPrice,
  onRemove,
}: Props) => {
  const price = discountedPrice ?? originalPrice;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={thumbnailUrl ?? "/placeholder.jpg"}
          alt={title}
          fill
          className={styles.image}
        />
      </div>

      <div className={styles.details}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.metaRow}>
            <span className={styles.price}>
              {"\u20B9"}
              {price}
            </span>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onClick={onRemove}
              aria-label="Remove item"
            />
          </div>
        </div>
      </div>
    </article>
  );
};

export default CartCard;
