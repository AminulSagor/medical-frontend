import { serviceClient } from "@/service/base/axios_client";
import type {
    GetUserProfileResponse,
    UpdateUserProfilePayload,
    UpdateUserProfileResponse,
} from "@/types/user/profile.types";

export async function updateUserProfile(
    payload: UpdateUserProfilePayload,
) {
    const response = await serviceClient.patch<UpdateUserProfileResponse>(
        "/users/profile",
        payload,
    );

    return response.data;
}

export async function getUserProfile() {
    const response = await serviceClient.get<GetUserProfileResponse>("/users/profile");

    return response.data;
}
