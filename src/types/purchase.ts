export type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  purchasedAt: string;
};

export type PurchasesResponse = {
  purchases: Purchase[];
};

export type PurchaseResponse = {
  purchase: Purchase;
};
