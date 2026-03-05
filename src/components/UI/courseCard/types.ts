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
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigate?: (id: string) => void;
};
