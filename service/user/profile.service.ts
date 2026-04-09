import { serviceClient } from "@/service/base/axios_client";
import type {
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