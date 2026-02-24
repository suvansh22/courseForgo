export type PdfAsset = {
  id: string;
  storageKey: string;
  originalName: string;
  sizeBytes: number;
  mimeType: "application/pdf";
  checksum?: string;
  pages?: number;
  uploadedByUserId: string;
  uploadedAt: string;
};

export type PdfAssetsResponse = {
  pdfAssets: PdfAsset[];
};

export type PdfAssetResponse = {
  pdfAsset: PdfAsset;
};
