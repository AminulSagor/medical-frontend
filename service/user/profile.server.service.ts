import { getServerClient } from "@/service/base/axios_server";
import type { GetUserProfileResponse } from "@/types/user/profile.types";

export async function getUserProfile() {
    const serverClient = await getServerClient();

    const response =
        await serverClient.get<GetUserProfileResponse>("/users/profile");

    return response.data;
}