export type Purchase = {
  id: string;
  userId: string;
  courseId: string;
  accessType: ACCESS_TYPE;
  purchasedAt: string;
};

export type PurchaseDelivery =
  | {
      mode: ACCESS_TYPE.READ_ONLY;
      targetId: string;
      permissionId?: string;
    }
  | {
      mode: ACCESS_TYPE.CAN_DOWNLOAD;
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

export enum ACCESS_TYPE {
  READ_ONLY = "read_only",
  CAN_DOWNLOAD = "can_download",
}
