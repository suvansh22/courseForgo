import Button from "antd/es/button";
import Image from "next/image";
import styles from "./index.module.css";

type Props = {
  title: string;
  thumbnailUrl?: string;
  originalPrice: number;
  discountedPrice?: number;
  quantity: number;
  onRemove: () => void;
};

const CartCard = ({
  title,
  thumbnailUrl,
  originalPrice,
  discountedPrice,
  quantity,
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
          sizes="96px"
        />
      </div>

      <div className={styles.details}>
        <div className={styles.headerRow}>
          <h3 className={styles.title}>{title}</h3>
          <span className={styles.price}>
            {"\u20B9"}
            {price}
          </span>
        </div>
        <p className={styles.quantity}>Qty: {quantity}</p>
        <Button type="default" danger onClick={onRemove}>
          Remove
        </Button>
      </div>
    </article>
  );
};

export default CartCard;
