export type Props = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  variant?: "public" | "admin";
  onEdit?: () => void;
  onDelete?: () => void;
  onNavigate?: (id: string) => void;
};
