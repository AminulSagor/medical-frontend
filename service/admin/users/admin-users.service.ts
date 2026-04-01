import { serviceClient } from "@/service/base/axios_client";
import type { AdminUserRow, AdminUsersResponse } from "../../../types/blogs/admin-users.types";

export async function listAdminUsers(params?: {
  page?: number;
  limit?: number;
}): Promise<AdminUsersResponse> {
  const { data } = await serviceClient.get<AdminUsersResponse>("/admin/users", {
    params,
  });
  return data;
}

export async function listAdminUsersData(params?: {
  page?: number;
  limit?: number;
}): Promise<AdminUserRow[]> {
  const res = await listAdminUsers(params);
  return Array.isArray(res.data) ? res.data : [];
}

