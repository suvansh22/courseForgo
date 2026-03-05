import { useCart } from "@/components/providers/cartProvider";
import { ACCESS_TYPE } from "@/types/purchase";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";
import { FC, MouseEvent } from "react";

type Props = {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  accessType: ACCESS_TYPE;
};

const CartButton: FC<Props> = ({
  id,
  title,
  originalPrice,
  discountedPrice,
  thumbnailUrl,
  accessType,
}) => {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const withStopPropagation =
    (handler: () => void) => (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      handler();
    };
  const inCart = isInCart({ id, accessType });

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
      accessType,
    });
  };
  return (
    <Button onClick={withStopPropagation(handleAddToCart)}>
      {inCart ? "Go to cart" : "Add to cart"}
    </Button>
  );
};

export default CartButton;
