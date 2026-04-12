import { serviceClient } from "@/service/base/axios_client";

type GetOrdersResponse = {
  message: string;
  data: any; 
};

export const getEnrolledOrders = async (): Promise<GetOrdersResponse> => {
  const response = await serviceClient.get<GetOrdersResponse>(
    `/public/orders/student/recent-product-order`
  );
  return response.data;
};