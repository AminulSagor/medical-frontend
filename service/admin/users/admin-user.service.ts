import { serviceClient } from "@/service/base/axios_client";
import type { AdminUsersResponse } from "@/types/admin/users/admin-user.types";

export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const response = await serviceClient.get<AdminUsersResponse>("/admin/users");
  return response.data;
};