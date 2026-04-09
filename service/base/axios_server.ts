import axios from "axios";
import { cookies } from "next/headers";
import { service_URL } from "@/config/env";

export async function getServerClient() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    return axios.create({
        baseURL: service_URL,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
}