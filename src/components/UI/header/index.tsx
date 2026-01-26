import { LogoutOutlined, ShoppingCartOutlined } from "@ant-design/icons/";
import Button from "antd/es/button";
import Image from "next/image";
import styles from "./index.module.css";

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className="flex items-center gap-2">
          <Image
            alt="The Serene Sedator"
            src="/text_logo.png"
            width={100}
            height={100}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<ShoppingCartOutlined className="text-xl!" />}
          />
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<LogoutOutlined className="text-xl!" />}
          />
        </div>
      </div>
    </header>
  );
};
export default Header;
