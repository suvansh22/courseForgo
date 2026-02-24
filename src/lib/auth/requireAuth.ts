import { authOptions } from "@/lib/auth/auth";
import { getServerSession } from "next-auth";

export const requireAuth = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }
  return session;
};
