export type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  accessType: "read_only" | "can_download";
  purchasedAt: string;
};

export type PurchaseDelivery =
  | {
      mode: "read_only";
      targetId: string;
      permissionId?: string;
    }
  | {
      mode: "can_download";
      downloadLink: string | null;
      webViewLink: string | null;
    };

export type PurchasesResponse = {
  purchases: Purchase[];
};

export type PurchaseResponse = {
  purchase: Purchase;
  delivery?: PurchaseDelivery;
};
