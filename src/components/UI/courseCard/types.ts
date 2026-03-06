import { CoursePurchaseInfo } from "@/types/course";

export type Props = {
  id: string;
  title: string;
  description: string;
  readPrice: number;
  readDiscountedPrice?: number;
  downloadPrice: number;
  downloadDiscountedPrice?: number;
  thumbnailUrl?: string;
  variant?: "public" | "admin";
  purchaseInfo?: CoursePurchaseInfo;
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigate?: (id: string) => void;
};
