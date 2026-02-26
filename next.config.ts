import type { NextConfig } from "next";

const shouldInitCloudflareDev =
  process.env.ENABLE_CLOUDFLARE_DEV === "1" && !process.env.VERCEL;

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

const createNextConfig = async () => {
  if (shouldInitCloudflareDev) {
    // Delay loading Cloudflare tooling unless explicitly requested.
    const { initOpenNextCloudflareForDev } =
      await import("@opennextjs/cloudflare");
    initOpenNextCloudflareForDev();
  }

  return nextConfig;
};

export default createNextConfig;
