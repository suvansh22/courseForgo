type BaseProps = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
};

type PublicProps = BaseProps & {
  variant?: "public";
  onNavigate?: (id: string) => void;
};

type AdminProps = BaseProps & {
  variant: "admin";
  isActive: boolean;
  pdfName?: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export type Props = PublicProps | AdminProps;
