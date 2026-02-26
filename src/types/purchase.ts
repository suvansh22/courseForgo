export type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  accessType: "read_only" | "can_download";
  purchasedAt: string;
};

export type PurchasesResponse = {
  purchases: Purchase[];
};

export type PurchaseResponse = {
  purchase: Purchase;
};
