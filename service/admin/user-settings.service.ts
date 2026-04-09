import { serviceClient } from "@/service/base/axios_client";
import {
  UpdateEmailRequest,
  UpdateEmailResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
} from "@/types/admin/user-settings.types";

/**
 * Update admin profile email
 * PATCH /admin/users/adminProfile/settings/email
 */
export const updateAdminEmail = async (
  payload: UpdateEmailRequest
): Promise<UpdateEmailResponse> => {
  const response = await serviceClient.patch<UpdateEmailResponse>(
    "/admin/users/adminProfile/settings/email",
    payload
  );
  return response.data;
};

/**
 * Update admin profile password
 * PATCH /admin/users/adminProfile/settings/password
 */
export const updateAdminPassword = async (
  payload: UpdatePasswordRequest
): Promise<UpdatePasswordResponse> => {
  const response = await serviceClient.patch<UpdatePasswordResponse>(
    "/admin/users/adminProfile/settings/password",
    payload
  );
  return response.data;
};
