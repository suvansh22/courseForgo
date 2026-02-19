"use client";
import { useCart } from "@/components/providers/cartProvider";
import { ShoppingCartOutlined } from "@ant-design/icons/";
import Badge from "antd/es/badge/Badge";
import Button from "antd/es/button";
import { useRouter } from "next/navigation";
const CartButton = () => {
  const router = useRouter();
  const { items } = useCart();
  const handleCartClick = () => {
    router.push("/cart");
  };
  return (
    <Badge count={items.length}>
      <Button
        type="primary"
        shape="circle"
        size="large"
        icon={<ShoppingCartOutlined className="text-xl!" />}
        onClick={handleCartClick}
      />
    </Badge>
  );
};

export default CartButton;
