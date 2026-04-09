import { serviceClient } from "@/service/base/axios_client";
import {
  SendContactUsPayload,
  SendContactUsResponse,
} from "@/types/public/contact-us/contact-us.type";

export const sendContactUsMessage = async (
  payload: SendContactUsPayload,
): Promise<SendContactUsResponse> => {
  const response = await serviceClient.post<SendContactUsResponse>(
    "/contact-us",
    payload,
  );

  return response.data;
};
