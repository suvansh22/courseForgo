import { useCart } from "@/components/providers/cartProvider";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";
import { FC, MouseEvent } from "react";

type Props = {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
};

const CartButton: FC<Props> = ({
  id,
  title,
  originalPrice,
  discountedPrice,
  thumbnailUrl,
}) => {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const withStopPropagation =
    (handler: () => void) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      handler();
    };
  const inCart = isInCart(id);

  const handleAddToCart = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    addItem({
      id,
      title,
      originalPrice,
      discountedPrice,
      thumbnailUrl,
    });
  };
  return (
    <Button onClick={withStopPropagation(handleAddToCart)}>
      {inCart ? "Go to cart" : "Add to cart"}
    </Button>
  );
};

export default CartButton;
