import { serviceClient } from "@/service/base/axios_client";
import type {
    GetMasterUsersDirectoryParams,
    MasterUsersDirectoryResponse,
    AdminUserProfileResponse,
    UpdateAdminUserProfileRequest,
    UpdateAdminUserProfileResponse,
    UpdateAdminUserStatusRequest,
    UpdateAdminUserStatusResponse,
} from "@/types/admin/users.types";

export const getMasterUsersDirectory = async (
    params: GetMasterUsersDirectoryParams
): Promise<MasterUsersDirectoryResponse> => {
    const response = await serviceClient.get<MasterUsersDirectoryResponse>(
        "/admin/users/directory/master",
        {
            params,
        }
    );

    return response.data;
};

export const getAdminUserById = async (
    userId: string
): Promise<AdminUserProfileResponse> => {
    const response = await serviceClient.get<AdminUserProfileResponse>(
        `/admin/users/${userId}`
    );

    return response.data;
};

export const updateAdminUserById = async (
    userId: string,
    payload: UpdateAdminUserProfileRequest
): Promise<UpdateAdminUserProfileResponse> => {
    const response = await serviceClient.patch<UpdateAdminUserProfileResponse>(
        `/admin/users/${userId}`,
        payload
    );

    return response.data;
};

export const updateAdminUserStatus = async (
    userId: string,
    payload: UpdateAdminUserStatusRequest
): Promise<UpdateAdminUserStatusResponse> => {
    const response = await serviceClient.patch<UpdateAdminUserStatusResponse>(
        `/admin/users/${userId}/status`,
        payload
    );

    return response.data;
};