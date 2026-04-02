import { serviceClient } from "@/service/base/axios_client";
import {
  GetUploadUrlRequest,
  GetUploadUrlResponse,
  RefreshReadUrlRequest,
  RefreshReadUrlResponse,
} from "@/types/upload/upload.types";

export const getUploadUrl = async (
  data: GetUploadUrlRequest
): Promise<GetUploadUrlResponse> => {
  const response = await serviceClient.post<GetUploadUrlResponse>(
    `/upload/get-upload-url`,
    data
  );
  return response.data;
};

export const refreshReadUrl = async (
  data: RefreshReadUrlRequest
): Promise<RefreshReadUrlResponse> => {
  const response = await serviceClient.post<RefreshReadUrlResponse>(
    `/upload/refresh-read-url`,
    data
  );
  return response.data;
};
