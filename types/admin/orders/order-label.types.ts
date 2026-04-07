export type AdminOrderLabelFormat = "4x6";
export type AdminOrderLabelOrientation = "portrait" | "landscape";

export interface CreateAdminOrderLabelPayload {
  labelFormat: AdminOrderLabelFormat;
  orientation: AdminOrderLabelOrientation;
  includePackingSlip: boolean;
  printInstructions: boolean;
}

export interface CreateAdminOrderLabelResponse {
  message: string;
  orderId: string;
  label: {
    downloadUrl: string;
    previewUrl: string;
  };
}