"use client";
import { LogoutOutlined } from "@ant-design/icons/";
import Button from "antd/es/button";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

const CartButton = dynamic(() => import("./cartButton"));

const Header = ({ isAdminApp = false }: { isAdminApp?: boolean }) => {
  const { status } = useSession();
  const router = useRouter();
  const handleLogoClick = () => {
    router.push("/");
  };
  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerWrapper}>
        <div
          onClick={handleLogoClick}
          role="button"
          className="cursor-pointer flex items-center gap-2"
        >
          <Image
            alt="The Serene Sedator"
            src="/text_logo.png"
            width={100}
            height={100}
          />
        </div>
        <div className={styles.actions}>
          {status === "authenticated" ? (
            <>
              {isAdminApp ? null : <CartButton />}
              <Button
                type="primary"
                shape="circle"
                size="large"
                onClick={handleSignOut}
                icon={<LogoutOutlined className="text-xl!" />}
              />
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
export default Header;
