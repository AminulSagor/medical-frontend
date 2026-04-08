import { serviceClient } from "@/service/base/axios_client";
import type {
    ChangePasswordPayload,
    ChangePasswordResponse,
} from "@/types/user/password.types";

export async function changeUserPassword(payload: ChangePasswordPayload) {
    const response = await serviceClient.patch<ChangePasswordResponse>(
        "/users/password",
        payload,
    );

    return response.data;
}