"use client";

import Button from "antd/es/button";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./index.module.css";

type LoginPageProps = {
  title: string;
  subtitle: string;
  callbackUrl: string;
  audienceLabel: string;
};

const LoginPage = ({
  title,
  subtitle,
  callbackUrl,
  audienceLabel,
}: LoginPageProps) => {
  const { status } = useSession();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, status]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    await signIn("google", { callbackUrl });
    setIsSigningIn(false);
  };

  return (
    <main className={styles.page}>
      <section className={styles.layout}>
        <div className={styles.hero}>
          <p className={styles.eyebrow}>{audienceLabel}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.badges}>
            <span className={styles.badge}>Secure OAuth</span>
            <span className={styles.badge}>Fast access</span>
            <span className={styles.badge}>No password storage</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Image
              alt="The Serene Sedator"
              src="/text_logo.png"
              width={120}
              height={120}
            />
            <div>
              <p className={styles.cardTitle}>Continue with Google</p>
              <p className={styles.cardSubtitle}>
                Use your existing Google account to sign in.
              </p>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            loading={isSigningIn}
            className={styles.button}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>
          <p className={styles.meta}>
            You will be redirected back after authentication.
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
