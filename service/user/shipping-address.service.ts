import {
  ShippingAddressData,
  UpdateShippingAddressPayload,
  UpdateShippingAddressResponse,
} from "@/app/public/types/shipping-address.types";
import { serviceClient } from "@/service/base/axios_client";

export const updateShippingAddress = async (
  payload: UpdateShippingAddressPayload,
): Promise<ShippingAddressData> => {
  const response = await serviceClient.patch<UpdateShippingAddressResponse>(
    "/public/orders/shipping-address",
    payload,
  );

  return response.data.data;
};
