import { serviceClient } from "@/service/base/axios_client";

export const deleteSingleProduct = async (productId: string) => {
  await serviceClient.delete(`/admin/products/${productId}`);
};
